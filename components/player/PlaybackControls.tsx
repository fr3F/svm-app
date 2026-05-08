import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as MediaLibrary from "expo-media-library";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePlayer } from "@/stores/usePlayer";
import { nativeEngine } from "@/stores/nativeEngine";
import { PitchShifter } from "soundtouchjs";
import {
  Alert, PanResponder, Platform, StyleSheet, Switch, Text,
  TouchableOpacity, View,
} from "react-native";

// Session Web Audio persistante au niveau du module — survit aux unmounts
const waGlobal = {
  ctx: null as AudioContext | null,
  shifter: null as PitchShifter | null,
  gainNode: null as GainNode | null,
  master: null as any, dry: null as any, wet: null as any,
  conv: null as any, pan: null as any,
  graphReady: false, pannerOn: false,
  isPlaying: false, pausedAt: 0,
  panAngle: 0, panTimer: null as any, tickTimer: null as any,
  uri: "",
};

interface Props {
  audioSource: any;
  songTitle?: string;
  onEnded?: () => void;
  autoStart?: boolean;
}

// ─── Slider réutilisable ────────────────────────────────────────────────────
function Slider({
  value, min, max, step = 0.01, onChange, disabled = false, color = "#facc15",
}: {
  value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; disabled?: boolean; color?: string;
}) {
  const wRef = useRef(0);
  const disabledRef = useRef(disabled);
  const minRef = useRef(min); const maxRef = useRef(max); const stepRef = useRef(step);
  useEffect(() => { disabledRef.current = disabled; }, [disabled]);

  const calc = (x: number) => {
    if (disabledRef.current) return;
    const w = wRef.current; if (!w) return;
    const ratio = Math.max(0, Math.min(1, x / w));
    const raw = minRef.current + ratio * (maxRef.current - minRef.current);
    onChange(parseFloat((Math.round(raw / stepRef.current) * stepRef.current).toFixed(6)));
  };
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !disabledRef.current,
    onMoveShouldSetPanResponder: () => !disabledRef.current,
    onPanResponderGrant: e => calc(e.nativeEvent.locationX),
    onPanResponderMove: e => calc(e.nativeEvent.locationX),
  })).current;

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <View
      style={[ss.track, disabled && ss.trackDim]}
      onLayout={e => { wRef.current = e.nativeEvent.layout.width; }}
      {...pan.panHandlers}
    >
      <View style={[ss.fill, { width: `${pct}%`, backgroundColor: disabled ? "#1e2d4a" : color }]}>
        <View style={[ss.thumb, { backgroundColor: disabled ? "#2a3a5a" : color }]} />
      </View>
    </View>
  );
}
const ss = StyleSheet.create({
  track: { height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.08)", overflow: "visible", justifyContent: "center" },
  trackDim: { opacity: 0.4 },
  fill: { height: 4, borderRadius: 2, alignItems: "flex-end", justifyContent: "center" },
  thumb: { width: 12, height: 12, borderRadius: 6, marginRight: -6, borderWidth: 1.5, borderColor: "#020118" },
});

const IS_WEB = Platform.OS === "web";

// ─── Composant principal ─────────────────────────────────────────────────────
export default function PlaybackControls({ audioSource, songTitle, onEnded, autoStart }: Props) {
  const onEndedRef = useRef(onEnded);
  useEffect(() => { onEndedRef.current = onEnded; }, [onEnded]);

  // ── Web Audio API direct (web) — session persistante ─────────────────────
  const _localWa = useRef({
    ctx: null as any,
    audioEl: null as HTMLAudioElement | null,
    mediaSource: null as any,
    master: null as any, dry: null as any, wet: null as any,
    conv: null as any, pan: null as any,
    graphReady: false, pannerOn: false,
    panAngle: 0, panTimer: null as any, tickTimer: null as any,
  });
  const wa = IS_WEB ? waGlobal : _localWa.current;
  const prms = useRef({ speed: 1, semitones: 0, pitchHz: 440, reverb: 0, is8D: false });

  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekPct, setSeekPct] = useState<number | null>(null);

  const [showEffects, setShowEffects] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const [semitones, setSemitonesState] = useState(0);
  const [pitchHz, setPitchHzState] = useState(440);
  const [reverb, setReverbState] = useState(0);
  const [is8D, set8DState] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const trackWidth = useRef(0);
  const isSeeking = useRef(false);
  const initTouchX = useRef(0);
  const durationRef = useRef(0);
  const positionRef = useRef(0);

  // ── send (native) ─────────────────────────────────────────────────────────
  const send = useCallback((msg: object) => {
    nativeEngine.webRef?.injectJavaScript(
      `handleMsg(${JSON.stringify(JSON.stringify(msg))});true;`
    );
  }, []);

  // ── Native: message handler (mis à jour chaque render — pas de stale closure) ──
  const msgHandlerRef = useRef<(msg: any) => void>(() => {});
  msgHandlerRef.current = (msg: any) => {
    if (msg.type === "loaded") {
      durationRef.current = msg.duration; setDuration(msg.duration); setLoading(false);
      if (autoStart) send({ type: "play" });
    } else if (msg.type === "status") {
      durationRef.current = msg.duration; setDuration(msg.duration);
      if (!isSeeking.current) { positionRef.current = msg.position; setPosition(msg.position); }
      setIsPlaying(msg.isPlaying);
    } else if (msg.type === "ended") {
      setIsPlaying(false); setPosition(0); positionRef.current = 0;
      onEndedRef.current?.();
    }
  };

  // ── Native: enregistrer le handler une seule fois ─────────────────────────
  useEffect(() => {
    if (IS_WEB) return;
    const stable = (msg: any) => msgHandlerRef.current(msg);
    nativeEngine.msgHandlers.add(stable);
    return () => {
      nativeEngine.msgHandlers.delete(stable);
      // Ne pas arrêter l'audio — il continue en arrière-plan
    };
  }, []);

  // ── Helpers Web Audio ─────────────────────────────────────────────────────
  const waInitGraph = () => {
    const ctx = wa.ctx!;
    (wa as typeof waGlobal).gainNode = ctx.createGain();
    (wa as typeof waGlobal).gainNode!.gain.value = 0;
    wa.master = ctx.createGain(); wa.master.gain.value = 1;
    wa.dry = ctx.createGain();    wa.dry.gain.value = 1;
    wa.wet = ctx.createGain();    wa.wet.gain.value = 0;
    wa.conv = ctx.createConvolver();
    const len = ctx.sampleRate * 3;
    const imp = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = imp.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
    }
    wa.conv.buffer = imp;
    (wa as typeof waGlobal).gainNode!.connect(wa.master);
    wa.master.connect(wa.dry);
    wa.master.connect(wa.conv);
    wa.conv.connect(wa.wet);
    wa.dry.connect(ctx.destination);
    wa.wet.connect(ctx.destination);
    wa.graphReady = true;
  };

  // pitch indépendant de la vitesse grâce à PitchShifter
  const waApplyRate = () => {
    const s = (wa as typeof waGlobal).shifter;
    if (!s) return;
    const p = prms.current;
    s.pitch = Math.pow(2, p.semitones / 12) * (p.pitchHz / 440);
    s.tempo = p.speed;
  };

  const waApplyReverb = () => {
    if (!wa.dry) return;
    const amt = prms.current.reverb / 100;
    wa.dry.gain.setTargetAtTime(1 - amt * 0.85, wa.ctx.currentTime, 0.04);
    wa.wet.gain.setTargetAtTime(amt * 0.9,       wa.ctx.currentTime, 0.04);
  };

  const waApply8D = () => {
    if (!wa.graphReady) return;
    if (prms.current.is8D && !wa.pannerOn) {
      wa.pan = wa.ctx.createPanner();
      wa.pan.panningModel = "HRTF"; wa.pan.distanceModel = "linear";
      wa.pan.refDistance = 1; wa.pan.maxDistance = 10; wa.pan.rolloffFactor = 0;
      try { wa.dry.disconnect(wa.ctx.destination); } catch {}
      try { wa.wet.disconnect(wa.ctx.destination); } catch {}
      wa.dry.connect(wa.pan); wa.wet.connect(wa.pan); wa.pan.connect(wa.ctx.destination);
      wa.pannerOn = true;
      wa.panTimer = setInterval(() => {
        wa.panAngle = (wa.panAngle + 3) % 360;
        const rad = wa.panAngle * Math.PI / 180;
        wa.pan.positionX.setTargetAtTime(Math.sin(rad) * 3, wa.ctx.currentTime, 0.01);
        wa.pan.positionZ.setTargetAtTime(-Math.cos(rad) * 3, wa.ctx.currentTime, 0.01);
      }, 50);
    } else if (!prms.current.is8D && wa.pannerOn) {
      clearInterval(wa.panTimer); wa.panTimer = null;
      try { wa.dry.disconnect(wa.pan); } catch {}
      try { wa.wet.disconnect(wa.pan); } catch {}
      try { wa.pan.disconnect(wa.ctx.destination); } catch {}
      wa.pan = null; wa.pannerOn = false;
      wa.dry.connect(wa.ctx.destination);
      wa.wet.connect(wa.ctx.destination);
    }
  };

  const waStartTick = () => {
    if (wa.tickTimer) clearInterval(wa.tickTimer);
    wa.tickTimer = setInterval(() => {
      const wg = wa as typeof waGlobal;
      if (!wg.shifter) return;
      const playing = wg.isPlaying;
      if (playing) {
        const pos = wg.shifter.timePlayed;
        if (!isSeeking.current) { positionRef.current = pos; setPosition(pos); }
      }
      setIsPlaying(playing);
      usePlayer.getState().setIsPlaying(playing);
    }, 200);
  };

  // ── Web: chargement audio via PitchShifter ───────────────────────────────
  useEffect(() => {
    if (!IS_WEB || !audioSource) return;
    let active = true;
    const wg = waGlobal;

    setLoading(true);

    (async () => {
      try {
        const asset = Asset.fromModule(audioSource);
        await asset.downloadAsync();
        if (!active) return;
        const uri = asset.uri;

        // REATTACH : même audio déjà chargé
        if (wg.uri === uri && wg.shifter && wg.graphReady) {
          const dur = wg.shifter.duration;
          durationRef.current = dur; setDuration(dur);
          const pos = wg.isPlaying ? wg.shifter.timePlayed : wg.pausedAt * dur / 100;
          positionRef.current = pos; setPosition(pos);
          setIsPlaying(wg.isPlaying);
          setLoading(false);
          waStartTick();
          return;
        }

        // NOUVEAU : teardown
        clearInterval(wg.tickTimer); clearInterval(wg.panTimer);
        wg.tickTimer = null; wg.panTimer = null;
        if (wg.shifter) { try { wg.shifter.disconnect(); } catch {} wg.shifter = null; }
        wg.gainNode = null; wg.graphReady = false; wg.pannerOn = false; wg.pan = null;
        wg.isPlaying = false; wg.pausedAt = 0;
        try { wg.ctx?.close(); } catch {}
        wg.ctx = null; wg.uri = "";

        setIsPlaying(false); setPosition(0); setDuration(0);

        // Charger comme ArrayBuffer pour PitchShifter
        const resp = await fetch(uri);
        if (!active) return;
        const arrayBuf = await resp.arrayBuffer();
        if (!active) return;

        wg.ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)() as AudioContext;
        const audioBuf = await (wg.ctx as AudioContext).decodeAudioData(arrayBuf);
        if (!active) return;

        waInitGraph();

        wg.uri = uri;
        durationRef.current = audioBuf.duration; setDuration(audioBuf.duration);

        wg.shifter = new PitchShifter(wg.ctx as AudioContext, audioBuf, 4096, () => {
          // onEnd
          wg.isPlaying = false; wg.pausedAt = 0;
          wg.gainNode!.gain.value = 0;
          setIsPlaying(false); setPosition(0); positionRef.current = 0;
          usePlayer.getState().setIsPlaying(false);
          onEndedRef.current?.();
        });
        wg.shifter.connect(wg.gainNode!);
        waApplyRate();

        setLoading(false);
        waStartTick();
      } catch { if (active) setLoading(false); }
    })();

    return () => {
      active = false;
      clearInterval(wg.tickTimer);
      wg.tickTimer = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSource]);

  // ── Web: sync effets ──────────────────────────────────────────────────────
  useEffect(() => {
    const prev8D = prms.current.is8D;
    prms.current = { speed, semitones, pitchHz, reverb, is8D };
    if (!IS_WEB || !wa.graphReady) return;
    waApplyRate();
    waApplyReverb();
    if (is8D !== prev8D) waApply8D();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, semitones, pitchHz, reverb, is8D]);

  // ── Native: chargement audio (avec REATTACH) ──────────────────────────────
  useEffect(() => {
    if (IS_WEB || !audioSource) return;
    let cancelled = false;

    const doLoad = async () => {
      try {
        setLoading(true);
        const asset = Asset.fromModule(audioSource);
        await asset.downloadAsync();
        if (cancelled) return;
        const uri = asset.localUri ?? asset.uri;
        if (!uri) throw new Error("uri null");

        // REATTACH : même audio déjà chargé — juste reprendre
        if (nativeEngine.uri === uri) {
          setLoading(false);
          if (autoStart) send({ type: "play" });
          return;
        }

        nativeEngine.uri = uri;
        send({ type: "load", uri });
      } catch {
        if (!cancelled) setLoading(false);
      }
    };

    if (nativeEngine.ready) {
      doLoad();
    } else {
      nativeEngine.onReadyCallbacks.add(doLoad);
    }

    return () => {
      cancelled = true;
      nativeEngine.onReadyCallbacks.delete(doLoad);
      // Ne pas arrêter l'audio — il continue en arrière-plan
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSource]);

  // ── Native: sync effets ───────────────────────────────────────────────────
  useEffect(() => {
    if (IS_WEB) return;
    send({ type: "effects", params: { speed, semitones, pitchHz, reverb, is8D } });
  }, [speed, semitones, pitchHz, reverb, is8D, send]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const playPause = () => {
    if (IS_WEB) {
      const wg = waGlobal;
      if (!wg.shifter || !wg.graphReady || !wg.gainNode) return;
      if (wg.ctx!.state === "suspended") wg.ctx!.resume();
      if (wg.isPlaying) {
        wg.pausedAt = wg.shifter.percentagePlayed;
        wg.gainNode.gain.value = 0;
        wg.isPlaying = false;
        setIsPlaying(false);
        usePlayer.getState().setIsPlaying(false);
      } else {
        wg.shifter.percentagePlayed = wg.pausedAt;
        wg.gainNode.gain.value = 1;
        wg.isPlaying = true;
        setIsPlaying(true);
        usePlayer.getState().setIsPlaying(true);
        if (prms.current.is8D) waApply8D();
      }
    } else {
      send({ type: isPlaying ? "pause" : "play" });
    }
  };

  const waSeekToPos = (pos: number) => {
    const wg = waGlobal;
    if (!wg.shifter) return;
    const dur = durationRef.current;
    const perc = dur > 0 ? (pos / dur) * 100 : 0;
    wg.shifter.percentagePlayed = perc;
    if (!wg.isPlaying) wg.pausedAt = perc;
    positionRef.current = pos; setPosition(pos);
  };

  const back = () => {
    if (IS_WEB) {
      waSeekToPos(Math.max(0, positionRef.current - 10));
    } else {
      const p = Math.max(0, positionRef.current - 10);
      send({ type: "seek", position: p }); setPosition(p);
    }
  };

  const fwd = () => {
    if (IS_WEB) {
      waSeekToPos(Math.min(durationRef.current, positionRef.current + 10));
    } else {
      const p = Math.min(durationRef.current, positionRef.current + 10);
      send({ type: "seek", position: p }); setPosition(p);
    }
  };

  const seekTo = (x: number) => {
    const w = trackWidth.current; const dur = durationRef.current;
    if (!dur || !w) return;
    const ratio = Math.max(0, Math.min(1, x / w));
    const pos = ratio * dur;
    setSeekPct(ratio * 100);
    if (IS_WEB) {
      waSeekToPos(pos);
    } else {
      send({ type: "seek", position: pos });
    }
  };

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: e => { isSeeking.current = true; initTouchX.current = e.nativeEvent.locationX; seekTo(e.nativeEvent.locationX); },
    onPanResponderMove: (e, gs) => { seekTo(initTouchX.current + gs.dx); },
    onPanResponderRelease: () => { isSeeking.current = false; setSeekPct(null); },
    onPanResponderTerminate: () => { isSeeking.current = false; setSeekPct(null); },
  })).current;

  const fmt = (s: number) => {
    if (!s || s < 0) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const pct = seekPct !== null ? seekPct : (duration > 0 ? (position / duration) * 100 : 0);

  // ── Tooltips ──────────────────────────────────────────────────────────────
  const [tooltip, setTooltip] = useState<string | null>(null);
  const tipTimer = useRef<any>(null);
  const showTip = (id: string) => {
    if (tipTimer.current) clearTimeout(tipTimer.current);
    setTooltip(prev => (prev === id ? null : id));
    tipTimer.current = setTimeout(() => setTooltip(null), 3500);
  };
  const TIPS: Record<string, string> = {
    speed:    "Manova ny hafainganana ny hira.\n1× = tsy miovaova  •  2× = roa heny haingana",
    semitones:"Manova ny feony ny hira.\n+1 = misondrotra demi-ton 1  •  −12 = midina oktava iray",
    pitch:    "Manova ny diapason de référence.\n440 Hz = fenitra  •  432 Hz = accordage naturaly",
    reverb:   "Manova ny echo sy résonnance.\n0% = tsy misy  •  100% = echo be",
    e8d:      "Effet spatial rotatif —\ntoy ny feo mandeha manodidina anao",
  };

  const setSpeed = (v: number) => setSpeedState(v);
  const setSemitones = (v: number) => setSemitonesState(Math.round(v));
  const setPitchHz = (v: number) => setPitchHzState(Math.round(v));
  const setReverb = (v: number) => setReverbState(v);
  const set8D = (v: boolean) => set8DState(v);
  const resetEffects = () => { setSpeedState(1); setSemitonesState(0); setPitchHzState(440); setReverbState(0); set8DState(false); };
  const hasEffects = speed !== 1 || semitones !== 0 || pitchHz !== 440 || reverb > 0 || is8D;

  useEffect(() => { resetEffects(); }, [audioSource]); // eslint-disable-line react-hooks/exhaustive-deps

  const download = async () => {
    if (downloading || !audioSource) return;
    try {
      setDownloading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") { Alert.alert("Permission refusée", "Autorise l'accès au stockage."); return; }
      const asset = Asset.fromModule(audioSource);
      await asset.downloadAsync();
      if (!asset.localUri) throw new Error("localUri null");
      await MediaLibrary.createAssetAsync(asset.localUri);
      Alert.alert("Téléchargé ✓", `"${songTitle ?? "Audio"}" sauvegardé.`);
    } catch { Alert.alert("Erreur", "Impossible de télécharger."); }
    finally { setDownloading(false); }
  };

  return (
    <View style={styles.wrap}>
      {/* ── Panneau effets ── */}
      {showEffects && (
        <View style={styles.panel}>

          {/* Speed */}
          <View style={styles.row}>
            <View style={styles.rowHead}>
              <View style={styles.lblRow}>
                <Text style={styles.lbl}>Vitesse</Text>
                <TouchableOpacity onPress={() => showTip("speed")} style={styles.infoBtn}>
                  <Ionicons name="information-circle-outline" size={14} color={tooltip === "speed" ? "#facc15" : "#3a4e6a"} />
                </TouchableOpacity>
              </View>
              <View style={styles.rowHeadRight}>
                <Text style={[styles.val, speed !== 1 && styles.valOn]}>{speed.toFixed(2)}×</Text>
                {speed !== 1 && (
                  <TouchableOpacity onPress={() => setSpeed(1)} style={styles.inlineReset}>
                    <Ionicons name="refresh" size={11} color="#facc15" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {tooltip === "speed" && <View style={styles.tipBox}><Text style={styles.tipTxt}>{TIPS.speed}</Text></View>}
            <Slider value={speed} min={0.5} max={2} step={0.05} onChange={setSpeed} color="#facc15" />
            <View style={styles.chips}>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(v => (
                <TouchableOpacity key={v} onPress={() => setSpeed(v)} style={[styles.chip, speed === v && styles.chipOn]}>
                  <Text style={[styles.chipTxt, speed === v && styles.chipTxtOn]}>{v}×</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Semitones */}
          <View style={styles.row}>
            <View style={styles.rowHead}>
              <View style={styles.lblRow}>
                <Text style={styles.lbl}>Semitones</Text>
                <TouchableOpacity onPress={() => showTip("semitones")} style={styles.infoBtn}>
                  <Ionicons name="information-circle-outline" size={14} color={tooltip === "semitones" ? "#a78bfa" : "#3a4e6a"} />
                </TouchableOpacity>
              </View>
              {semitones !== 0 && (
                <TouchableOpacity onPress={() => setSemitones(0)} style={styles.inlineReset}>
                  <Ionicons name="refresh" size={11} color="#a78bfa" />
                </TouchableOpacity>
              )}
            </View>
            {tooltip === "semitones" && <View style={styles.tipBox}><Text style={styles.tipTxt}>{TIPS.semitones}</Text></View>}
            <View style={styles.stepRow}>
              <TouchableOpacity
                onPress={() => setSemitones(semitones - 1)}
                disabled={semitones <= -12}
                style={[styles.stepBtn, semitones <= -12 && styles.stepBtnDim]}
              >
                <Ionicons name="remove" size={18} color="#a78bfa" />
              </TouchableOpacity>
              <View style={styles.stepDisplay}>
                <Text style={[styles.stepVal, semitones !== 0 && { color: "#a78bfa" }]}>
                  {semitones > 0 ? `+${semitones}` : semitones}
                </Text>
                <Text style={styles.stepUnit}>st</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSemitones(semitones + 1)}
                disabled={semitones >= 12}
                style={[styles.stepBtn, semitones >= 12 && styles.stepBtnDim]}
              >
                <Ionicons name="add" size={18} color="#a78bfa" />
              </TouchableOpacity>
            </View>
            <View style={styles.chips}>
              {[-6, -4, -2, 0, 2, 4, 6].map(v => (
                <TouchableOpacity key={v} onPress={() => setSemitones(v)} style={[styles.chip, semitones === v && styles.chipOn]}>
                  <Text style={[styles.chipTxt, semitones === v && styles.chipTxtOn]}>{v > 0 ? `+${v}` : v}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pitch Hz */}
          <View style={styles.row}>
            <View style={styles.rowHead}>
              <View style={styles.lblRow}>
                <Text style={styles.lbl}>Pitch</Text>
                <TouchableOpacity onPress={() => showTip("pitch")} style={styles.infoBtn}>
                  <Ionicons name="information-circle-outline" size={14} color={tooltip === "pitch" ? "#f97316" : "#3a4e6a"} />
                </TouchableOpacity>
              </View>
              <View style={styles.rowHeadRight}>
                <Text style={[styles.val, pitchHz !== 440 && styles.valOn]}>{pitchHz} Hz</Text>
                {pitchHz !== 440 && (
                  <TouchableOpacity onPress={() => setPitchHz(440)} style={styles.inlineReset}>
                    <Ionicons name="refresh" size={11} color="#f97316" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {tooltip === "pitch" && <View style={styles.tipBox}><Text style={styles.tipTxt}>{TIPS.pitch}</Text></View>}
            <Slider value={pitchHz} min={415} max={466} step={1} onChange={setPitchHz} color="#f97316" />
            <View style={styles.chips}>
              {[415, 432, 440, 444, 446, 466].map(v => (
                <TouchableOpacity key={v} onPress={() => setPitchHz(v)} style={[styles.chip, pitchHz === v && styles.chipOn]}>
                  <Text style={[styles.chipTxt, pitchHz === v && styles.chipTxtOn]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reverb */}
          <View style={styles.row}>
            <View style={styles.rowHead}>
              <View style={styles.lblRow}>
                <Text style={styles.lbl}>Reverb</Text>
                <TouchableOpacity onPress={() => showTip("reverb")} style={styles.infoBtn}>
                  <Ionicons name="information-circle-outline" size={14} color={tooltip === "reverb" ? "#34d399" : "#3a4e6a"} />
                </TouchableOpacity>
              </View>
              <View style={styles.rowHeadRight}>
                <Text style={[styles.val, reverb > 0 && styles.valOn]}>{Math.round(reverb)}%</Text>
                {reverb > 0 && (
                  <TouchableOpacity onPress={() => setReverb(0)} style={styles.inlineReset}>
                    <Ionicons name="refresh" size={11} color="#34d399" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {tooltip === "reverb" && <View style={styles.tipBox}><Text style={styles.tipTxt}>{TIPS.reverb}</Text></View>}
            <Slider value={reverb} min={0} max={100} step={1} onChange={setReverb} color="#34d399" />
            <View style={styles.chips}>
              {[0, 20, 40, 60, 80, 100].map(v => (
                <TouchableOpacity key={v} onPress={() => setReverb(v)} style={[styles.chip, reverb === v && styles.chipOn]}>
                  <Text style={[styles.chipTxt, reverb === v && styles.chipTxtOn]}>{v}%</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 8D */}
          <View style={[styles.row, styles.rowInline]}>
            <View style={{ gap: 3 }}>
              <View style={styles.lblRow}>
                <Text style={styles.lbl}>8D Audio</Text>
                <TouchableOpacity onPress={() => showTip("e8d")} style={styles.infoBtn}>
                  <Ionicons name="information-circle-outline" size={14} color={tooltip === "e8d" ? "#facc15" : "#3a4e6a"} />
                </TouchableOpacity>
              </View>
              {tooltip === "e8d"
                ? <View style={[styles.tipBox, { marginTop: 4 }]}><Text style={styles.tipTxt}>{TIPS.e8d}</Text></View>
                : <Text style={styles.sublbl}>Effet spatial rotatif</Text>
              }
            </View>
            <Switch
              value={is8D}
              onValueChange={set8D}
              trackColor={{ false: "#1a2a4a", true: "rgba(250,204,21,0.3)" }}
              thumbColor={is8D ? "#facc15" : "#3a4e6a"}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={resetEffects} style={styles.resetBtn} disabled={!hasEffects}>
              <Ionicons name="refresh" size={12} color={hasEffects ? "#b5c6d6" : "#2a3a5a"} />
              <Text style={[styles.resetTxt, !hasEffects && { color: "#2a3a5a" }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={download} style={styles.dlBtn} disabled={downloading}>
              <Ionicons name={downloading ? "hourglass-outline" : "download-outline"} size={13} color="#020118" />
              <Text style={styles.dlTxt}>{downloading ? "Saving…" : "Télécharger"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Barre de progression ── */}
      <View
        style={styles.hitArea}
        onLayout={e => { trackWidth.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
      >
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]}>
            <View style={[styles.thumb, seekPct !== null && styles.thumbBig]} />
          </View>
        </View>
      </View>

      {/* ── Temps ── */}
      <View style={styles.times}>
        <Text style={styles.time}>{fmt(seekPct !== null ? (seekPct / 100) * duration : position)}</Text>
        <Text style={styles.time}>{fmt(duration)}</Text>
      </View>

      {/* ── Contrôles ── */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={back} disabled={loading || !duration} style={styles.sideBtn}>
          <Ionicons name="play-back" size={22} color="#b5c6d6" />
          <Text style={styles.sideLbl}>10s</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={playPause} disabled={loading} style={styles.playBtn} activeOpacity={0.85}>
          <View style={styles.playInner}>
            {loading
              ? <Ionicons name="hourglass-outline" size={24} color="#020118" />
              : <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#020118" />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={fwd} disabled={loading || !duration} style={styles.sideBtn}>
          <Ionicons name="play-forward" size={22} color="#b5c6d6" />
          <Text style={styles.sideLbl}>10s</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowEffects(v => !v)} style={styles.effectsBtn}>
          <View>
            <Ionicons name="options-outline" size={22} color={showEffects ? "#facc15" : "#b5c6d6"} />
            {hasEffects && <View style={styles.dot} />}
          </View>
          <Text style={[styles.sideLbl, showEffects && { color: "#facc15" }]}>Effets</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", gap: 8 },

  panel: { gap: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)", marginBottom: 2 },
  row: { gap: 7 },
  rowInline: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowHeadRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  inlineReset: { width: 20, height: 20, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.06)", justifyContent: "center", alignItems: "center" },
  lbl: { fontSize: 11, color: "#b5c6d6", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  sublbl: { fontSize: 10, color: "#3a4e6a" },
  lblDim: { color: "#3a4e6a" },
  mobileBadge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  mobileTxt: { fontSize: 9, color: "#3a4e6a", fontWeight: "600" },
  val: { fontSize: 12, color: "#5a6e90", fontWeight: "700" },
  valOn: { color: "#facc15" },
  chips: { flexDirection: "row", gap: 4, flexWrap: "wrap" },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  chipOn: { backgroundColor: "rgba(250,204,21,0.12)", borderColor: "rgba(250,204,21,0.3)" },
  chipTxt: { fontSize: 10, color: "#3a4e6a", fontWeight: "600" },
  chipTxtOn: { color: "#facc15" },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  resetBtn: { flexDirection: "row", alignItems: "center", gap: 4, padding: 6 },
  resetTxt: { fontSize: 11, color: "#b5c6d6", fontWeight: "600" },
  dlBtn: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#facc15", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  dlTxt: { fontSize: 12, color: "#020118", fontWeight: "700" },

  lblRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  infoBtn: { width: 18, height: 18, justifyContent: "center", alignItems: "center" },
  tipBox: { backgroundColor: "#1a2a4a", borderLeftWidth: 2, borderLeftColor: "#facc15", borderRadius: 6, paddingHorizontal: 10, paddingVertical: 7 },
  tipTxt: { fontSize: 11, color: "#b5c6d6", fontWeight: "500", lineHeight: 17 },

  stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 0 },
  stepBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(167,139,250,0.1)", borderWidth: 1, borderColor: "rgba(167,139,250,0.25)", justifyContent: "center", alignItems: "center" },
  stepBtnDim: { opacity: 0.3 },
  stepDisplay: { flex: 1, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 4 },
  stepVal: { fontSize: 26, fontWeight: "800", color: "#5a6e90", letterSpacing: -0.5 },
  stepUnit: { fontSize: 12, color: "#5a6e90", fontWeight: "600", marginTop: 6 },

  hitArea: { paddingVertical: 10, justifyContent: "center", marginVertical: -10 },
  track: { height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.1)", overflow: "visible", justifyContent: "center" },
  fill: { height: 4, borderRadius: 2, backgroundColor: "#facc15", alignItems: "flex-end", justifyContent: "center" },
  thumb: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#facc15", borderWidth: 1.5, borderColor: "#020118", marginRight: -5, shadowColor: "#facc15", shadowOpacity: 0.8, shadowRadius: 4, elevation: 3 },
  thumbBig: { width: 14, height: 14, borderRadius: 7, marginRight: -7 },
  times: { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  time: { fontSize: 10, color: "#5a6e90", fontWeight: "600" },

  controls: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, position: "relative" },
  sideBtn: { alignItems: "center", gap: 2 },
  effectsBtn: { position: "absolute", right: 0, alignItems: "center", gap: 2 },
  sideLbl: { fontSize: 10, color: "#3a4e6a", fontWeight: "700" },
  dot: { position: "absolute", top: -1, right: -1, width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#facc15" },
  playBtn: { shadowColor: "#facc15", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  playInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#facc15", justifyContent: "center", alignItems: "center" },
});
