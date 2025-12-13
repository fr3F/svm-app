import { songs } from "@/assets/data/songs";
import DropdownPicker from "@/components/akitsapaka/DropdownPicker";
import ShuffleButton from "@/components/akitsapaka/ShuffleButton";
import SongCard from "@/components/akitsapaka/SongCard";
import { Header } from "@/components/Header";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AkitsapakaScreen() {
  const { count } = useLocalSearchParams();
  const initialCount = count ? Math.max(1, Math.min(10, Number(count))) : 1;

  const [countNumber, setCountNumber] = useState<number>(initialCount);
  const [randomSongs, setRandomSongs] = useState<{ id: string; title: string }[]>([]);

  const pickRandom = () => {
    if (!songs || songs.length === 0) return;

    const shuffled = [...songs].sort(() => Math.random() - 0.5);

    const selected = shuffled.slice(0, countNumber).map((s, index) => {
      if (typeof s === "object" && s.title) {
        return { id: s.id || String(index), title: s.title };
      } else {
        return { id: String(index), title: String(s) };
      }
    });

    setRandomSongs(selected);
  };

  useEffect(() => pickRandom(), [countNumber]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Akitsapaka"
        showBack
      />
      <View style={styles.container1}>
        <Text style={styles.subtitle}>
          {countNumber === 1
            ? "Hira iray voafantina kisendrasendra"
            : `${countNumber} hira voafantina kisendrasendra`}
        </Text>

        <DropdownPicker value={countNumber} onChange={setCountNumber} max={10} />

        <ShuffleButton onPress={pickRandom} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.results}>
          {randomSongs.map((song) => (
            <SongCard key={song.id} id={song.id} title={song.title} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container1: { alignItems: "center" },
  container: { flex: 1, backgroundColor: "#111" },
  scrollContainer: { alignItems: "center", padding: 20 },
  subtitle: { fontSize: 18, color: "#aaa", marginVertical: 20, textAlign: "center" },
  results: { width: "100%", maxWidth: 400, gap: 16, marginBottom: 50 },
});
