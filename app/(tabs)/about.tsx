import { songs } from "@/assets/data/songs";
import FilterType from "@/components/FilterType";
import Screen from "@/components/Screen";
import SearchInput from "@/components/SearchInput";
import SongList from "@/components/SongList";
import { useHistory } from "@/stores/useHistory";
import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    recentSection: { paddingTop: rs(10) },
    recentHeader: {
      flexDirection: "row", alignItems: "center", gap: rs(5),
      paddingHorizontal: rs(18), marginBottom: rs(10),
    },
    recentTitle: {
      fontSize: rf(11), fontWeight: "700", color: c.textMuted,
      textTransform: "uppercase", letterSpacing: 0.8,
    },
    recentList: { paddingHorizontal: rs(18), gap: rs(10), paddingBottom: rs(12) },
    recentCard: {
      width: rs(90),
      backgroundColor: c.surface,
      borderRadius: rs(14),
      borderWidth: 1, borderColor: c.border,
      padding: rs(10),
      alignItems: "center",
      gap: rs(6),
    },
    recentIcon: {
      width: rs(38), height: rs(38), borderRadius: rs(11),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.border,
      justifyContent: "center", alignItems: "center",
    },
    recentIconPlayback: {
      backgroundColor: c.accentDim,
      borderColor: c.borderAccent,
    },
    recentName: {
      fontSize: rf(11), fontWeight: "600", color: c.text,
      textAlign: "center", lineHeight: rf(15),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: rs(18),
      paddingTop: rs(10),
      paddingBottom: rs(14),
      gap: rs(12),
    },
    logoWrap: {
      width: rs(56), height: rs(56), borderRadius: rs(18),
      backgroundColor: "#0f056b",
      borderWidth: 1.5, borderColor: "rgba(250,204,21,0.22)",
      justifyContent: "center", alignItems: "center",
      shadowColor: "#facc15",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18, shadowRadius: 12, elevation: 6,
      overflow: "hidden",
    },
    logoGlow: {
      position: "absolute", bottom: -rs(10), right: -rs(10),
      width: rs(36), height: rs(36), borderRadius: rs(18),
      backgroundColor: "#facc15", opacity: 0.06,
    },
    logo: { width: rs(38), height: rs(38), borderRadius: rs(10) },
    headerMid: { flex: 1 },
    appName: { fontSize: rf(19), fontWeight: "800", color: c.text, letterSpacing: 1.5 },
    appDesc: { fontSize: rf(11), color: c.textSub, marginTop: rs(2), fontWeight: "500" },
    headerStats: {
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.borderAccent,
      borderRadius: rs(12),
      paddingHorizontal: rs(10), paddingVertical: rs(5),
    },
    statBadge: { fontSize: rf(12), fontWeight: "700", color: c.accent, letterSpacing: 0.4 },
    chips: {
      flexDirection: "row", alignItems: "center",
      paddingHorizontal: rs(18), paddingBottom: rs(10),
    },
    chip: { flexDirection: "row", alignItems: "center", gap: rs(5) },
    chipDot: { width: rs(5), height: rs(5), borderRadius: rs(3) },
    chipText: { fontSize: rf(11), color: c.textSub, fontWeight: "500" },
    chipDivider: {
      width: 1, height: rs(10),
      backgroundColor: c.border,
      marginHorizontal: rs(10),
    },
    divider: { height: 1, backgroundColor: c.border },
    controls: { paddingHorizontal: rs(18), paddingTop: rs(14) },
    empty: {
      flex: 1, alignItems: "center", justifyContent: "center",
      gap: rs(12), paddingHorizontal: rs(40),
    },
    emptyIcon: {
      width: rs(72), height: rs(72), borderRadius: rs(36),
      backgroundColor: c.accentDim,
      justifyContent: "center", alignItems: "center", marginBottom: rs(4),
    },
    emptyTitle: { fontSize: rf(18), fontWeight: "700", color: c.text },
    emptySub: { fontSize: rf(13), color: c.textMuted, textAlign: "center", lineHeight: rf(20) },
  });
}

export default function HomeTab() {
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { list: historyIds } = useHistory();
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);
  const router = useRouter();

  const recentSongs = useMemo(() =>
    historyIds.map(id => songs.find(s => s.id === id)).filter(Boolean) as typeof songs,
    [historyIds]
  );

  const counts = useMemo(
    () => ({
      all: songs.length,
      playback: songs.filter((s) => s.type === "playback").length,
      lyrics: songs.filter((s) => s.type === "lyrics").length,
    }),
    [],
  );

  const filteredSongs = useMemo(() => {
    if (!searchText.trim() && selectedType === null) return songs;
    const q = searchText.trim().toLowerCase();
    return songs.filter((s) => {
      const matchType = selectedType === null || s.type === selectedType;
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        (s.lyrics?.toLowerCase().includes(q) ?? false);
      return matchType && matchSearch;
    });
  }, [searchText, selectedType]);

  const EmptyState = (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Text style={{ fontSize: rf(36) }}>🎵</Text>
      </View>
      <Text style={styles.emptyTitle}>Tsy hita</Text>
      <Text style={styles.emptySub}>Tsy misy hira mifanaraka amin'ny fikarohana</Text>
    </View>
  );

  const Controls = (
    <View style={styles.controls}>
      <SearchInput value={searchText} onChangeText={setSearchText} />
      <FilterType selected={selectedType} onSelect={setSelectedType} counts={counts} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle={c.statusBar} translucent backgroundColor="transparent" />
      <Screen>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <View style={styles.logoGlow} />
            <Image
              source={require("@/assets/images/svm.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerMid}>
            <Text style={styles.appName}>SVM</Text>
            <Text style={styles.appDesc} numberOfLines={1}>Rantsana FANANTENANA</Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.statBadge} allowFontScaling={false}>{counts.all} hira</Text>
          </View>
        </View>

        {/* ── Stats chips ── */}
        <View style={styles.chips}>
          <View style={styles.chip}>
            <View style={[styles.chipDot, { backgroundColor: c.accent }]} />
            <Text style={styles.chipText}>{counts.playback} Playback</Text>
          </View>
          <View style={styles.chipDivider} />
          <View style={styles.chip}>
            <View style={[styles.chipDot, { backgroundColor: c.textSub }]} />
            <Text style={styles.chipText}>{counts.lyrics} Lyrics</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Farany nozahaina ── */}
        {recentSongs.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Ionicons name="time-outline" size={rs(13)} color={c.textMuted} />
              <Text style={styles.recentTitle}>Farany nozahaina</Text>
            </View>
            <FlatList
              data={recentSongs}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recentCard}
                  activeOpacity={0.75}
                  onPress={() => router.push(`/song/${item.id}`)}
                >
                  <View style={[styles.recentIcon, item.type === "playback" && styles.recentIconPlayback]}>
                    <Ionicons
                      name={item.type === "playback" ? "headset" : "musical-note"}
                      size={rs(16)}
                      color={item.type === "playback" ? c.accent : c.textSub}
                    />
                  </View>
                  <Text style={styles.recentName} numberOfLines={2}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.divider} />
          </View>
        )}

        {/* ── Search + Filter + List ── */}
        {Platform.OS === "ios" ? (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            {Controls}
            {filteredSongs.length > 0 ? <SongList data={filteredSongs} /> : EmptyState}
          </KeyboardAvoidingView>
        ) : (
          <View style={{ flex: 1 }}>
            {Controls}
            {filteredSongs.length > 0 ? <SongList data={filteredSongs} /> : EmptyState}
          </View>
        )}
      </Screen>
    </SafeAreaView>
  );
}
