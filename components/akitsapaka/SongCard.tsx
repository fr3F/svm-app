import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SongCard({ id, title, index }: { id: string; title: string; index?: number }) {
  const router = useRouter();

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
        <Ionicons name="musical-notes" size={rs(20)} color="#facc15" />
      </View>

      <Text style={styles.title} numberOfLines={2}>{title}</Text>

      <View style={styles.arrow}>
        <Ionicons name="chevron-forward" size={rs(16)} color="#facc15" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#06033a",
    borderRadius: rs(16), padding: rs(13),
    gap: rs(11),
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  numBadge: {
    width: rs(24), height: rs(24), borderRadius: rs(12),
    backgroundColor: "#0f056b",
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "rgba(250,204,21,0.15)",
  },
  numText: { fontSize: rf(11), fontWeight: "800", color: "#facc15" },
  iconBox: {
    width: rs(40), height: rs(40), borderRadius: rs(12),
    backgroundColor: "rgba(250,204,21,0.08)",
    borderWidth: 1, borderColor: "rgba(250,204,21,0.18)",
    justifyContent: "center", alignItems: "center",
  },
  title: { flex: 1, fontSize: rf(15), fontWeight: "600", color: "#fff", lineHeight: rf(22) },
  arrow: {
    width: rs(26), height: rs(26), borderRadius: rs(13),
    backgroundColor: "rgba(250,204,21,0.08)",
    justifyContent: "center", alignItems: "center",
  },
});
