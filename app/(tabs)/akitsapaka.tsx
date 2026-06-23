import { songs } from "@/assets/data/songs";
import DropdownPicker from "@/components/akitsapaka/DropdownPicker";
import ShuffleButton from "@/components/akitsapaka/ShuffleButton";
import SongCard from "@/components/akitsapaka/SongCard";
import Screen from "@/components/Screen";
import { BAR_H } from "@/components/TabBar";
import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { isTablet, rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      paddingHorizontal: rs(20), paddingVertical: rs(16),
      borderBottomWidth: 1, borderBottomColor: c.border,
    },
    title: { fontSize: rf(26), fontWeight: "800", color: c.text },
    sub: { fontSize: rf(12), color: c.textSub, marginTop: rs(3) },
    diceBadge: {
      width: rs(44), height: rs(44), borderRadius: rs(22),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center",
    },
    controlCard: {
      marginHorizontal: rs(16), marginTop: rs(16),
      backgroundColor: c.surface,
      borderRadius: rs(18),
      padding: rs(16),
      borderWidth: 1, borderColor: c.border,
      gap: rs(12),
    },
    controlLabel: { fontSize: rf(11), color: c.textSub, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },
    controlRow: { flexDirection: "row", alignItems: "center", gap: rs(12) },
    resHeader: {
      flexDirection: "row", alignItems: "center",
      paddingHorizontal: rs(16), marginTop: rs(20), marginBottom: rs(12), gap: rs(10),
    },
    resLine: { flex: 1, height: 1, backgroundColor: c.border },
    resLabel: { fontSize: rf(10), color: c.textMuted, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },
    scroll: { paddingHorizontal: rs(16), gap: rs(10) },
    loadingBox: { flex: 1, justifyContent: "center", alignItems: "center", gap: rs(14) },
    loadingText: { fontSize: rf(13), color: c.textMuted, fontWeight: "600", letterSpacing: 0.4 },
    gridTablet: { flexDirection: "row", flexWrap: "wrap", gap: rs(10) },
    gridItem: { width: "48.5%" },
  });
}

export default function AkitsapakaScreen() {
  const insets = useSafeAreaInsets();
  const { count } = useLocalSearchParams();
  const initCount = count ? Math.max(1, Math.min(10, Number(count))) : 1;
  const [countNumber, setCountNumber] = useState(initCount);
  const [randomSongs, setRandomSongs] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  const showResults = (picked: { id: string; title: string }[]) => {
    setRandomSongs(picked);
    setLoading(false);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }).start();
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
      <StatusBar barStyle={c.statusBar} translucent backgroundColor="transparent" />
      <Screen>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Akitsapaka</Text>
            <Text style={styles.sub}>Hira voafantina kisendrasendra</Text>
          </View>
          <View style={styles.diceBadge}>
            <Ionicons name="dice" size={rs(22)} color={c.accent} />
          </View>
        </View>

        <View style={styles.controlCard}>
          <Text style={styles.controlLabel}>Isan'ny hira hovidina</Text>
          <View style={styles.controlRow}>
            <DropdownPicker value={countNumber} onChange={setCountNumber} max={10} />
            <ShuffleButton onPress={pickRandom} />
          </View>
        </View>

        <View style={styles.resHeader}>
          <View style={styles.resLine} />
          <Text style={styles.resLabel}>
            {countNumber === 1 ? "1 hira voafantina" : `${countNumber} hira voafantina`}
          </Text>
          <View style={styles.resLine} />
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={c.accent} />
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
