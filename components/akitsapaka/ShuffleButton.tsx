import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ShuffleButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name="shuffle" size={rs(20)} color="#020118" />
      <Text style={styles.label} allowFontScaling={false}>Akitsapaka</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#facc15",
    paddingHorizontal: rs(14), paddingVertical: rs(12),
    borderRadius: rs(14), gap: rs(7),
    shadowColor: "#facc15",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45, shadowRadius: 14, elevation: 8,
  },
  label: { fontSize: rf(14), fontWeight: "700", color: "#020118", letterSpacing: 0.2 },
});
