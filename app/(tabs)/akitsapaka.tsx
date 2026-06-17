import { songs } from "@/assets/data/songs";
import DropdownPicker from "@/components/akitsapaka/DropdownPicker";
import ShuffleButton from "@/components/akitsapaka/ShuffleButton";
import SongCard from "@/components/akitsapaka/SongCard";
import Screen from "@/components/Screen";
import { isTablet, rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BAR_H } from "@/components/TabBar";

export default function AkitsapakaScreen() {
  const insets = useSafeAreaInsets();
  const { count } = useLocalSearchParams();
  const initCount = count ? Math.max(1, Math.min(10, Number(count))) : 1;
  const [countNumber, setCountNumber] = useState(initCount);
  const [randomSongs, setRandomSongs] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showResults = (picked: { id: string; title: string }[]) => {
    setRandomSongs(picked);
    setLoading(false);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const pickRandom = useCallback(() => {
    if (!songs.length) return;
    setLoading(true);
    setTimeout(() => {
      const picked = [...songs]
        .sort(() => Math.random() - 0.5)
        .slice(0, countNumber)
        .map((s, i) => typeof s === "object" && s.title
          ? { id: s.id || String(i), title: s.title }
          : { id: String(i), title: String(s) }
        );
      showResults(picked);
    }, 350);
  }, [countNumber]);

  useEffect(() => { pickRandom(); }, [pickRandom]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Screen>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Akitsapaka</Text>
          <Text style={styles.sub}>Hira voafantina kisendrasendra</Text>
        </View>
        <View style={styles.diceBadge}>
          <Ionicons name="dice" size={rs(22)} color="#facc15" />
        </View>
      </View>

      {/* ── Controls card ── */}
      <View style={styles.controlCard}>
        <Text style={styles.controlLabel}>Isan'ny hira hovidina</Text>
        <View style={styles.controlRow}>
          <DropdownPicker value={countNumber} onChange={setCountNumber} max={10} />
          <ShuffleButton onPress={pickRandom} />
        </View>
      </View>

      {/* ── Results header ── */}
      <View style={styles.resHeader}>
        <View style={styles.resLine} />
        <Text style={styles.resLabel}>
          {countNumber === 1 ? "1 hira voafantina" : `${countNumber} hira voafantina`}
        </Text>
        <View style={styles.resLine} />
      </View>

      {/* ── Results ── */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#facc15" />
          <Text style={styles.loadingText}>Mifantina...</Text>
        </View>
      ) : (
        <Animated.ScrollView
          style={{ flex: 1, opacity: fadeAnim }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={isTablet ? styles.gridTablet : undefined}>
            {randomSongs.map((s, i) => (
              <View key={s.id} style={isTablet ? styles.gridItem : undefined}>
                <SongCard id={s.id} title={s.title} index={i + 1} />
              </View>
            ))}
          </View>
          <View style={{ height: BAR_H + Math.min(insets.bottom, rs(48)) + rs(10) }} />
        </Animated.ScrollView>
      )}
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020118" },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: rs(20), paddingVertical: rs(16),
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)",
  },
  title: { fontSize: rf(26), fontWeight: "800", color: "#fff" },
  sub: { fontSize: rf(12), color: "#b5c6d6", marginTop: rs(3) },
  diceBadge: {
    width: rs(44), height: rs(44), borderRadius: rs(22),
    backgroundColor: "rgba(250,204,21,0.08)",
    borderWidth: 1, borderColor: "rgba(250,204,21,0.2)",
    justifyContent: "center", alignItems: "center",
  },

  controlCard: {
    marginHorizontal: rs(16), marginTop: rs(16),
    backgroundColor: "#06033a",
    borderRadius: rs(18),
    padding: rs(16),
    borderWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    gap: rs(12),
  },
  controlLabel: { fontSize: rf(11), color: "#b5c6d6", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },
  controlRow: { flexDirection: "row", alignItems: "center", gap: rs(12) },

  resHeader: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: rs(16), marginTop: rs(20), marginBottom: rs(12), gap: rs(10),
  },
  resLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.07)" },
  resLabel: { fontSize: rf(10), color: "#5a6e90", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },

  scroll: { paddingHorizontal: rs(16), gap: rs(10) },

  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: rs(14),
  },
  loadingText: {
    fontSize: rf(13),
    color: "#5a6e90",
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  gridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: rs(10),
  },
  gridItem: { width: "48.5%" },
});
