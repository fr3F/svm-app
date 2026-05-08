import { rf, rs } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOGO_CARD = rs(130);
const LOGO_RING = rs(96);
const LOGO_IMG  = rs(68);

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => router.replace("/(tabs)/about"), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <TouchableOpacity
        onPress={() => router.replace("/(tabs)/about")}
        activeOpacity={0.9}
      >
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.logoCard, { width: LOGO_CARD, height: LOGO_CARD, borderRadius: rs(34) }]}>
            <View style={[styles.logoRing, { width: LOGO_RING, height: LOGO_RING, borderRadius: rs(24) }]}>
              <Image
                source={require("@/assets/images/svm.png")}
                style={{ width: LOGO_IMG, height: LOGO_IMG, borderRadius: rs(16) }}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.brand}>SVM</Text>
          <Text style={styles.brandSub}>Sampana Vokovokomanga</Text>

          <View style={styles.sep}>
            <View style={styles.sepLine} />
            <View style={styles.sepDot} />
            <View style={styles.sepLine} />
          </View>

          <Text style={styles.tagline}>
            Rantsana FANANTENANA{"\n"}Malaza Fahazavana
          </Text>
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.indicator}>
        <View style={[styles.dot, styles.dotOn]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020118",
    justifyContent: "center",
    alignItems: "center",
  },

  glowTop: {
    position: "absolute",
    top: -rs(50),
    width: rs(240),
    height: rs(240),
    borderRadius: rs(120),
    backgroundColor: "#0f056b",
    opacity: 0.7,
  },
  glowBottom: {
    position: "absolute",
    bottom: rs(80),
    right: -rs(30),
    width: rs(180),
    height: rs(180),
    borderRadius: rs(90),
    backgroundColor: "#facc15",
    opacity: 0.04,
  },

  content: { alignItems: "center", paddingHorizontal: rs(28) },

  logoCard: {
    backgroundColor: "#06033a",
    borderWidth: 1.5,
    borderColor: "rgba(250,204,21,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: rs(28),
    shadowColor: "#facc15",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 16,
  },
  logoRing: {
    backgroundColor: "#0f056b",
    borderWidth: 2,
    borderColor: "rgba(250,204,21,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  brand: {
    fontSize: rf(44),
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 10,
    marginBottom: rs(6),
  },
  brandSub: {
    fontSize: rf(12),
    color: "#b5c6d6",
    fontWeight: "500",
    letterSpacing: 1.5,
    marginBottom: rs(22),
  },

  sep: { flexDirection: "row", alignItems: "center", gap: rs(8), marginBottom: rs(18) },
  sepLine: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    width: rs(40),
  },
  sepDot: { width: rs(5), height: rs(5), borderRadius: rs(3), backgroundColor: "#facc15" },

  tagline: {
    fontSize: rf(13),
    color: "#5a6e90",
    textAlign: "center",
    lineHeight: rf(22),
    letterSpacing: 0.4,
  },

  indicator: {
    position: "absolute",
    bottom: rs(40),
    flexDirection: "row",
    gap: rs(6),
    alignItems: "center",
  },
  dot: { width: rs(6), height: rs(6), borderRadius: rs(3), backgroundColor: "#1a0d80" },
  dotOn: { width: rs(22), backgroundColor: "#facc15", borderRadius: rs(3) },
});
