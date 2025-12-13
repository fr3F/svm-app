import { ThemedText } from "@/components/ThemedText";
import { useFavorites } from "@/stores/useFavorites";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import LikeButton from "./LikeButton";

interface Song {
  id: string;
  title: string;
  artist?: string;
}

interface Props {
  song: Song;
  onPress?: () => void;
  isPlayback?: boolean;
}

export default function SongItem({ song, onPress, isPlayback = false }: Props) {
  const { toggle, isFavorite } = useFavorites();
  const liked = isFavorite(song.id);

  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {song.title}
          </ThemedText>
          {song.artist && (
            <ThemedText color="black" style={{ fontSize: 13, marginTop: 2 }}>
              {song.artist}
            </ThemedText>
          )}
        </View>



        {isPlayback && (
          <View style={styles.playbackBadge}>
            <Ionicons name="musical-notes" size={15} color="#e6d709" />
          </View>
        )}

      <LikeButton
        liked={liked}
        size={26}
        activeColor="#facc15"
        inactiveColor="#888"
        onPress={(newState) => toggle(song.id)}
      />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: { paddingVertical: 14, paddingHorizontal: 16 },
  content: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 15.5, fontWeight: "500", color: "#fff"},
  playbackBadge: {
    backgroundColor: "rgba(230,215,9,0.15)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
});