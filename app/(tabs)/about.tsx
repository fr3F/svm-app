// src/app/(tabs)/index.tsx
import { songs } from "@/assets/data/songs";
import FilterType from "@/components/FilterType";
import SearchInput from "@/components/SearchInput";
import SongList from "@/components/SongList";
import { useThemeColors } from "@/hooks/useThemeColors";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTab() {
  const colors = useThemeColors();

  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Calcul des compteurs (une seule fois car songs est statique)
  const counts = useMemo(
    () => ({
      all: songs.length,
      playback: songs.filter(s => s.type === "playback").length,
      lyrics: songs.filter(s => s.type === "lyrics").length,
    }),
    []
  );

  // Liste filtrée ultra optimisée
  const filteredSongs = useMemo(() => {
    if (!searchText.trim() && selectedType === null) return songs;

    const query = searchText.trim().toLowerCase();

    return songs.filter(song => {
      const matchesType = selectedType === null || song.type === selectedType;
      const matchesSearch =
        !query ||
        song.title.toLowerCase().includes(query);

      return matchesType && matchesSearch;
    });
  }, [searchText, selectedType]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bleu }]}>
      <View style={styles.container}>
        {/* Header */}
        <Image source={require("@/assets/images/svm.png")} style={styles.logo} />
        <Text style={styles.subtitle}>
          Sampana Vokovokomanga & Rantsana Fanatenana
          Malaza Fahazavana
        </Text>

        {/* Search */}
        <SearchInput
          value={searchText}
          onChangeText={setSearchText}
          colors={colors}
        />

        {/* Filters avec compteur */}
        <FilterType
          selected={selectedType}
          onSelect={setSelectedType}
          colors={colors}
          counts={counts}
        />

        {/* Liste des chants */}
        {filteredSongs.length > 0 ? (
          <SongList data={filteredSongs} />
        ) : (
          <View style={styles.noResultContainer}>
            <Text style={[styles.noResultText, { color: colors.grayDark }]}>
              Tsy misy hira mifanaraka amin’ny fikarohana        
            </Text>
          </View>
        )}
        
      </View>
    </SafeAreaView>
  );
}

// Styles clairs, organisés et responsive-friendly
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 12,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 16.5,
    fontWeight: "500",
    color: "#eee",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 14,
  },
  noResultContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  noResultText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
});