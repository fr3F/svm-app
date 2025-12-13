import { songs } from "@/assets/data/songs";
import { Header } from "@/components/Header";
import LyricsDisplay from "@/components/player/LyricsDisplay";
import PlaybackControls from "@/components/player/PlaybackControls";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useFavorites } from "@/stores/useFavorites";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function SongDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const { isFavorite, toggle } = useFavorites();
  const insets = useSafeAreaInsets();

  const song = songs.find((s) => s.id === id);

  if (!song) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.grayDark }]}>
        <Header title="Tsy hita" showBack />
        <View style={styles.centerContent}>
          <ThemedText color="grayWhite" style={styles.centerText}>
            Tsy hita ny hira
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const liked = isFavorite(song.id);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.grayDark }]}>
      <Header
        title={song.title}
        showBack
        showLikeButton
        liked={liked}
        onLikePress={() => toggle(song.id)}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: (Platform.OS === "ios" ? 40 : 60) + insets.bottom,
          alignItems: "center", // centrer horizontalement
        }}
        showsVerticalScrollIndicator={false}
      >
        {song.type === "playback" && song.audio && (
          <PlaybackControls audioSource={song.audio} />
        )}

        <View style={styles.lyricsWrapper}>
          <LyricsDisplay
            lyrics={song.lyrics}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  lyricsWrapper: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
});
