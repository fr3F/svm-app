import { songs } from "@/assets/data/songs";
import Screen from "@/components/Screen";
import { BAR_H } from "@/components/TabBar";
import { usePlaylists } from "@/stores/usePlaylist";
import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Alert, FlatList, StatusBar, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: "row", alignItems: "center",
      paddingHorizontal: rs(16), paddingVertical: rs(14),
      borderBottomWidth: 1, borderBottomColor: c.border,
      gap: rs(12),
    },
    backCircle: {
      width: rs(38), height: rs(38), borderRadius: rs(19),
      backgroundColor: c.surface,
      borderWidth: 1, borderColor: c.border,
      justifyContent: "center", alignItems: "center",
    },
    headerCenter: { flex: 1 },
    title: { fontSize: rf(20), fontWeight: "800", color: c.text },
    sub: { fontSize: rf(12), color: c.textSub, marginTop: rs(2) },
    playlistBadge: {
      width: rs(44), height: rs(44), borderRadius: rs(22),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center",
    },
    empty: {
      flex: 1, justifyContent: "center", alignItems: "center",
      gap: rs(14), paddingHorizontal: rs(40),
    },
    emptyRing: {
      width: rs(100), height: rs(100), borderRadius: rs(50),
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center", marginBottom: rs(4),
    },
    emptyInner: {
      width: rs(78), height: rs(78), borderRadius: rs(39),
      backgroundColor: c.surface,
      borderWidth: 1, borderColor: c.border,
      justifyContent: "center", alignItems: "center",
    },
    emptyTitle: { fontSize: rf(18), fontWeight: "700", color: c.text, textAlign: "center" },
    emptySub: { fontSize: rf(13), color: c.textMuted, textAlign: "center", lineHeight: rf(21) },
    list: { paddingHorizontal: rs(14), paddingTop: rs(14) },
    card: {
      flex: 1,
      flexDirection: "row", alignItems: "center",
      backgroundColor: c.surface,
      borderRadius: rs(16), padding: rs(12),
      borderWidth: 1, borderColor: c.border,
      gap: rs(10), overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    },
    cardAccent: {
      position: "absolute", left: 0, top: 0, bottom: 0,
      width: rs(3), backgroundColor: c.accent, borderRadius: 2,
    },
    numBadge: {
      width: rs(22), height: rs(22), borderRadius: rs(11),
      backgroundColor: c.surfaceHigh,
      justifyContent: "center", alignItems: "center",
    },
    numText: { fontSize: rf(10), fontWeight: "700", color: c.textSub },
    iconBox: {
      width: rs(40), height: rs(40), borderRadius: rs(12),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.border,
      justifyContent: "center", alignItems: "center",
    },
    iconBoxPlayback: { backgroundColor: c.accentDim, borderColor: c.borderAccent },
    info: { flex: 1 },
    cardTitle: { fontSize: rf(14), fontWeight: "600", color: c.text, lineHeight: rf(20) },
    cardType: { fontSize: rf(11), color: c.accent, marginTop: rs(3), fontWeight: "600" },
    backBtn: {
      margin: rs(14), width: rs(40), height: rs(40), borderRadius: rs(20),
      backgroundColor: c.surface, justifyContent: "center", alignItems: "center",
    },
    notFound: { flex: 1, justifyContent: "center", alignItems: "center", gap: rs(14) },
    notFoundText: { fontSize: rf(15), color: c.textMuted },
  });
}

export default function PlaylistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { playlists, removeSong } = usePlaylists();
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  const playlist = playlists.find(p => p.id === id);

  const playlistSongs = useMemo(() => {
    if (!playlist) return [];
    return playlist.songIds
      .map(sid => songs.find(s => s.id === sid))
      .filter(Boolean) as typeof songs;
  }, [playlist, playlist?.songIds]);

  const handleRemove = (songId: string, songTitle: string) => {
    Alert.alert(
      "Esorina amin'ny playlist?",
      `« ${songTitle} » dia hofoanana amin'ity playlist ity.`,
      [
        { text: "Tsia", style: "cancel" },
        {
          text: "Esorina",
          style: "destructive",
          onPress: () => {
            if (!playlist) return;
            removeSong(playlist.id, songId);
            Toast.show({
              type: "info",
              text1: "Esorina",
              text2: `« ${songTitle} » dia nofoananao amin'ny playlist.`,
              position: "top",
              visibilityTime: 1800,
            });
          },
        },
      ]
    );
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)/playlist" as any);
  };

  if (!playlist) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <StatusBar barStyle={c.statusBar} translucent backgroundColor="transparent" />
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color={c.text} />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Ionicons name="list-outline" size={rs(56)} color={c.textMuted} />
          <Text style={styles.notFoundText}>Tsy hita ny playlist</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle={c.statusBar} translucent backgroundColor="transparent" />
      <Screen>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backCircle} activeOpacity={0.75}>
            <Ionicons name="chevron-back" size={rs(20)} color={c.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title} numberOfLines={1}>{playlist.name}</Text>
            <Text style={styles.sub}>
              {playlistSongs.length === 0 ? "Tsy misy hira" : `${playlistSongs.length} hira`}
            </Text>
          </View>
          <View style={styles.playlistBadge}>
            <Ionicons name="list" size={rs(20)} color={c.accent} />
          </View>
        </View>

        {playlistSongs.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyRing}>
              <View style={styles.emptyInner}>
                <Ionicons name="musical-note-outline" size={rs(40)} color={c.textMuted} />
              </View>
            </View>
            <Text style={styles.emptyTitle}>Tsy misy hira ao</Text>
            <Text style={styles.emptySub}>
              Tsindrio ny icon bookmark eo amin'ny{"\n"}pejy hira mba hanampy azy eto
            </Text>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={playlistSongs}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.list, { paddingBottom: BAR_H + Math.min(insets.bottom, rs(48)) + rs(10) }]}
            ItemSeparatorComponent={() => <View style={{ height: rs(10) }} />}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.72}
                style={styles.card}
                onPress={() => router.push(`/song/${item.id}` as any)}
              >
                {item.type === "playback" && <View style={styles.cardAccent} />}
                <View style={styles.numBadge}>
                  <Text style={styles.numText}>{index + 1}</Text>
                </View>
                <View style={[styles.iconBox, item.type === "playback" && styles.iconBoxPlayback]}>
                  <Ionicons
                    name={item.type === "playback" ? "headset" : "musical-note"}
                    size={rs(19)}
                    color={item.type === "playback" ? c.accent : c.textSub}
                  />
                </View>
                <View style={styles.info}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  {item.type === "playback" && <Text style={styles.cardType}>Playback</Text>}
                </View>
                <TouchableOpacity
                  onPress={() => handleRemove(item.id, item.title)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.6}
                >
                  <Ionicons name="bookmark" size={rs(18)} color={c.accent} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </Screen>
    </SafeAreaView>
  );
}
