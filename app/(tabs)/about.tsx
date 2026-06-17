import { songs } from "@/assets/data/songs";
import FilterType from "@/components/FilterType";
import Screen from "@/components/Screen";
import SearchInput from "@/components/SearchInput";
import SongList from "@/components/SongList";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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

export default function HomeTab() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

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

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
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
            <Text style={styles.appDesc} numberOfLines={1}>
              Rantsana FANANTENANA
            </Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.statBadge} allowFontScaling={false}>
              {counts.all} hira
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/info")}
            style={styles.infoBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="information-circle-outline" size={rs(22)} color="#b5c6d6" />
          </TouchableOpacity>
        </View>

        {/* ── Stats chips ── */}
        <View style={styles.chips}>
          <View style={styles.chip}>
            <View style={[styles.chipDot, { backgroundColor: "#facc15" }]} />
            <Text style={styles.chipText}>{counts.playback} Playback</Text>
          </View>
          <View style={styles.chipDivider} />
          <View style={styles.chip}>
            <View style={[styles.chipDot, { backgroundColor: "#b5c6d6" }]} />
            <Text style={styles.chipText}>{counts.lyrics} Lyrics</Text>
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── Search + Filter + List ── */}
        {/* iOS: KeyboardAvoidingView pushes content. Android: plain View (Android handles keyboard natively) */}
        {Platform.OS === "ios" ? (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <View style={styles.controls}>
              <SearchInput value={searchText} onChangeText={setSearchText} />
              <FilterType
                selected={selectedType}
                onSelect={setSelectedType}
                counts={counts}
              />
            </View>
            {filteredSongs.length > 0 ? (
              <SongList data={filteredSongs} />
            ) : (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Text style={{ fontSize: rf(36) }}>🎵</Text>
                </View>
                <Text style={styles.emptyTitle}>Tsy hita</Text>
                <Text style={styles.emptySub}>
                  Tsy misy hira mifanaraka amin'ny fikarohana
                </Text>
              </View>
            )}
          </KeyboardAvoidingView>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={styles.controls}>
              <SearchInput value={searchText} onChangeText={setSearchText} />
              <FilterType
                selected={selectedType}
                onSelect={setSelectedType}
                counts={counts}
              />
            </View>
            {filteredSongs.length > 0 ? (
              <SongList data={filteredSongs} />
            ) : (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Text style={{ fontSize: rf(36) }}>🎵</Text>
                </View>
                <Text style={styles.emptyTitle}>Tsy hita</Text>
                <Text style={styles.emptySub}>
                  Tsy misy hira mifanaraka amin'ny fikarohana
                </Text>
              </View>
            )}
          </View>
        )}
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020118" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(18),
    paddingTop: rs(10),
    paddingBottom: rs(14),
    gap: rs(12),
  },
  logoWrap: {
    width: rs(56),
    height: rs(56),
    borderRadius: rs(18),
    backgroundColor: "#0f056b",
    borderWidth: 1.5,
    borderColor: "rgba(250,204,21,0.2)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#facc15",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  logoGlow: {
    position: "absolute",
    bottom: -rs(10),
    right: -rs(10),
    width: rs(36),
    height: rs(36),
    borderRadius: rs(18),
    backgroundColor: "#facc15",
    opacity: 0.06,
  },
  logo: { width: rs(38), height: rs(38), borderRadius: rs(10) },
  headerMid: { flex: 1 },
  appName: {
    fontSize: rf(19),
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1.5,
  },
  appDesc: {
    fontSize: rf(11),
    color: "#b5c6d6",
    marginTop: rs(2),
    fontWeight: "500",
  },
  headerStats: {
    backgroundColor: "rgba(250,204,21,0.12)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.25)",
    borderRadius: rs(12),
    paddingHorizontal: rs(10),
    paddingVertical: rs(5),
  },
  infoBtn: {
    width: rs(34), height: rs(34), borderRadius: rs(17),
    justifyContent: "center", alignItems: "center",
  },
  statBadge: {
    fontSize: rf(12),
    fontWeight: "700",
    color: "#facc15",
    letterSpacing: 0.4,
  },

  chips: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: rs(18),
    paddingBottom: rs(10),
  },
  chip: { flexDirection: "row", alignItems: "center", gap: rs(5) },
  chipDot: { width: rs(5), height: rs(5), borderRadius: rs(3) },
  chipText: {
    fontSize: rf(11),
    color: "#b5c6d6",
    fontWeight: "500",
  },
  chipDivider: {
    width: 1,
    height: rs(10),
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: rs(10),
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
  },

  controls: { paddingHorizontal: rs(18), paddingTop: rs(14) },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: rs(12),
    paddingHorizontal: rs(40),
  },
  emptyIcon: {
    width: rs(72),
    height: rs(72),
    borderRadius: rs(36),
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: rs(4),
  },
  emptyTitle: { fontSize: rf(18), fontWeight: "700", color: "#fff" },
  emptySub: {
    fontSize: rf(13),
    color: "#5a6e90",
    textAlign: "center",
    lineHeight: rf(20),
  },
});
