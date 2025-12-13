import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ShuffleButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Ionicons name="shuffle" size={28} color="#000" />
      <Text style={styles.text}>Akitsapaka indray</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#facc15",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 12,
    margin:12
  },
  text: { fontSize: 18, fontWeight: "600", color: "#000" },
});
