import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Linking, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BAR_H } from "@/components/TabBar";

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

export default function InfoTab() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Momba</Text>
          <Text style={styles.sub}>Fampahalalana sy fomba fampiasa</Text>
        </View>
        <View style={styles.infoBadge}>
          <Ionicons name="information-circle" size={rs(22)} color="#facc15" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: BAR_H + insets.bottom + rs(24) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Founder card ── */}
        <View style={styles.founderCard}>
          <View style={styles.founderIconRing}>
            <View style={styles.founderIconInner}>
              <Ionicons name="star" size={rs(32)} color="#facc15" />
            </View>
          </View>
          <Text style={styles.founderLabel}>Namorona ny SVM</Text>
          <Text style={styles.founderName}>Zoky Casmir</Text>
          <Text style={styles.founderSub}>SVM Malaza Fahazavana</Text>
        </View>

        {/* ── Developer card ── */}
        <View style={styles.devCard}>
          <View style={styles.devLeft}>
            <View style={styles.devIcon}>
              <Ionicons name="code-slash" size={rs(18)} color="#facc15" />
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
            <Ionicons name="globe-outline" size={rs(12)} color="#020118" />
            <Text style={styles.siteBtnText}>frazakarivony.vercel.app</Text>
          </TouchableOpacity>
        </View>

        {/* ── Song writer card ── */}
        <View style={styles.writerCard}>
          <View style={styles.writerLeft}>
            <View style={styles.writerIcon}>
              <Ionicons name="musical-notes" size={rs(18)} color="#facc15" />
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
          <View key={i} style={styles.faqItem}>
            <View style={styles.faqQ}>
              <View style={styles.faqNum}>
                <Text style={styles.faqNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.faqQText}>{item.q}</Text>
            </View>
            <Text style={styles.faqA}>{item.a}</Text>
          </View>
        ))}
      </ScrollView>
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
  infoBadge: {
    width: rs(44), height: rs(44), borderRadius: rs(22),
    backgroundColor: "rgba(250,204,21,0.08)",
    borderWidth: 1, borderColor: "rgba(250,204,21,0.2)",
    justifyContent: "center", alignItems: "center",
  },

  scroll: { paddingHorizontal: rs(18), paddingTop: rs(14), gap: rs(14) },

  devCard: {
    backgroundColor: "#06033a",
    borderRadius: rs(16),
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    padding: rs(16), gap: rs(10),
  },
  devLeft: { flexDirection: "row", alignItems: "center", gap: rs(14) },
  devIcon: {
    width: rs(44), height: rs(44), borderRadius: rs(14),
    backgroundColor: "rgba(250,204,21,0.08)",
    borderWidth: 1, borderColor: "rgba(250,204,21,0.18)",
    justifyContent: "center", alignItems: "center",
    flexShrink: 0,
  },
  devLabel: { fontSize: rf(11), color: "#5a6e90", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 },
  devName: { fontSize: rf(15), fontWeight: "800", color: "#fff", marginTop: rs(1) },
  devPseudo: { fontSize: rf(12), color: "#facc15", fontWeight: "600", marginTop: rs(1) },
  siteBtn: {
    flexDirection: "row", alignItems: "center", gap: rs(5),
    alignSelf: "flex-end",
    backgroundColor: "#facc15",
    paddingHorizontal: rs(12), paddingVertical: rs(6),
    borderRadius: rs(16),
  },
  siteBtnText: { fontSize: rf(11), fontWeight: "700", color: "#020118" },

  writerCard: {
    backgroundColor: "#06033a",
    borderRadius: rs(16),
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    padding: rs(16),
  },
  writerLeft: { flexDirection: "row", alignItems: "center", gap: rs(14) },
  writerIcon: {
    width: rs(44), height: rs(44), borderRadius: rs(14),
    backgroundColor: "rgba(250,204,21,0.08)",
    borderWidth: 1, borderColor: "rgba(250,204,21,0.18)",
    justifyContent: "center", alignItems: "center",
  },
  founderCard: {
    backgroundColor: "#06033a",
    borderRadius: rs(24),
    borderWidth: 1.5, borderColor: "rgba(250,204,21,0.35)",
    alignItems: "center",
    paddingVertical: rs(36), paddingHorizontal: rs(20),
    gap: rs(6),
    shadowColor: "#facc15",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, shadowRadius: 20,
    elevation: 10,
  },
  founderIconRing: {
    width: rs(100), height: rs(100), borderRadius: rs(50),
    borderWidth: 1.5, borderColor: "rgba(250,204,21,0.3)",
    justifyContent: "center", alignItems: "center",
    marginBottom: rs(8),
  },
  founderIconInner: {
    width: rs(78), height: rs(78), borderRadius: rs(39),
    backgroundColor: "rgba(250,204,21,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  founderLabel: { fontSize: rf(11), color: "#5a6e90", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 },
  founderName: { fontSize: rf(26), fontWeight: "800", color: "#fff", letterSpacing: 0.4 },
  founderSub: { fontSize: rf(13), color: "#facc15", fontWeight: "600", marginTop: rs(2) },

  writerLabel: { fontSize: rf(11), color: "#5a6e90", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 },
  writerName: { fontSize: rf(16), fontWeight: "800", color: "#fff", marginTop: rs(2) },

  sectionHeader: {
    flexDirection: "row", alignItems: "center",
    gap: rs(10), marginTop: rs(6),
  },
  sectionLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.07)" },
  sectionTitle: { fontSize: rf(11), color: "#5a6e90", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },

  faqItem: {
    backgroundColor: "#06033a",
    borderRadius: rs(16),
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    padding: rs(16), gap: rs(10),
  },
  faqQ: { flexDirection: "row", alignItems: "flex-start", gap: rs(10) },
  faqNum: {
    width: rs(22), height: rs(22), borderRadius: rs(11),
    backgroundColor: "#facc15",
    justifyContent: "center", alignItems: "center",
    flexShrink: 0, marginTop: rs(1),
  },
  faqNumText: { fontSize: rf(10), fontWeight: "800", color: "#020118" },
  faqQText: { flex: 1, fontSize: rf(13), fontWeight: "700", color: "#fff", lineHeight: rf(20) },
  faqA: { fontSize: rf(12), color: "#b5c6d6", lineHeight: rf(20), paddingLeft: rs(32) },
});
