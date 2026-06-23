import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    card: {
      flexDirection: "row", alignItems: "center",
      backgroundColor: c.surface,
      borderRadius: rs(16), padding: rs(13),
      gap: rs(11),
      borderWidth: 1, borderColor: c.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    },
    numBadge: {
      width: rs(24), height: rs(24), borderRadius: rs(12),
      backgroundColor: c.surfaceHigh,
      justifyContent: "center", alignItems: "center",
      borderWidth: 1, borderColor: c.borderAccent,
    },
    numText: { fontSize: rf(11), fontWeight: "800", color: c.accent },
    iconBox: {
      width: rs(40), height: rs(40), borderRadius: rs(12),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center",
    },
    title: { flex: 1, fontSize: rf(15), fontWeight: "600", color: c.text, lineHeight: rf(22) },
    arrow: {
      width: rs(26), height: rs(26), borderRadius: rs(13),
      backgroundColor: c.accentDim,
      justifyContent: "center", alignItems: "center",
    },
  });
}

export default function SongCard({ id, title, index }: { id: string; title: string; index?: number }) {
  const router = useRouter();
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/song/${id}`)}
      activeOpacity={0.72}
    >
      {index !== undefined && (
        <View style={styles.numBadge}>
          <Text style={styles.numText}>{index}</Text>
        </View>
      )}
      <View style={styles.iconBox}>
        <Ionicons name="musical-notes" size={rs(20)} color={c.accent} />
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <View style={styles.arrow}>
        <Ionicons name="chevron-forward" size={rs(16)} color={c.accent} />
      </View>
    </TouchableOpacity>
  );
}
