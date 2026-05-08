import { songs } from "@/assets/data/songs";
import LyricsDisplay from "@/components/player/LyricsDisplay";
import PlaybackControls from "@/components/player/PlaybackControls";
import Screen from "@/components/Screen";
import TabBar, { BAR_H } from "@/components/TabBar";
import { useFavorites } from "@/stores/useFavorites";
import { usePlayer } from "@/stores/usePlayer";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image, ScrollView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const playbackSongs = songs.filter(s => s.type === "playback" && s.audio);

export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, toggle } = useFavorites();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showPlayer, setShowPlayer] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
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
    return () => usePlayer.getState().setCurrentPageId(null);
  }, [id]);

  const startPlay = useCallback((target: typeof activeSong | null | undefined) => {
    if (target) usePlayer.getState().setSong(target);
  }, []);

  const goTo = useCallback((targetId: string) => {
    const target = songs.find(s => s.id === targetId) ?? null;
    startPlay(target);
    setActiveSongId(targetId);
    setAutoStartPlayer(true);
  }, [startPlay]);

  const handleEnded = useCallback(() => {
    if (autoPlay && nextSong) goTo(nextSong.id);
  }, [autoPlay, nextSong, goTo]);

  if (!song) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor="#020118" />
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Ionicons name="musical-notes-outline" size={56} color="#1a0d80" />
          <Text style={styles.notFoundText}>Tsy hita ny hira</Text>
        </View>
      </SafeAreaView>
    );
  }

  const liked = isFavorite(activeSong!.id);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#020118" />
      <Screen>
        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>{activeSong!.title}</Text>
          <TouchableOpacity
            onPress={() => toggle(activeSong!.id)}
            style={[styles.iconBtn, liked && styles.iconBtnLiked]}
            activeOpacity={0.7}
          >
            <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? "#facc15" : "#b5c6d6"} />
          </TouchableOpacity>
          {song!.type === "playback" && song!.audio && (
            <TouchableOpacity
              onPress={() => {
                if (!showPlayer) startPlay(activeSong);
                setShowPlayer(v => !v);
              }}
              style={[styles.iconBtn, showPlayer && styles.iconBtnActive]}
              activeOpacity={0.7}
            >
              <Ionicons name="headset" size={20} color={showPlayer ? "#020118" : "#b5c6d6"} />
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
                color={activeSong!.type === "playback" ? "#020118" : "#b5c6d6"}
              />
              <Text style={[styles.typeText, activeSong!.type === "playback" && styles.typeTextPlayback]}>
                {activeSong!.type === "playback" ? "Playback" : "Lyrics"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Paroles scrollables ── */}
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingBottom:
                (song!.type === "playback" && showPlayer ? rs(220) : rs(20))
                + BAR_H + insets.bottom + rs(16),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <LyricsDisplay lyrics={activeSong!.lyrics} />
        </ScrollView>

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
                <Ionicons name="play-skip-back" size={18} color={prevSong ? "#b5c6d6" : "#2a3a5a"} />
                <Text style={[styles.navLbl, !prevSong && { color: "#2a3a5a" }]} numberOfLines={1}>
                  {prevSong ? prevSong.title : "—"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAutoPlay(v => !v)}
                style={[styles.autoBtn, autoPlay && styles.autoBtnOn]}
              >
                <Ionicons name="infinite" size={16} color={autoPlay ? "#020118" : "#5a6e90"} />
                <Text style={[styles.autoLbl, autoPlay && { color: "#020118" }]}>Auto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => nextSong && goTo(nextSong.id)}
                disabled={!nextSong}
                style={[styles.navBtn, styles.navBtnRight, !nextSong && styles.navBtnDim]}
              >
                <Text style={[styles.navLbl, styles.navLblRight, !nextSong && { color: "#2a3a5a" }]} numberOfLines={1}>
                  {nextSong ? nextSong.title : "—"}
                </Text>
                <Ionicons name="play-skip-forward" size={18} color={nextSong ? "#b5c6d6" : "#2a3a5a"} />
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

      {/* ── Tab bar ── */}
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020118" },

  topBar: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: rs(14), paddingVertical: rs(10),
    gap: rs(10),
  },
  iconBtn: {
    width: rs(38), height: rs(38), borderRadius: rs(19),
    backgroundColor: "#06033a",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center", alignItems: "center",
  },
  iconBtnLiked: {
    backgroundColor: "rgba(250,204,21,0.1)",
    borderColor: "rgba(250,204,21,0.3)",
  },
  iconBtnActive: {
    backgroundColor: "#facc15",
    borderColor: "#facc15",
  },
  topBarTitle: {
    flex: 1, textAlign: "center",
    fontSize: rf(15), fontWeight: "700", color: "#fff",
  },

  artSection: { alignItems: "center", paddingVertical: rs(12), paddingHorizontal: rs(20), gap: rs(8) },
  artCard: {
    width: rs(80), height: rs(80), borderRadius: rs(22),
    backgroundColor: "#0f056b",
    borderWidth: 1.5, borderColor: "rgba(250,204,21,0.2)",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#facc15",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
    overflow: "hidden",
  },
  artGlow: {
    position: "absolute", bottom: -rs(12), right: -rs(12),
    width: rs(50), height: rs(50), borderRadius: rs(25),
    backgroundColor: "#facc15", opacity: 0.06,
  },
  artLogo: { width: rs(54), height: rs(54), borderRadius: rs(12) },
  songTitle: {
    fontSize: rf(17), fontWeight: "800", color: "#fff",
    textAlign: "center", lineHeight: rf(25), paddingHorizontal: rs(16),
  },
  typeBadge: {
    flexDirection: "row", alignItems: "center", gap: rs(4),
    paddingHorizontal: rs(10), paddingVertical: rs(4), borderRadius: rs(14),
    backgroundColor: "rgba(181,198,214,0.1)",
    borderWidth: 1, borderColor: "rgba(181,198,214,0.18)",
  },
  typeBadgePlayback: {
    backgroundColor: "#facc15",
    borderColor: "#facc15",
  },
  typeText: { fontSize: rf(12), color: "#b5c6d6", fontWeight: "700" },
  typeTextPlayback: { color: "#020118" },

  scroll: { paddingHorizontal: rs(18), paddingTop: rs(4), alignItems: "center" },
  playerCard: {
    position: "absolute",
    left: rs(12),
    right: rs(12),
    backgroundColor: "#06033a",
    borderRadius: rs(16), borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
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
  navLbl: { fontSize: rf(10), color: "#b5c6d6", fontWeight: "600", flex: 1 },
  navLblRight: { textAlign: "right" },
  autoBtn: {
    flexDirection: "row", alignItems: "center", gap: rs(4),
    paddingHorizontal: rs(10), paddingVertical: rs(5),
    borderRadius: rs(20),
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  autoBtnOn: {
    backgroundColor: "#facc15",
    borderColor: "#facc15",
  },
  autoLbl: { fontSize: rf(10), color: "#5a6e90", fontWeight: "700" },
  playerDivider: {
    height: 1, backgroundColor: "rgba(255,255,255,0.06)", marginBottom: rs(8),
  },

  backBtn: {
    margin: rs(14), width: rs(40), height: rs(40), borderRadius: rs(20),
    backgroundColor: "#06033a", justifyContent: "center", alignItems: "center",
  },
  notFound: { flex: 1, justifyContent: "center", alignItems: "center", gap: rs(14) },
  notFoundText: { fontSize: rf(15), color: "#5a6e90" },
});
