import { songs } from "@/assets/data/songs";
import { Header } from "@/components/Header";
import { refreshFavorites, useFavorites } from "@/stores/useFavorites";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesTab() {
  const { list } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
    }, [])
  );

  const favoriteSongs = songs
    .filter((song) => list.includes(song.id))
    .sort((a, b) => a.title.localeCompare(b.title, "fr", { sensitivity: "base" }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header moderne */}
      <Header
        title="Tiako"
        showBack
      />

      {favoriteSongs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyHeart}>
            <Ionicons name="heart-outline" size={64} color="#444" />
          </View>
          <Text style={styles.emptyTitle}>Tsy mbola misy hira voatahiry</Text>
          <Text style={styles.emptySubtitle}>
            Tsindrio ny cœur eo amin'ny hira tianao mba hampiseho azy eto
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteSongs}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <Link href={`/song/${item.id}`} asChild>
              <TouchableOpacity activeOpacity={0.7} style={styles.card}>
                <View style={styles.cardContent}>
                  {item.cover ? (
                    <Image source={{ uri: item.cover }} style={styles.cover} />
                  ) : (
                    <View style={[styles.cover, styles.coverPlaceholder]}>
                      <Ionicons name="musical-notes" size={28} color="#666" />
                    </View>
                  )}

                  <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    {item.artist ? (
                      <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
                    ) : (
                      <Text style={[styles.artist, { color: "#666" }]}>Artiste inconnu</Text>
                    )}
                  </View>

                  <View style={styles.heartIcon}>
                    <Ionicons name="heart" size={26} color="#facc15" />
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
  emptyHeart: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#111", justifyContent: "center", alignItems: "center", marginBottom: 32 },
  emptyTitle: { fontSize: 22, fontWeight: "600", color: "#fff", textAlign: "center", marginBottom: 12 },
  emptySubtitle: { fontSize: 16, color: "#888", textAlign: "center", lineHeight: 22 },
  card: { marginHorizontal: 16, backgroundColor: "#111", borderRadius: 16, overflow: "hidden", elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12 },
  cardContent: { flexDirection: "row", alignItems: "center", padding: 16 },
  cover: { width: 72, height: 72, borderRadius: 14, backgroundColor: "#222" },
  coverPlaceholder: { justifyContent: "center", alignItems: "center" },
  textContainer: { flex: 1, marginLeft: 16, justifyContent: "center" },
  title: { fontSize: 17, fontWeight: "600", color: "#fff", lineHeight: 22 },
  artist: { fontSize: 14, color: "#aaa", marginTop: 4 },
  heartIcon: { marginLeft: 12, opacity: 0.9 },
});
