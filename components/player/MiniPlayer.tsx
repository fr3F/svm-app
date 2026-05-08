import { usePlayer } from "@/stores/usePlayer";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MiniPlayer() {
  const { song, isPlaying, currentPageId } = usePlayer();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!song || !isPlaying || currentPageId === song.id) return null;

  return (
    <TouchableOpacity
      style={[styles.bar, { top: "40%", right: 0 }]}
      onPress={() => router.push(`/song/${song.id}` as any)}
      activeOpacity={0.85}
    >
      <Ionicons name="musical-notes" size={rs(13)} color="#facc15" />

      <ScrollView
        scrollEnabled={false}
        style={styles.titleScroll}
        contentContainerStyle={styles.titleContent}
        showsVerticalScrollIndicator={false}
      >
        {song.title.split("").map((char, i) => (
          <Text key={i} style={styles.char}>{char}</Text>
        ))}
      </ScrollView>

      <View style={styles.iconBox}>
        <Ionicons name="headset" size={rs(13)} color="#020118" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    width: rs(32),
    maxHeight: rs(300),
    paddingVertical: rs(12),
    paddingHorizontal: rs(6),
    backgroundColor: "#06033a",
    borderTopLeftRadius: rs(16),
    borderBottomLeftRadius: rs(16),
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: "rgba(250,204,21,0.35)",
    alignItems: "center",
    gap: rs(8),
    shadowColor: "#facc15",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 10,
  },
  titleScroll: {
    flexShrink: 1,
  },
  titleContent: {
    alignItems: "center",
    gap: rs(1),
  },
  char: {
    fontSize: rf(10),
    fontWeight: "700",
    color: "#fff",
    lineHeight: rf(14),
    textAlign: "center",
  },
  iconBox: {
    width: rs(22),
    height: rs(22),
    borderRadius: rs(7),
    backgroundColor: "#facc15",
    justifyContent: "center",
    alignItems: "center",
  },
});
