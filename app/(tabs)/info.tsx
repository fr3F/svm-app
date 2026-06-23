import { BAR_H } from "@/components/TabBar";
import { useTheme } from "@/stores/useTheme";
import { Theme, ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const FAQ = [
  {
    q: "Ahoana ny fomba fitadiavana hira?",
    a: "Ampiasao ny karôha eo amin'ny pejy «Mitady» — soraty ny anaran'ny hira na ny teny ao anatin'ny hira, dia haseho avy hatrany ny valiny.",
  },
  {
    q: "Inona ny atao hoe Playback?",
    a: "Ny hira manana marika «Playback» dia manana feo azo atao play. Tsindrio ny carte de la hira, avy eo tsindrio ny bouton 🎧 mba hampiasa ny player.",
  },
  {
    q: "Ahoana ny fomba fanampiana hira amin'ny Tiako?",
    a: "Tsindrio ny icon cœur (♡) eo amin'ny an-kavanana ny hira rehetra mba hanampy azy amin'ny lisitra «Tiako». Tsindrio indray ny cœur feno mba hamafa.",
  },
  {
    q: "Inona ny Akitsapaka?",
    a: "Mifantina kisendrasendra ny hira amin'ny alalan'ny pejy «Akitsapaka». Safidio ny isan'ny hira tiako, avy eo tsindrio ny bouton Shuffle.",
  },
  {
    q: "Ahoana ny fomba fampiasana ny player?",
    a: "Eo amin'ny pejy hira (Playback), tsindrio 🎧 mba hampiakatra ny player. Azafady mety amin'ny pitch, hafainganam-peo ary reverb araka ny faniriako.",
  },
  {
    q: "Azoko atao ve ny maneno hira amin'ny background?",
    a: "Eny! Ny player dia miasa amin'ny background — mety hiasa na dia voakatona aza ny apk, na any amin'ny notification bar.",
  },
];

const TIMING = { duration: 280, easing: Easing.inOut(Easing.quad) };

const THEME_OPTIONS: { key: Theme; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "claire", label: "Claire",  icon: "sunny-outline" },
  { key: "sombre", label: "Sombre",  icon: "moon-outline" },
  { key: "nuit",   label: "Nuit",    icon: "cloudy-night-outline" },
];

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
    infoBadge: {
      width: rs(44), height: rs(44), borderRadius: rs(22),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center",
    },
    scroll: { paddingHorizontal: rs(18), paddingTop: rs(14), gap: rs(14) },

    // Theme picker
    themeCard: {
      backgroundColor: c.surface,
      borderRadius: rs(18),
      borderWidth: 1, borderColor: c.border,
      padding: rs(16), gap: rs(12),
    },
    themeCardLabel: {
      fontSize: rf(11), color: c.textMuted, fontWeight: "700",
      textTransform: "uppercase", letterSpacing: 0.8,
    },
    themeRow: { flexDirection: "row", gap: rs(10) },
    themePill: {
      flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
      gap: rs(6), paddingVertical: rs(10), borderRadius: rs(14),
      borderWidth: 1, borderColor: c.border,
      backgroundColor: c.bg,
    },
    themePillActive: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    themePillText: { fontSize: rf(12), fontWeight: "700", color: c.textMuted },
    themePillTextActive: { color: c.accentText },

    devCard: {
      backgroundColor: c.surface,
      borderRadius: rs(16),
      borderWidth: 1, borderColor: c.border,
      padding: rs(16), gap: rs(10),
    },
    devLeft: { flexDirection: "row", alignItems: "center", gap: rs(14) },
    devIcon: {
      width: rs(44), height: rs(44), borderRadius: rs(14),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center", flexShrink: 0,
    },
    devLabel: { fontSize: rf(11), color: c.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 },
    devName: { fontSize: rf(15), fontWeight: "800", color: c.text, marginTop: rs(1) },
    devPseudo: { fontSize: rf(12), color: c.accent, fontWeight: "600", marginTop: rs(1) },
    siteBtn: {
      flexDirection: "row", alignItems: "center", gap: rs(5),
      alignSelf: "flex-end",
      backgroundColor: c.accent,
      paddingHorizontal: rs(12), paddingVertical: rs(6),
      borderRadius: rs(16),
    },
    siteBtnText: { fontSize: rf(11), fontWeight: "700", color: c.accentText },

    writerCard: {
      backgroundColor: c.surface,
      borderRadius: rs(16),
      borderWidth: 1, borderColor: c.border,
      padding: rs(16),
    },
    writerLeft: { flexDirection: "row", alignItems: "center", gap: rs(14) },
    writerIcon: {
      width: rs(44), height: rs(44), borderRadius: rs(14),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center",
    },
    writerLabel: { fontSize: rf(11), color: c.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 },
    writerName: { fontSize: rf(16), fontWeight: "800", color: c.text, marginTop: rs(2) },

    founderCard: {
      backgroundColor: c.surface,
      borderRadius: rs(24),
      borderWidth: 1.5, borderColor: c.borderAccent,
      alignItems: "center",
      paddingVertical: rs(36), paddingHorizontal: rs(20),
      gap: rs(6),
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12, shadowRadius: 20, elevation: 10,
    },
    founderIconRing: {
      width: rs(100), height: rs(100), borderRadius: rs(50),
      borderWidth: 1.5, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center", marginBottom: rs(8),
    },
    founderIconInner: {
      width: rs(78), height: rs(78), borderRadius: rs(39),
      backgroundColor: c.accentDim,
      justifyContent: "center", alignItems: "center",
    },
    founderLabel: { fontSize: rf(11), color: c.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 },
    founderName: { fontSize: rf(26), fontWeight: "800", color: c.text, letterSpacing: 0.4 },
    founderSub: { fontSize: rf(13), color: c.accent, fontWeight: "600", marginTop: rs(2) },

    sampanaCard: {
      backgroundColor: c.surface,
      borderRadius: rs(16),
      borderWidth: 1, borderColor: c.borderAccent,
      padding: rs(16), gap: rs(6),
    },
    sampanaTop: { flexDirection: "row", alignItems: "center", gap: rs(8) },
    sampanaChurch: { fontSize: rf(11), color: c.accent, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },
    sampanaName: { fontSize: rf(18), fontWeight: "800", color: c.text, letterSpacing: 0.3 },
    sampanaYears: { fontSize: rf(13), color: c.textSub, fontWeight: "600" },
    sampanaDivider: { height: 1, backgroundColor: c.border, marginVertical: rs(4) },
    sampanaVerse: { fontSize: rf(13), color: c.textSub, fontStyle: "italic", lineHeight: rf(20) },
    sampanaRef: { fontSize: rf(11), color: c.textMuted, fontWeight: "600", alignSelf: "flex-end" },
    sampanaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    sampanaLabel: { fontSize: rf(11), color: c.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
    sampanaValue: { fontSize: rf(13), color: c.text, fontWeight: "700" },

    sectionHeader: { flexDirection: "row", alignItems: "center", gap: rs(10), marginTop: rs(6) },
    sectionLine: { flex: 1, height: 1, backgroundColor: c.border },
    sectionTitle: { fontSize: rf(11), color: c.textMuted, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },

    faqItem: {
      backgroundColor: c.surface,
      borderRadius: rs(16),
      borderWidth: 1, borderColor: c.border,
      paddingHorizontal: rs(16), paddingVertical: rs(14),
      gap: rs(10),
    },
    faqQ: { flexDirection: "row", alignItems: "center", gap: rs(10) },
    faqNum: {
      width: rs(22), height: rs(22), borderRadius: rs(11),
      backgroundColor: c.accent,
      justifyContent: "center", alignItems: "center", flexShrink: 0,
    },
    faqNumText: { fontSize: rf(10), fontWeight: "800", color: c.accentText },
    faqQText: { flex: 1, fontSize: rf(13), fontWeight: "700", color: c.text, lineHeight: rf(20) },
    faqA: { fontSize: rf(12), color: c.textSub, lineHeight: rf(20), paddingLeft: rs(32) },
  });
}

function FaqItem({ item, index, c, styles }: {
  item: { q: string; a: string };
  index: number;
  c: ThemeColors;
  styles: ReturnType<typeof makeStyles>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const progress = useSharedValue(0);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    progress.value = withTiming(next ? 1 : 0, TIMING);
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }],
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(progress.value, [0, 1], [0, 300]),
    opacity: interpolate(progress.value, [0, 0.4, 1], [0, 0, 1]),
    overflow: "hidden",
  }));

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.faqQ} activeOpacity={0.75} onPress={toggle}>
        <View style={styles.faqNum}>
          <Text style={styles.faqNumText}>{index + 1}</Text>
        </View>
        <Text style={styles.faqQText}>{item.q}</Text>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={rs(16)} color={c.textMuted} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={bodyStyle}>
        <Text style={styles.faqA}>{item.a}</Text>
      </Animated.View>
    </View>
  );
}

export default function InfoTab() {
  const insets = useSafeAreaInsets();
  const { colors: c, theme, setTheme } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle={c.statusBar} translucent backgroundColor="transparent" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Momba</Text>
          <Text style={styles.sub}>Fampahalalana sy fomba fampiasa</Text>
        </View>
        <View style={styles.infoBadge}>
          <Ionicons name="information-circle" size={rs(22)} color={c.accent} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: BAR_H + insets.bottom + rs(24) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Theme picker ── */}
        <View style={styles.themeCard}>
          <Text style={styles.themeCardLabel}>Endrika ny app</Text>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map(opt => {
              const active = theme === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.themePill, active && styles.themePillActive]}
                  onPress={() => setTheme(opt.key)}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={opt.icon}
                    size={rs(14)}
                    color={active ? c.accentText : c.textMuted}
                  />
                  <Text style={[styles.themePillText, active && styles.themePillTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Founder card ── */}
        <View style={styles.founderCard}>
          <View style={styles.founderIconRing}>
            <View style={styles.founderIconInner}>
              <Ionicons name="star" size={rs(32)} color={c.accent} />
            </View>
          </View>
          <Text style={styles.founderLabel}>Namorona ny SVM</Text>
          <Text style={styles.founderName}>Zoky Casmir</Text>
          <Text style={styles.founderSub}>SVM Malaza Fahazavana</Text>
        </View>

        {/* ── Sampana card ── */}
        <View style={styles.sampanaCard}>
          <View style={styles.sampanaTop}>
            <Ionicons name="business-outline" size={rs(18)} color={c.accent} />
            <Text style={styles.sampanaChurch}>FJKM · S.P.A.A. (11)</Text>
          </View>
          <Text style={styles.sampanaName}>Sampana Vokovoko Manga</Text>
          <Text style={styles.sampanaYears}>1999 – 2019</Text>
          <View style={styles.sampanaDivider} />
          <Text style={styles.sampanaVerse}>
            "Ianareo izay tia an'i Jehovah, mankahala ny ratsy."
          </Text>
          <Text style={styles.sampanaRef}>Salamo 97:10</Text>
          <View style={styles.sampanaDivider} />
          <View style={styles.sampanaRow}>
            <Text style={styles.sampanaLabel}>Mpitandrina</Text>
            <Text style={styles.sampanaValue}>RAHARINORO Ny Hasina</Text>
          </View>
          <View style={styles.sampanaRow}>
            <Text style={styles.sampanaLabel}>Faha-20 taona</Text>
            <Text style={styles.sampanaValue}>09/06/2019</Text>
          </View>
        </View>

        {/* ── Developer card ── */}
        <View style={styles.devCard}>
          <View style={styles.devLeft}>
            <View style={styles.devIcon}>
              <Ionicons name="code-slash" size={rs(18)} color={c.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.devLabel}>Mpanamboatra ny apk</Text>
              <Text style={styles.devName}>Zoky Fitiavana</Text>
              <Text style={styles.devPseudo}>@frazakarivony</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.siteBtn}
            activeOpacity={0.75}
            onPress={() => Linking.openURL("https://frazakarivony.vercel.app/")}
          >
            <Ionicons name="globe-outline" size={rs(12)} color={c.accentText} />
            <Text style={styles.siteBtnText}>frazakarivony.vercel.app</Text>
          </TouchableOpacity>
        </View>

        {/* ── Song writer card ── */}
        <View style={styles.writerCard}>
          <View style={styles.writerLeft}>
            <View style={styles.writerIcon}>
              <Ionicons name="musical-notes" size={rs(18)} color={c.accent} />
            </View>
            <View>
              <Text style={styles.writerLabel}>Nanoratra ireo hira</Text>
              <Text style={styles.writerName}>Zoky Rajo</Text>
            </View>
          </View>
        </View>

        {/* ── FAQ ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionTitle}>FAQ — Fomba fampiasa</Text>
          <View style={styles.sectionLine} />
        </View>

        {FAQ.map((item, i) => (
          <FaqItem key={i} item={item} index={i} c={c} styles={styles} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
