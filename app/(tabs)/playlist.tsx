import Screen from "@/components/Screen";
import { BAR_H } from "@/components/TabBar";
import { usePlaylists } from "@/stores/usePlaylist";
import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      paddingHorizontal: rs(20), paddingVertical: rs(16),
      borderBottomWidth: 1, borderBottomColor: c.border,
    },
    title: { fontSize: rf(26), fontWeight: "800", color: c.text },
    sub: { fontSize: rf(12), color: c.textSub, marginTop: rs(3) },
    addBtn: {
      width: rs(44), height: rs(44), borderRadius: rs(22),
      backgroundColor: c.accent,
      justifyContent: "center", alignItems: "center",
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
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
    emptyCreateBtn: {
      flexDirection: "row", alignItems: "center", gap: rs(8),
      backgroundColor: c.accent,
      paddingHorizontal: rs(20), paddingVertical: rs(12),
      borderRadius: rs(20), marginTop: rs(4),
    },
    emptyCreateText: { fontSize: rf(14), fontWeight: "800", color: c.accentText },
    list: { paddingHorizontal: rs(14), paddingTop: rs(14) },
    card: {
      flexDirection: "row", alignItems: "center",
      backgroundColor: c.surface,
      borderRadius: rs(16), padding: rs(14),
      borderWidth: 1, borderColor: c.border,
      gap: rs(12), overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
    },
    cardIcon: {
      width: rs(44), height: rs(44), borderRadius: rs(14),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center",
    },
    cardInfo: { flex: 1 },
    cardTitle: { fontSize: rf(15), fontWeight: "700", color: c.text },
    cardSub: { fontSize: rf(11), color: c.textMuted, marginTop: rs(2) },
    countBadge: {
      minWidth: rs(28), height: rs(22), borderRadius: rs(11),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center",
      paddingHorizontal: rs(6),
    },
    countText: { fontSize: rf(11), fontWeight: "700", color: c.accent },
    modalOverlay: { flex: 1, backgroundColor: c.overlay },
    modalCard: {
      position: "absolute",
      left: rs(32), right: rs(32), top: "30%",
      backgroundColor: c.surface,
      borderRadius: rs(24),
      borderWidth: 1, borderColor: c.border,
      paddingHorizontal: rs(24),
      paddingTop: rs(32), paddingBottom: rs(24),
      alignItems: "center", gap: rs(10),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5, shadowRadius: 24, elevation: 20,
    },
    modalIconRing: {
      width: rs(72), height: rs(72), borderRadius: rs(36),
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center", marginBottom: rs(4),
    },
    modalIconInner: {
      width: rs(56), height: rs(56), borderRadius: rs(28),
      backgroundColor: c.accentDim,
      justifyContent: "center", alignItems: "center",
    },
    modalTitle: { fontSize: rf(17), fontWeight: "800", color: c.text, textAlign: "center", letterSpacing: 0.2 },
    modalSub: { fontSize: rf(13), color: c.textSub, textAlign: "center", lineHeight: rf(20), marginBottom: rs(4) },
    modalInput: {
      width: "100%",
      height: rs(48), borderRadius: rs(14),
      borderWidth: 1, borderColor: c.borderAccent,
      backgroundColor: c.accentDim,
      paddingHorizontal: rs(14),
      fontSize: rf(14), color: c.text,
    },
    modalBtnRow: { flexDirection: "row", gap: rs(10), width: "100%", marginTop: rs(4) },
    btnCancel: {
      flex: 1, height: rs(46), borderRadius: rs(14),
      borderWidth: 1, borderColor: c.border,
      backgroundColor: c.bg,
      justifyContent: "center", alignItems: "center",
    },
    btnCancelText: { fontSize: rf(14), fontWeight: "700", color: c.textSub },
    btnConfirm: {
      flex: 1, height: rs(46), borderRadius: rs(14),
      backgroundColor: c.accent,
      flexDirection: "row", justifyContent: "center",
      alignItems: "center", gap: rs(6),
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
    },
    btnConfirmDim: { opacity: 0.4 },
    btnConfirmText: { fontSize: rf(14), fontWeight: "800", color: c.accentText },
  });
}

export default function PlaylistTab() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { playlists, createPlaylist, deletePlaylist } = usePlaylists();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    createPlaylist(trimmed);
    setNewName("");
    setShowCreate(false);
    Keyboard.dismiss();
    Toast.show({
      type: "success",
      text1: "Playlist noforonina!",
      text2: `« ${trimmed} » dia voamamorona.`,
      position: "top",
      visibilityTime: 1800,
    });
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Hamafa playlist?",
      `« ${name} » dia hofanina tanteraka. Tsy hisy fiantraikany amin'ny hira.`,
      [
        { text: "Tsia", style: "cancel" },
        {
          text: "Hamafa",
          style: "destructive",
          onPress: () => {
            deletePlaylist(id);
            Toast.show({
              type: "info",
              text1: "Nofoanan'ny playlist",
              text2: `« ${name} » dia nafana.`,
              position: "top",
              visibilityTime: 1800,
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle={c.statusBar} translucent backgroundColor="transparent" />
      <Screen>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Playlist</Text>
            <Text style={styles.sub}>
              {playlists.length > 0 ? `${playlists.length} playlist voatahiry` : "Tsy mbola misy"}
            </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.75} onPress={() => setShowCreate(true)}>
            <Ionicons name="add" size={rs(22)} color={c.accentText} />
          </TouchableOpacity>
        </View>

        {playlists.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyRing}>
              <View style={styles.emptyInner}>
                <Ionicons name="list-outline" size={rs(40)} color={c.textMuted} />
              </View>
            </View>
            <Text style={styles.emptyTitle}>Tsy misy playlist mbola</Text>
            <Text style={styles.emptySub}>Tsindrio ny bouton «+» mba hamorona{"\n"}playlist vaovao</Text>
            <TouchableOpacity style={styles.emptyCreateBtn} onPress={() => setShowCreate(true)} activeOpacity={0.75}>
              <Ionicons name="add-circle-outline" size={rs(17)} color={c.accentText} />
              <Text style={styles.emptyCreateText}>Mamorona playlist</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            data={playlists}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.list, { paddingBottom: BAR_H + Math.min(insets.bottom, rs(48)) + rs(10) }]}
            ItemSeparatorComponent={() => <View style={{ height: rs(10) }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.72}
                style={styles.card}
                onPress={() => router.push(`/playlist/${item.id}` as any)}
                onLongPress={() => handleDelete(item.id, item.name)}
                delayLongPress={500}
              >
                <View style={styles.cardIcon}>
                  <Ionicons name="list" size={rs(20)} color={c.accent} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cardSub}>
                    {item.songIds.length === 0 ? "Tsy misy hira" : `${item.songIds.length} hira`}
                  </Text>
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{item.songIds.length}</Text>
                </View>
                <Ionicons name="chevron-forward" size={rs(18)} color={c.textMuted} />
              </TouchableOpacity>
            )}
          />
        )}
      </Screen>

      <Modal
        transparent
        animationType="fade"
        visible={showCreate}
        onRequestClose={() => { setShowCreate(false); setNewName(""); }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => { setShowCreate(false); setNewName(""); Keyboard.dismiss(); }}
        />
        <View style={styles.modalCard}>
          <View style={styles.modalIconRing}>
            <View style={styles.modalIconInner}>
              <Ionicons name="list" size={rs(28)} color={c.accent} />
            </View>
          </View>
          <Text style={styles.modalTitle}>Playlist vaovao</Text>
          <Text style={styles.modalSub}>Omeo anarana ny playlist vaovao</Text>
          <TextInput
            style={styles.modalInput}
            value={newName}
            onChangeText={setNewName}
            placeholder="Anaran'ny playlist..."
            placeholderTextColor={c.textMuted}
            maxLength={60}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleCreate}
          />
          <View style={styles.modalBtnRow}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={() => { setShowCreate(false); setNewName(""); Keyboard.dismiss(); }}
              activeOpacity={0.75}
            >
              <Text style={styles.btnCancelText}>Hanafoana</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnConfirm, !newName.trim() && styles.btnConfirmDim]}
              onPress={handleCreate}
              activeOpacity={0.75}
            >
              <Ionicons name="checkmark" size={rs(16)} color={c.accentText} />
              <Text style={styles.btnConfirmText}>Mamorona</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
