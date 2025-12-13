import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function SongCard({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  const goToSongDetail = () => {
    router.push(`/song/${id}`); // Navigue vers /song/[id]
  };

  return (
    <TouchableOpacity style={styles.card} onPress={goToSongDetail}>
      <Ionicons name="musical-notes" size={28} color="#facc15" />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  title: { fontSize: 18, color: "#fff", flex: 1 },
});
