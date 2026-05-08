import { useFavorites } from "@/stores/useFavorites";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Song { id: string; title: string; artist?: string; }
interface Props { song: Song; onPress?: () => void; isPlayback?: boolean; index?: number; }

export default function SongItem({ song, onPress, isPlayback = false, index }: Props) {
  const { toggle, isFavorite } = useFavorites();
  const liked = isFavorite(song.id);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.65}>
      {isPlayback && <View style={styles.accentBar} />}

      <View style={[styles.iconBox, isPlayback && styles.iconBoxPlayback]}>
        <Ionicons
          name={isPlayback ? "headset" : "musical-note"}
          size={rs(17)}
          color={isPlayback ? "#facc15" : "#b5c6d6"}
        />
      </View>

      <View style={styles.textBox}>
        <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
        {isPlayback && <Text style={styles.hint}>Playback</Text>}
      </View>

      <TouchableOpacity
        onPress={() => toggle(song.id)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={rs(19)}
          color={liked ? "#facc15" : "#3a4e6a"}
        />
      </TouchableOpacity>

      <Ionicons name="chevron-forward" size={rs(15)} color="#2a3a5a" style={styles.chevron} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: rs(11),
    paddingLeft: rs(18),
    paddingRight: rs(14),
    gap: rs(12),
    position: "relative",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: rs(10),
    bottom: rs(10),
    width: rs(3),
    borderRadius: 2,
    backgroundColor: "#facc15",
  },
  iconBox: {
    width: rs(40),
    height: rs(40),
    borderRadius: rs(12),
    backgroundColor: "rgba(181,198,214,0.07)",
    borderWidth: 1,
    borderColor: "rgba(181,198,214,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBoxPlayback: {
    backgroundColor: "rgba(250,204,21,0.08)",
    borderColor: "rgba(250,204,21,0.18)",
  },
  textBox: { flex: 1 },
  title: { fontSize: rf(14), fontWeight: "600", color: "#fff" },
  hint: { fontSize: rf(10), color: "#facc15", marginTop: rs(2), fontWeight: "600", opacity: 0.85 },
  chevron: { marginLeft: rs(2) },
});
