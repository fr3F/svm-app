import { usePlayer } from "@/stores/usePlayer";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CHAR_H = rf(13) + rs(3);
const SPACE_H = rs(40);

export default function MiniPlayer() {
  const { song, isPlaying, currentPageId } = usePlayer();
  const router = useRouter();
  const translateY = useRef(new Animated.Value(0)).current;
  const activeRef = useRef(false);

  const title = song?.title ?? "";
  const oneH = title.length * CHAR_H + SPACE_H;

  useEffect(() => {
    activeRef.current = false;
    translateY.stopAnimation();

    if (!isPlaying || !title || oneH <= 0) {
      translateY.setValue(0);
      return;
    }

    const speed = Math.max(10000, title.length * 700);
    activeRef.current = true;

    const loop = () => {
      if (!activeRef.current) return;
      translateY.setValue(0);
      Animated.timing(translateY, {
        toValue: -oneH,
        duration: speed,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && activeRef.current) loop();
      });
    };

    loop();

    return () => {
      activeRef.current = false;
      translateY.stopAnimation();
    };
  }, [title, isPlaying, oneH]);

  if (!song || !isPlaying || currentPageId === song.id) return null;

  const chars = title.split("");

  return (
    <TouchableOpacity
      style={styles.bar}
      onPress={() => router.push(`/song/${song.id}` as any)}
      activeOpacity={0.85}
    >
      <Ionicons name="musical-notes" size={rs(13)} color="#facc15" />

      <View style={styles.viewport}>
        <Animated.View style={[styles.track, { transform: [{ translateY }] }]}>
          {[0, 1].map(copy => (
            <View key={copy}>
              <View style={{ height: SPACE_H }} />
              {chars.map((char, i) => (
                <Text key={i} style={styles.char}>{char}</Text>
              ))}
            </View>
          ))}
        </Animated.View>
      </View>

      <View style={styles.iconBox}>
        <Ionicons name="headset" size={rs(13)} color="#020118" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    top: "38%",
    right: 0,
    width: rs(30),
    height: rs(240),
    paddingVertical: rs(10),
    paddingHorizontal: rs(5),
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
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
    zIndex: 999,
    overflow: "hidden",
  },
  viewport: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    alignItems: "center",
  },
  track: {
    alignItems: "center",
  },
  char: {
    fontSize: rf(10),
    fontWeight: "700",
    color: "#fff",
    lineHeight: CHAR_H,
    textAlign: "center",
  },
  iconBox: {
    width: rs(22),
    height: rs(22),
    borderRadius: rs(7),
    backgroundColor: "#facc15",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
});
