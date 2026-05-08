import { songs } from "@/assets/data/songs";
import Screen from "@/components/Screen";
import { refreshFavorites, useFavorites } from "@/stores/useFavorites";
import { isTablet, rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NUM_COLS = isTablet ? 2 : 1;

export default function FavoritesTab() {
  const { list } = useFavorites();
  const router = useRouter();

  useFocusEffect(useCallback(() => { refreshFavorites(); }, []));

  const favs = useMemo(() =>
    songs
      .filter(s => list.includes(s.id))
      .sort((a, b) => a.title.localeCompare(b.title, "fr", { sensitivity: "base" })),
    [list]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#020118" />
      <Screen>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Tiako</Text>
            <Text style={styles.sub}>
              {favs.length > 0 ? `${favs.length} hira voatahiry` : "Tsy mbola misy"}
            </Text>
          </View>
          <View style={styles.heartBadge}>
            <Ionicons name="heart" size={rs(22)} color="#facc15" />
          </View>
        </View>

        {favs.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyRing}>
              <View style={styles.emptyInner}>
                <Ionicons name="heart-outline" size={rs(40)} color="#5a6e90" />
              </View>
            </View>
            <Text style={styles.emptyTitle}>Mbola tsy misy hira</Text>
            <Text style={styles.emptySub}>
              Tsindrio ny cœur eo amin'ny hira tianao{"\n"}mba hampiseho azy eto
            </Text>
          </View>
        ) : (
          <FlatList
            data={favs}
            keyExtractor={item => item.id}
            numColumns={NUM_COLS}
            columnWrapperStyle={isTablet ? styles.columnWrapper : undefined}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ItemSeparatorComponent={() => <View style={{ height: rs(10) }} />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.72}
                style={[styles.card, isTablet && styles.cardTablet]}
                onPress={() => router.push(`/song/${item.id}`)}
              >
                  {item.type === "playback" && <View style={styles.cardAccent} />}

                  <View style={styles.numBadge}>
                    <Text style={styles.numText}>{index + 1}</Text>
                  </View>

                  <View style={[styles.iconBox, item.type === "playback" && styles.iconBoxPlayback]}>
                    <Ionicons
                      name={item.type === "playback" ? "headset" : "musical-note"}
                      size={rs(19)}
                      color={item.type === "playback" ? "#facc15" : "#b5c6d6"}
                    />
                  </View>

                  <View style={styles.info}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                    {item.type === "playback" && (
                      <Text style={styles.cardType}>Playback</Text>
                    )}
                  </View>

                  <Ionicons name="heart" size={rs(18)} color="#facc15" />
                </TouchableOpacity>
            )}
          />
        )}
      </Screen>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#020118" },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: rs(20), paddingVertical: rs(16),
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)",
  },
  title: { fontSize: rf(26), fontWeight: "800", color: "#fff" },
  sub: { fontSize: rf(12), color: "#b5c6d6", marginTop: rs(3) },
  heartBadge: {
    width: rs(44), height: rs(44), borderRadius: rs(22),
    backgroundColor: "rgba(250,204,21,0.08)",
    borderWidth: 1, borderColor: "rgba(250,204,21,0.2)",
    justifyContent: "center", alignItems: "center",
  },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: rs(14), paddingHorizontal: rs(40) },
  emptyRing: {
    width: rs(100), height: rs(100), borderRadius: rs(50),
    borderWidth: 1, borderColor: "rgba(250,204,21,0.15)",
    justifyContent: "center", alignItems: "center", marginBottom: rs(4),
  },
  emptyInner: {
    width: rs(78), height: rs(78), borderRadius: rs(39),
    backgroundColor: "#06033a",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    justifyContent: "center", alignItems: "center",
  },
  emptyTitle: { fontSize: rf(18), fontWeight: "700", color: "#fff", textAlign: "center" },
  emptySub: { fontSize: rf(13), color: "#5a6e90", textAlign: "center", lineHeight: rf(21) },

  list: { paddingHorizontal: rs(14), paddingTop: rs(14), paddingBottom: rs(110) },
  columnWrapper: { gap: rs(10) },

  card: {
    flex: 1,
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#06033a",
    borderRadius: rs(16), padding: rs(12),
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    gap: rs(10), overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  cardTablet: { flex: 1 },
  cardAccent: {
    position: "absolute", left: 0, top: 0, bottom: 0,
    width: rs(3), backgroundColor: "#facc15", borderRadius: 2,
  },
  numBadge: {
    width: rs(22), height: rs(22), borderRadius: rs(11),
    backgroundColor: "#0f056b",
    justifyContent: "center", alignItems: "center",
  },
  numText: { fontSize: rf(10), fontWeight: "700", color: "#b5c6d6" },
  iconBox: {
    width: rs(40), height: rs(40), borderRadius: rs(12),
    backgroundColor: "rgba(181,198,214,0.07)",
    borderWidth: 1, borderColor: "rgba(181,198,214,0.12)",
    justifyContent: "center", alignItems: "center",
  },
  iconBoxPlayback: {
    backgroundColor: "rgba(250,204,21,0.08)",
    borderColor: "rgba(250,204,21,0.18)",
  },
  info: { flex: 1 },
  cardTitle: { fontSize: rf(14), fontWeight: "600", color: "#fff", lineHeight: rf(20) },
  cardType: { fontSize: rf(11), color: "#facc15", marginTop: rs(3), fontWeight: "600" },
});
