import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import * as MediaLibrary from "expo-media-library";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePlayer } from "@/stores/usePlayer";
import { nativeEngine } from "@/stores/nativeEngine";
import { PitchShifter } from "soundtouchjs";
import { rf, rs } from "@/utils/responsive";
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
  track: { height: rs(4), borderRadius: rs(2), backgroundColor: "rgba(255,255,255,0.08)", overflow: "visible", justifyContent: "center" },
  trackDim: { opacity: 0.4 },
  fill: { height: rs(4), borderRadius: rs(2), alignItems: "flex-end", justifyContent: "center" },
  thumb: { width: rs(12), height: rs(12), borderRadius: rs(6), marginRight: rs(-6), borderWidth: 1.5, borderColor: "#020118" },
});

const IS_WEB = Platform.OS === "web";

// cent = unité internationale (1 semitone = 100¢, ISO 16:1975)
const hzToCents = (hz: number) => Math.round(1200 * Math.log2(hz / 440));
const centsToHz  = (c: number) => 440 * Math.pow(2, c / 1200);

// Diapasons de référence — norme ISO 16:1975
const PITCH_STANDARDS: { hz: number; cents: number; name: string; label: string }[] = [
  { hz: 415, cents: -100, name: "Baroque", label: "A415\n−100¢" },
  { hz: 432, cents:  -32, name: "Naturel",  label: "A432\n−32¢"  },
  { hz: 440, cents:    0, name: "ISO",      label: "A440\n0¢"    },
  { hz: 442, cents:    8, name: "France",   label: "A442\n+8¢"   },
  { hz: 443, cents:   12, name: "Berlin",   label: "A443\n+12¢"  },
  { hz: 444, cents:   16, name: "Moderna",  label: "A444\n+16¢"  },
];

// RT60 — norme ISO 3382-1:2009 (temps de réverbération en secondes)
const RT60_STANDARDS = [
  { s: 0.0, label: "0s",    name: "Sec"      },
  { s: 0.3, label: "0.3s",  name: "Studio"   },
  { s: 0.6, label: "0.6s",  name: "Chambre"  },
  { s: 1.2, label: "1.2s",  name: "Concert"  },
  { s: 2.5, label: "2.5s",  name: "Cathédrale"},
];

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
  const [pitchCents, setPitchCentsState] = useState(0); // 0¢ = A440 ISO
  const [rt60, setRt60State] = useState(0); // secondes — ISO 3382-1:2009
  const [is8D, set8DState] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const hitRef = useRef<View>(null);
  const hitLeft = useRef(0);
  const hitWidth = useRef(0);
  const isSeeking = useRef(false);
  const pendingSeekUntil = useRef(0);
  const durationRef = useRef(0);
  const positionRef = useRef(0);
  const seekByPageX = useRef<(pageX: number) => void>(() => {});

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
      usePlayer.getState().setDuration(msg.duration);
      if (!isSeeking.current && Date.now() > pendingSeekUntil.current) {
        positionRef.current = msg.position; setPosition(msg.position);
        usePlayer.getState().setPosition(msg.position);
      }
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
    // impulse identité (1 sample) — remplacé dynamiquement par waApplyRT60
    const identity = ctx.createBuffer(1, 1, ctx.sampleRate);
    identity.getChannelData(0)[0] = 1;
    wa.conv.buffer = identity;
    (wa as typeof waGlobal).gainNode!.connect(wa.master);
    wa.master.connect(wa.dry);
    wa.master.connect(wa.conv);
    wa.conv.connect(wa.wet);
    wa.dry.connect(ctx.destination);
    wa.wet.connect(ctx.destination);
    wa.graphReady = true;
  };

  // pitch indépendant de la vitesse — norme 12-TET ISO 16:1975
  const waApplyRate = () => {
    const s = (wa as typeof waGlobal).shifter;
    if (!s) return;
    const p = prms.current;
    // convertir l'écart de diapason en semitones (12-TET), puis additionner
    const pitchDeviation = 12 * Math.log2(p.pitchHz / 440);
    s.pitchSemitones = p.semitones + pitchDeviation;
    s.tempo = p.speed;
  };

  // RT60 — norme ISO 3382-1:2009 : IR synthétique avec décroissance exponentielle
  const waApplyReverb = () => {
    if (!wa.ctx || !wa.conv || !wa.dry || !wa.wet) return;
    const rt60 = prms.current.reverb; // stocké en secondes dans prms
    if (rt60 <= 0) {
      wa.dry.gain.setTargetAtTime(1, wa.ctx.currentTime, 0.04);
      wa.wet.gain.setTargetAtTime(0, wa.ctx.currentTime, 0.04);
      return;
    }
    // Générer IR avec décroissance e^(−6.9078 × t / RT60) — formule de Schroeder
    const sr = wa.ctx.sampleRate;
    const len = Math.ceil(rt60 * sr);
    const imp = wa.ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const d = imp.getChannelData(c);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-6.9078 * i / (rt60 * sr));
      }
    }
    wa.conv.buffer = imp;
    const wet = Math.min(0.55, rt60 / 3 * 0.55);
    wa.dry.gain.setTargetAtTime(1 - wet * 0.4, wa.ctx.currentTime, 0.04);
    wa.wet.gain.setTargetAtTime(wet,            wa.ctx.currentTime, 0.04);
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
      if (playing && Date.now() > pendingSeekUntil.current) {
        const pos = wg.shifter.timePlayed;
        if (!isSeeking.current) {
          positionRef.current = pos;
          setPosition(pos);
          usePlayer.getState().setPosition(pos);
        }
      }
      const dur = durationRef.current;
      if (dur > 0) usePlayer.getState().setDuration(dur);
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
          // SP a atteint la fin — ignorer si l'audio est en pause
          if (!wg.isPlaying) {
            if (wg.shifter) wg.shifter.percentagePlayed = wg.pausedAt;
            return;
          }
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
    const pitchHz = centsToHz(pitchCents);
    prms.current = { speed, semitones, pitchHz, reverb: rt60, is8D };
    if (!IS_WEB || !wa.graphReady) return;
    waApplyRate();
    waApplyReverb();
    if (is8D !== prev8D) waApply8D();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, semitones, pitchCents, rt60, is8D]);

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
    send({ type: "effects", params: { speed, semitones, pitchHz: centsToHz(pitchCents), reverb: rt60 / 3 * 100, is8D } });
  }, [speed, semitones, pitchCents, rt60, is8D, send]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const playPause = () => {
    if (IS_WEB) {
      const wg = waGlobal;
      if (!wg.shifter || !wg.graphReady || !wg.gainNode) return;
      if (wg.isPlaying) {
        wg.pausedAt = wg.shifter.percentagePlayed;
        wg.gainNode.gain.value = 0;
        wg.isPlaying = false;
        wg.ctx!.suspend();
        setIsPlaying(false);
        usePlayer.getState().setIsPlaying(false);
      } else {
        wg.ctx!.resume().then(() => {
          if (!wg.shifter || !wg.gainNode) return;
          wg.shifter.percentagePlayed = wg.pausedAt;
          wg.gainNode.gain.value = 1;
          wg.isPlaying = true;
          setIsPlaying(true);
          usePlayer.getState().setIsPlaying(true);
          if (prms.current.is8D) waApply8D();
        });
      }
    } else {
      send({ type: isPlaying ? "pause" : "play" });
    }
  };

  const waSeekToPos = (pos: number) => {
    const wg = waGlobal;
    if (!wg.shifter || !wg.gainNode || !wg.graphReady) return;
    const dur = durationRef.current;
    const perc = dur > 0 ? (pos / dur) * 100 : 0;
    wg.pausedAt = perc;
    positionRef.current = pos; setPosition(pos);
    const applySeek = () => {
      if (!wg.shifter || !wg.gainNode) return;
      wg.shifter.percentagePlayed = perc;
      wg.gainNode.gain.value = 1;
      wg.isPlaying = true;
      setIsPlaying(true);
      usePlayer.getState().setIsPlaying(true);
      if (prms.current.is8D) waApply8D();
    };
    if (wg.ctx?.state === "suspended") {
      wg.ctx.resume().then(applySeek);
    } else {
      applySeek();
    }
  };

  const back = () => {
    pendingSeekUntil.current = Date.now() + 600;
    if (IS_WEB) {
      waSeekToPos(Math.max(0, positionRef.current - 10));
    } else {
      const p = Math.max(0, positionRef.current - 10);
      positionRef.current = p; setPosition(p);
      send({ type: "seek", position: p });
    }
  };

  const fwd = () => {
    pendingSeekUntil.current = Date.now() + 600;
    if (IS_WEB) {
      waSeekToPos(Math.min(durationRef.current, positionRef.current + 10));
    } else {
      const p = Math.min(durationRef.current, positionRef.current + 10);
      positionRef.current = p; setPosition(p);
      send({ type: "seek", position: p });
    }
  };

  const applySeekPageX = (pageX: number) => {
    const w = hitWidth.current; const dur = durationRef.current;
    if (!dur || !w) return;
    const ratio = Math.max(0, Math.min(1, (pageX - hitLeft.current) / w));
    const pos = ratio * dur;
    setSeekPct(ratio * 100);
    pendingSeekUntil.current = Date.now() + 600;
    if (IS_WEB) {
      waSeekToPos(pos);
    } else {
      positionRef.current = pos;
      setPosition(pos);
      send({ type: "seek", position: pos });
    }
  };
  seekByPageX.current = applySeekPageX;

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: e => {
      isSeeking.current = true;
      const px = e.nativeEvent.pageX;
      // Mesure fraîche à chaque clique — garantit la position correcte
      hitRef.current?.measureInWindow((x, _y, w) => {
        if (w > 0) { hitLeft.current = x; hitWidth.current = w; }
        seekByPageX.current(px);
      });
    },
    onPanResponderMove: e => { seekByPageX.current(e.nativeEvent.pageX); },
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
    pitch:    "Diapason de référence (norme ISO 16:1975 = A440).\nA415 Baroque  •  A432 Naturaly  •  A440 Standard  •  A442 Française  •  A443 Berlina  •  A444 Moderna",
    reverb:   "RT60 — temps de réverbération (ISO 3382-1:2009).\n0s = Sec  •  0.3s = Studio  •  0.6s = Chambre  •  1.2s = Concert  •  2.5s = Cathédrale",
    e8d:      "Effet spatial rotatif —\ntoy ny feo mandeha manodidina anao",
  };

  const setSpeed = (v: number) => setSpeedState(v);
  const setSemitones = (v: number) => setSemitonesState(Math.round(v));
  const setPitchCents = (v: number) => setPitchCentsState(Math.round(v));
  const setRt60 = (v: number) => setRt60State(Math.round(v * 10) / 10);
  const set8D = (v: boolean) => set8DState(v);
  const resetEffects = () => { setSpeedState(1); setSemitonesState(0); setPitchCentsState(0); setRt60State(0); set8DState(false); };
  const hasEffects = speed !== 1 || semitones !== 0 || pitchCents !== 0 || rt60 > 0 || is8D;
  const pitchHz = centsToHz(pitchCents);

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
                  <Ionicons name="information-circle-outline" size={rs(14)} color={tooltip === "speed" ? "#facc15" : "#3a4e6a"} />
                </TouchableOpacity>
              </View>
              <View style={styles.rowHeadRight}>
                <Text style={[styles.val, speed !== 1 && styles.valOn]}>{speed.toFixed(2)}×</Text>
                {speed !== 1 && (
                  <TouchableOpacity onPress={() => setSpeed(1)} style={styles.inlineReset}>
                    <Ionicons name="refresh" size={rs(11)} color="#facc15" />
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
                  <Ionicons name="information-circle-outline" size={rs(14)} color={tooltip === "semitones" ? "#a78bfa" : "#3a4e6a"} />
                </TouchableOpacity>
              </View>
              {semitones !== 0 && (
                <TouchableOpacity onPress={() => setSemitones(0)} style={styles.inlineReset}>
                  <Ionicons name="refresh" size={rs(11)} color="#a78bfa" />
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
                <Ionicons name="remove" size={rs(18)} color="#a78bfa" />
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
                <Ionicons name="add" size={rs(18)} color="#a78bfa" />
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

          {/* Diapason (cents — unité internationale) */}
          <View style={styles.row}>
            <View style={styles.rowHead}>
              <View style={styles.lblRow}>
                <Text style={styles.lbl}>Diapason</Text>
                <TouchableOpacity onPress={() => showTip("pitch")} style={styles.infoBtn}>
                  <Ionicons name="information-circle-outline" size={rs(14)} color={tooltip === "pitch" ? "#f97316" : "#3a4e6a"} />
                </TouchableOpacity>
              </View>
              <View style={styles.rowHeadRight}>
                <Text style={[styles.val, pitchCents !== 0 && styles.valOn]}>
                  A{Math.round(pitchHz)}
                  {pitchCents !== 0 ? `  ${pitchCents > 0 ? "+" : ""}${pitchCents}¢` : "  0¢"}
                </Text>
                {pitchCents !== 0 && (
                  <TouchableOpacity onPress={() => setPitchCents(0)} style={styles.inlineReset}>
                    <Ionicons name="refresh" size={rs(11)} color="#f97316" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {tooltip === "pitch" && <View style={styles.tipBox}><Text style={styles.tipTxt}>{TIPS.pitch}</Text></View>}
            <Slider value={pitchCents} min={-100} max={20} step={1} onChange={setPitchCents} color="#f97316" />
            <View style={styles.chips}>
              {PITCH_STANDARDS.map(({ cents, label }) => (
                <TouchableOpacity key={cents} onPress={() => setPitchCents(cents)} style={[styles.chip, pitchCents === cents && styles.chipOn]}>
                  <Text style={[styles.chipTxt, pitchCents === cents && styles.chipTxtOn]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reverb */}
          <View style={styles.row}>
            <View style={styles.rowHead}>
              <View style={styles.lblRow}>
                <Text style={styles.lbl}>Reverb RT60</Text>
                <TouchableOpacity onPress={() => showTip("reverb")} style={styles.infoBtn}>
                  <Ionicons name="information-circle-outline" size={rs(14)} color={tooltip === "reverb" ? "#34d399" : "#3a4e6a"} />
                </TouchableOpacity>
              </View>
              <View style={styles.rowHeadRight}>
                <Text style={[styles.val, rt60 > 0 && styles.valOn]}>
                  {rt60.toFixed(1)}s{rt60 > 0 ? `  ${RT60_STANDARDS.find(r => r.s === rt60)?.name ?? ""}` : "  Sec"}
                </Text>
                {rt60 > 0 && (
                  <TouchableOpacity onPress={() => setRt60(0)} style={styles.inlineReset}>
                    <Ionicons name="refresh" size={rs(11)} color="#34d399" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {tooltip === "reverb" && <View style={styles.tipBox}><Text style={styles.tipTxt}>{TIPS.reverb}</Text></View>}
            <Slider value={rt60} min={0} max={3} step={0.1} onChange={setRt60} color="#34d399" />
            <View style={styles.chips}>
              {RT60_STANDARDS.map(({ s, label, name }) => (
                <TouchableOpacity key={s} onPress={() => setRt60(s)} style={[styles.chip, rt60 === s && styles.chipOn]}>
                  <Text style={[styles.chipTxt, rt60 === s && styles.chipTxtOn]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 8D */}
          <View style={[styles.row, styles.rowInline]}>
            <View style={{ gap: rs(3) }}>
              <View style={styles.lblRow}>
                <Text style={styles.lbl}>8D Audio</Text>
                <TouchableOpacity onPress={() => showTip("e8d")} style={styles.infoBtn}>
                  <Ionicons name="information-circle-outline" size={rs(14)} color={tooltip === "e8d" ? "#facc15" : "#3a4e6a"} />
                </TouchableOpacity>
              </View>
              {tooltip === "e8d"
                ? <View style={[styles.tipBox, { marginTop: rs(4) }]}><Text style={styles.tipTxt}>{TIPS.e8d}</Text></View>
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
              <Ionicons name="refresh" size={rs(12)} color={hasEffects ? "#b5c6d6" : "#2a3a5a"} />
              <Text style={[styles.resetTxt, !hasEffects && { color: "#2a3a5a" }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={download} style={styles.dlBtn} disabled={downloading}>
              <Ionicons name={downloading ? "hourglass-outline" : "download-outline"} size={rs(13)} color="#020118" />
              <Text style={styles.dlTxt}>{downloading ? "Saving…" : "Télécharger"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Barre de progression ── */}
      <View
        ref={hitRef}
        style={styles.hitArea}
        onLayout={() => {
          hitRef.current?.measureInWindow((x, _y, w) => {
            if (w > 0) { hitLeft.current = x; hitWidth.current = w; }
          });
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.track} pointerEvents="none">
          <View style={[styles.fill, { width: `${pct}%` }]} pointerEvents="none">
            <View style={[styles.thumb, seekPct !== null && styles.thumbBig]} pointerEvents="none" />
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
          <Ionicons name="play-back" size={rs(22)} color="#b5c6d6" />
          <Text style={styles.sideLbl}>10s</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={playPause} disabled={loading} style={styles.playBtn} activeOpacity={0.85}>
          <View style={styles.playInner}>
            {loading
              ? <Ionicons name="hourglass-outline" size={rs(24)} color="#020118" />
              : <Ionicons name={isPlaying ? "pause" : "play"} size={rs(24)} color="#020118" />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={fwd} disabled={loading || !duration} style={styles.sideBtn}>
          <Ionicons name="play-forward" size={rs(22)} color="#b5c6d6" />
          <Text style={styles.sideLbl}>10s</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowEffects(v => !v)} style={styles.effectsBtn}>
          <View>
            <Ionicons name="options-outline" size={rs(22)} color={showEffects ? "#facc15" : "#b5c6d6"} />
            {hasEffects && <View style={styles.dot} />}
          </View>
          <Text style={[styles.sideLbl, showEffects && { color: "#facc15" }]}>Effets</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", gap: rs(8), overflow: "visible" },

  panel: { gap: rs(14), paddingVertical: rs(10), borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)", marginBottom: rs(2) },
  row: { gap: rs(7) },
  rowInline: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowHeadRight: { flexDirection: "row", alignItems: "center", gap: rs(6) },
  inlineReset: { width: rs(20), height: rs(20), borderRadius: rs(10), backgroundColor: "rgba(255,255,255,0.06)", justifyContent: "center", alignItems: "center" },
  lbl: { fontSize: rf(11), color: "#b5c6d6", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  sublbl: { fontSize: rf(10), color: "#3a4e6a" },
  lblDim: { color: "#3a4e6a" },
  mobileBadge: { paddingHorizontal: rs(5), paddingVertical: rs(1), borderRadius: rs(4), backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  mobileTxt: { fontSize: rf(9), color: "#3a4e6a", fontWeight: "600" },
  val: { fontSize: rf(12), color: "#5a6e90", fontWeight: "700" },
  valOn: { color: "#facc15" },
  chips: { flexDirection: "row", gap: rs(4), flexWrap: "wrap" },
  chip: { paddingHorizontal: rs(8), paddingVertical: rs(3), borderRadius: rs(8), backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  chipOn: { backgroundColor: "rgba(250,204,21,0.12)", borderColor: "rgba(250,204,21,0.3)" },
  chipTxt: { fontSize: rf(10), color: "#3a4e6a", fontWeight: "600" },
  chipTxtOn: { color: "#facc15" },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: rs(2) },
  resetBtn: { flexDirection: "row", alignItems: "center", gap: rs(4), padding: rs(6) },
  resetTxt: { fontSize: rf(11), color: "#b5c6d6", fontWeight: "600" },
  dlBtn: { flexDirection: "row", alignItems: "center", gap: rs(5), backgroundColor: "#facc15", borderRadius: rs(10), paddingHorizontal: rs(12), paddingVertical: rs(6) },
  dlTxt: { fontSize: rf(12), color: "#020118", fontWeight: "700" },

  lblRow: { flexDirection: "row", alignItems: "center", gap: rs(5) },
  infoBtn: { width: rs(18), height: rs(18), justifyContent: "center", alignItems: "center" },
  tipBox: { backgroundColor: "#1a2a4a", borderLeftWidth: 2, borderLeftColor: "#facc15", borderRadius: rs(6), paddingHorizontal: rs(10), paddingVertical: rs(7) },
  tipTxt: { fontSize: rf(11), color: "#b5c6d6", fontWeight: "500", lineHeight: rf(17) },

  stepRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 0 },
  stepBtn: { width: rs(44), height: rs(44), borderRadius: rs(22), backgroundColor: "rgba(167,139,250,0.1)", borderWidth: 1, borderColor: "rgba(167,139,250,0.25)", justifyContent: "center", alignItems: "center" },
  stepBtnDim: { opacity: 0.3 },
  stepDisplay: { flex: 1, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: rs(4) },
  stepVal: { fontSize: rf(26), fontWeight: "800", color: "#5a6e90", letterSpacing: -0.5 },
  stepUnit: { fontSize: rf(12), color: "#5a6e90", fontWeight: "600", marginTop: rs(6) },

  hitArea: { paddingVertical: rs(12), justifyContent: "center", overflow: "visible" },
  track: { height: rs(4), borderRadius: rs(2), backgroundColor: "rgba(255,255,255,0.1)", overflow: "visible", justifyContent: "center" },
  fill: { height: rs(4), borderRadius: rs(2), backgroundColor: "#facc15", alignItems: "flex-end", justifyContent: "center" },
  thumb: { width: rs(10), height: rs(10), borderRadius: rs(5), backgroundColor: "#facc15", borderWidth: 1.5, borderColor: "#020118", marginRight: rs(-5), shadowColor: "#facc15", shadowOpacity: 0.8, shadowRadius: 4, elevation: 3 },
  thumbBig: { width: rs(14), height: rs(14), borderRadius: rs(7), marginRight: rs(-7) },
  times: { flexDirection: "row", justifyContent: "space-between", marginTop: rs(2) },
  time: { fontSize: rf(10), color: "#5a6e90", fontWeight: "600" },

  controls: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: rs(20), position: "relative" },
  sideBtn: { alignItems: "center", gap: rs(2) },
  effectsBtn: { position: "absolute", right: 0, alignItems: "center", gap: rs(2) },
  sideLbl: { fontSize: rf(10), color: "#3a4e6a", fontWeight: "700" },
  dot: { position: "absolute", top: rs(-1), right: rs(-1), width: rs(5), height: rs(5), borderRadius: rs(3), backgroundColor: "#facc15" },
  playBtn: { shadowColor: "#facc15", shadowOffset: { width: 0, height: rs(4) }, shadowOpacity: 0.4, shadowRadius: rs(10), elevation: 6 },
  playInner: { width: rs(54), height: rs(54), borderRadius: rs(27), backgroundColor: "#facc15", justifyContent: "center", alignItems: "center" },
});
