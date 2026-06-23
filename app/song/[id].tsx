import { songs } from "@/assets/data/songs";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import LyricsDisplay from "@/components/player/LyricsDisplay";
import PlaybackControls from "@/components/player/PlaybackControls";
import Screen from "@/components/Screen";
import ShareSongModal from "@/components/ShareSongModal";
import { BAR_H } from "@/components/TabBar";
import { useFavorites } from "@/stores/useFavorites";
import { addToHistory } from "@/stores/useHistory";
import { usePlayer } from "@/stores/usePlayer";
import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image, ScrollView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const FONT_SIZE_KEY = "lyrics_font_size";
const FONT_MIN = 12;
const FONT_MAX = 28;
const FONT_DEFAULT = 16;

const playbackSongs = songs.filter(s => s.type === "playback" && s.audio);

export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, toggle } = useFavorites();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors: c } = useTheme();
  const [showPlayer, setShowPlayer] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [fontSize, setFontSizeState] = useState<number>(FONT_DEFAULT);

  useEffect(() => {
    AsyncStorage.getItem(FONT_SIZE_KEY).then(v => {
      if (v) setFontSizeState(Number(v));
    });
  }, []);

  const changeFontSize = (delta: number) => {
    setFontSizeState(prev => {
      const next = Math.min(FONT_MAX, Math.max(FONT_MIN, prev + delta));
      AsyncStorage.setItem(FONT_SIZE_KEY, String(next));
      return next;
    });
  };
  const scrollRef = useRef<ScrollView>(null);
  const contentHeightRef = useRef(0);
  const viewportHeightRef = useRef(0);
  const lineYPositionsRef = useRef<number[]>([]);
  const lastLineIndexRef = useRef(-1);
  const [activeSongId, setActiveSongId] = useState(id ?? "");
  const [autoStartPlayer, setAutoStartPlayer] = useState(false);
  const playerEverShown = useRef(false);
  if (showPlayer) playerEverShown.current = true;

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/about");
  };

  const song = id ? songs.find(s => s.id === id) : undefined;
  const activeSong = songs.find(s => s.id === activeSongId) ?? song;

  const pbIndex = playbackSongs.findIndex(s => s.id === activeSongId);
  const prevSong = pbIndex > 0 ? playbackSongs[pbIndex - 1] : null;
  const nextSong = pbIndex >= 0 && pbIndex < playbackSongs.length - 1 ? playbackSongs[pbIndex + 1] : null;

  useEffect(() => {
    usePlayer.getState().setCurrentPageId(id ?? null);
    if (id) addToHistory(id);
    return () => usePlayer.getState().setCurrentPageId(null);
  }, [id]);

  useEffect(() => {
    if (!autoScroll) return;
    lastLineIndexRef.current = -1;
    const interval = setInterval(() => {
      const { position, duration, isPlaying } = usePlayer.getState();
      if (!isPlaying || !duration) return;
      const positions = lineYPositionsRef.current;
      if (positions.length === 0) return;

      // Identify current line index proportionally
      const lineIndex = Math.min(
        Math.floor((position / duration) * positions.length),
        positions.length - 1
      );

      // Scroll only when line changes — no jumpy pixel scroll
      if (lineIndex === lastLineIndexRef.current) return;
      lastLineIndexRef.current = lineIndex;

      const lineY = positions[lineIndex];
      const viewportH = viewportHeightRef.current;
      // Center the current line in the viewport
      const y = Math.max(0, lineY - viewportH / 3);
      scrollRef.current?.scrollTo({ y, animated: true });
    }, 300);
    return () => clearInterval(interval);
  }, [autoScroll]);

  const startPlay = useCallback((target: typeof activeSong | null | undefined) => {
    if (target) usePlayer.getState().setSong(target);
  }, []);

  const goTo = useCallback((targetId: string) => {
    const target = songs.find(s => s.id === targetId) ?? null;
    startPlay(target);
    setActiveSongId(targetId);
    setAutoStartPlayer(true);
    lineYPositionsRef.current = [];
    lastLineIndexRef.current = -1;
  }, [startPlay]);

  const handleEnded = useCallback(() => {
    if (autoPlay && nextSong) goTo(nextSong.id);
  }, [autoPlay, nextSong, goTo]);

  const styles = useMemo(() => makeStyles(c), [c]);

  if (!song) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <StatusBar barStyle={c.statusBar} translucent backgroundColor="transparent" />
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={c.text} />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Ionicons name="musical-notes-outline" size={56} color={c.textMuted} />
          <Text style={styles.notFoundText}>Tsy hita ny hira</Text>
        </View>
      </SafeAreaView>
    );
  }

  const liked = isFavorite(activeSong!.id);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={c.statusBar} backgroundColor={c.bg} />
      <Screen>
        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={c.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>{activeSong!.title}</Text>
          <TouchableOpacity
            onPress={() => toggle(activeSong!.id)}
            style={[styles.iconBtn, liked && styles.iconBtnLiked]}
            activeOpacity={0.7}
          >
            <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? c.accent : c.textSub} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowShare(true)}
            style={styles.iconBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={20} color={c.textSub} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowPlaylist(true)}
            style={styles.iconBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark-outline" size={20} color={c.textSub} />
          </TouchableOpacity>
          {song!.type === "playback" && (
            <TouchableOpacity
              onPress={() => setAutoScroll(v => !v)}
              style={[styles.iconBtn, autoScroll && styles.iconBtnActive]}
              activeOpacity={0.7}
            >
              <Ionicons name="swap-vertical-outline" size={20} color={autoScroll ? c.accentText : c.textSub} />
            </TouchableOpacity>
          )}
          {song!.type === "playback" && song!.audio && (
            <TouchableOpacity
              onPress={() => {
                if (!showPlayer) startPlay(activeSong);
                setShowPlayer(v => !v);
              }}
              style={[styles.iconBtn, showPlayer && styles.iconBtnActive]}
              activeOpacity={0.7}
            >
              <Ionicons name="headset" size={20} color={showPlayer ? c.accentText : c.textSub} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Art section ── */}
        <View style={styles.artSection}>
          <View style={styles.artCard}>
            <View style={styles.artGlow} />
            <Image source={require("@/assets/images/svm.png")} style={styles.artLogo} resizeMode="contain" />
          </View>
          <Text style={styles.songTitle}>{activeSong!.title}</Text>
          {activeSong!.type && (
            <TouchableOpacity
              disabled={activeSong!.type !== "playback"}
              onPress={() => {
                if (!showPlayer) startPlay(activeSong);
                setShowPlayer(true);
              }}
              activeOpacity={0.75}
              style={[styles.typeBadge, activeSong!.type === "playback" && styles.typeBadgePlayback]}
            >
              <Ionicons
                name={activeSong!.type === "playback" ? "headset" : "book-outline"}
                size={11}
                color={activeSong!.type === "playback" ? c.accentText : c.textSub}
              />
              <Text style={[styles.typeText, activeSong!.type === "playback" && styles.typeTextPlayback]}>
                {activeSong!.type === "playback" ? "Playback" : "Lyrics"}
              </Text>
            </TouchableOpacity>
          )}
        </View>


        {/* ── Lyrics + font pill ── */}
        <View style={{ flex: 1 }}>
          {/* Font size pill — floating right */}
          <View style={styles.fontPillWrap}>
            <TouchableOpacity
              onPress={() => changeFontSize(2)}
              disabled={fontSize >= FONT_MAX}
              style={[styles.fontPillBtn, fontSize >= FONT_MAX && styles.fontPillBtnDim]}
              activeOpacity={0.7}
            >
              <Text style={styles.fontBtnBigA}>A</Text>
            </TouchableOpacity>

            <View style={styles.fontPillDivider} />
            <Text style={styles.fontSizeText}>{fontSize}</Text>
            <View style={styles.fontPillDivider} />

            <TouchableOpacity
              onPress={() => changeFontSize(-2)}
              disabled={fontSize <= FONT_MIN}
              style={[styles.fontPillBtn, fontSize <= FONT_MIN && styles.fontPillBtnDim]}
              activeOpacity={0.7}
            >
              <Text style={styles.fontBtnSmallA}>A</Text>
            </TouchableOpacity>
          </View>

        {/* ── Paroles scrollables ── */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.scroll,
            {
              paddingBottom:
                (song!.type === "playback" && showPlayer ? rs(220) : rs(20))
                + BAR_H + insets.bottom + rs(16),
            },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScrollBeginDrag={() => autoScroll && setAutoScroll(false)}
          onContentSizeChange={(_w, h) => { contentHeightRef.current = h; }}
          onLayout={e => { viewportHeightRef.current = e.nativeEvent.layout.height; }}
        >
          <LyricsDisplay
            lyrics={activeSong!.lyrics}
            fontSize={fontSize}
            onLinesLayout={positions => { lineYPositionsRef.current = positions; }}
          />
        </ScrollView>
        </View>

        {/* ── Player fixe en bas ── */}
        {song!.type === "playback" && song!.audio && playerEverShown.current && (
          <View style={[styles.playerCard, { bottom: BAR_H + insets.bottom + rs(10) }, !showPlayer && { display: "none" }]}>
            {/* Prev / Autoplay / Next */}
            <View style={styles.navRow}>
              <TouchableOpacity
                onPress={() => prevSong && goTo(prevSong.id)}
                disabled={!prevSong}
                style={[styles.navBtn, !prevSong && styles.navBtnDim]}
              >
                <Ionicons name="play-skip-back" size={18} color={prevSong ? c.textSub : c.textMuted} />
                <Text style={[styles.navLbl, !prevSong && { color: c.textMuted }]} numberOfLines={1}>
                  {prevSong ? prevSong.title : "—"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAutoPlay(v => !v)}
                style={[styles.autoBtn, autoPlay && styles.autoBtnOn]}
              >
                <Ionicons name="infinite" size={16} color={autoPlay ? c.accentText : c.textMuted} />
                <Text style={[styles.autoLbl, autoPlay && { color: c.accentText }]}>Auto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => nextSong && goTo(nextSong.id)}
                disabled={!nextSong}
                style={[styles.navBtn, styles.navBtnRight, !nextSong && styles.navBtnDim]}
              >
                <Text style={[styles.navLbl, styles.navLblRight, !nextSong && { color: c.textMuted }]} numberOfLines={1}>
                  {nextSong ? nextSong.title : "—"}
                </Text>
                <Ionicons name="play-skip-forward" size={18} color={nextSong ? c.textSub : c.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.playerDivider} />
            <PlaybackControls
              key={activeSongId}
              audioSource={activeSong!.audio ?? song!.audio}
              songTitle={activeSong!.title}
              onEnded={handleEnded}
              autoStart={autoStartPlayer}
            />
          </View>
        )}
      </Screen>

      <ShareSongModal
        visible={showShare}
        onClose={() => setShowShare(false)}
        title={activeSong!.title}
        lyrics={activeSong!.lyrics}
      />
      <AddToPlaylistModal
        visible={showPlaylist}
        onClose={() => setShowPlaylist(false)}
        songId={activeSong!.id}
        songTitle={activeSong!.title}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },

    topBar: {
      flexDirection: "row", alignItems: "center",
      paddingHorizontal: rs(14), paddingVertical: rs(10),
      gap: rs(10),
    },
    iconBtn: {
      width: rs(38), height: rs(38), borderRadius: rs(19),
      backgroundColor: c.surface,
      borderWidth: 1, borderColor: c.border,
      justifyContent: "center", alignItems: "center",
    },
    iconBtnLiked: {
      backgroundColor: c.accentDim,
      borderColor: c.borderAccent,
    },
    iconBtnActive: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    topBarTitle: {
      flex: 1, textAlign: "center",
      fontSize: rf(15), fontWeight: "700", color: c.text,
    },

    artSection: { alignItems: "center", paddingVertical: rs(12), paddingHorizontal: rs(20), gap: rs(8) },
    artCard: {
      width: rs(80), height: rs(80), borderRadius: rs(22),
      backgroundColor: "#0f056b",
      borderWidth: 1.5, borderColor: "rgba(250,204,21,0.22)",
      justifyContent: "center", alignItems: "center",
      shadowColor: "#facc15",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18, shadowRadius: 12, elevation: 6,
      overflow: "hidden",
    },
    artGlow: {
      position: "absolute", bottom: -rs(12), right: -rs(12),
      width: rs(50), height: rs(50), borderRadius: rs(25),
      backgroundColor: "#facc15", opacity: 0.06,
    },
    artLogo: { width: rs(54), height: rs(54), borderRadius: rs(12) },
    songTitle: {
      fontSize: rf(17), fontWeight: "800", color: c.text,
      textAlign: "center", lineHeight: rf(25), paddingHorizontal: rs(16),
    },
    typeBadge: {
      flexDirection: "row", alignItems: "center", gap: rs(4),
      paddingHorizontal: rs(10), paddingVertical: rs(4), borderRadius: rs(14),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.border,
    },
    typeBadgePlayback: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    typeText: { fontSize: rf(12), color: c.textSub, fontWeight: "700" },
    typeTextPlayback: { color: c.accentText },

    fontPillWrap: {
      position: "absolute",
      right: rs(10),
      bottom: rs(80),
      zIndex: 10,
      backgroundColor: c.accent,
      borderRadius: rs(20),
      flexDirection: "column",
      alignItems: "center",
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 8,
    },
    fontPillBtn: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: rs(10),
      paddingVertical: rs(10),
    },
    fontPillBtnDim: { opacity: 0.3 },
    fontPillDivider: {
      width: rs(18),
      height: 1,
      backgroundColor: "rgba(255,255,255,0.25)",
    },
    fontBtnSmallA: { fontSize: rf(11), fontWeight: "800", color: c.accentText },
    fontBtnBigA:   { fontSize: rf(16), fontWeight: "800", color: c.accentText },
    fontSizeText: {
      fontSize: rf(11),
      fontWeight: "700",
      color: c.accentText,
      paddingVertical: rs(8),
    },

    scroll: { paddingHorizontal: rs(18), paddingTop: rs(4), alignItems: "center" },
    playerCard: {
      position: "absolute",
      left: rs(12),
      right: rs(12),
      backgroundColor: c.surface,
      borderRadius: rs(16), borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: rs(12),
      paddingVertical: rs(10),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 10,
    },

    navRow: {
      flexDirection: "row", alignItems: "center",
      justifyContent: "space-between", marginBottom: rs(8),
    },
    navBtn: {
      flex: 1, flexDirection: "row", alignItems: "center", gap: rs(6),
    },
    navBtnRight: { justifyContent: "flex-end" },
    navBtnDim: { opacity: 0.35 },
    navLbl: { fontSize: rf(10), color: c.textSub, fontWeight: "600", flex: 1 },
    navLblRight: { textAlign: "right" },
    autoBtn: {
      flexDirection: "row", alignItems: "center", gap: rs(4),
      paddingHorizontal: rs(10), paddingVertical: rs(5),
      borderRadius: rs(20),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.border,
    },
    autoBtnOn: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    autoLbl: { fontSize: rf(10), color: c.textMuted, fontWeight: "700" },
    playerDivider: {
      height: 1, backgroundColor: c.border, marginBottom: rs(8),
    },

    backBtn: {
      margin: rs(14), width: rs(40), height: rs(40), borderRadius: rs(20),
      backgroundColor: c.surface, justifyContent: "center", alignItems: "center",
    },
    notFound: { flex: 1, justifyContent: "center", alignItems: "center", gap: rs(14) },
    notFoundText: { fontSize: rf(15), color: c.textMuted },
  });
}
