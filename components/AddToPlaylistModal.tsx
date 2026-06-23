import { usePlaylists } from "@/stores/usePlaylist";
import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useRef, useState } from "react";
import {
  Keyboard, Modal, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  visible: boolean;
  onClose: () => void;
  songId: string;
  songTitle: string;
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: c.overlay },
    sheet: {
      position: "absolute", bottom: 0, left: 0, right: 0,
      backgroundColor: c.surface,
      borderTopLeftRadius: rs(24), borderTopRightRadius: rs(24),
      borderTopWidth: 1, borderColor: c.border,
      paddingTop: rs(12), paddingBottom: rs(36), paddingHorizontal: rs(24),
      alignItems: "center", gap: rs(12), maxHeight: "80%",
    },
    handle: {
      width: rs(40), height: rs(4), borderRadius: rs(2),
      backgroundColor: c.border, marginBottom: rs(2),
    },
    sheetTitle: { fontSize: rf(18), fontWeight: "800", color: c.text },
    sheetSub: { fontSize: rf(13), color: c.textSub, textAlign: "center" },
    listScroll: { width: "100%", maxHeight: rs(240) },
    playlistRow: {
      flexDirection: "row", alignItems: "center", gap: rs(12),
      paddingVertical: rs(10), paddingHorizontal: rs(12),
      borderRadius: rs(14), borderWidth: 1, borderColor: c.border,
      backgroundColor: c.bg, marginBottom: rs(8),
    },
    playlistRowDone: { borderColor: c.borderAccent, backgroundColor: c.accentDim },
    plIcon: {
      width: rs(36), height: rs(36), borderRadius: rs(10),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.borderAccent,
      justifyContent: "center", alignItems: "center",
    },
    plIconDone: { backgroundColor: c.accent, borderColor: c.accent },
    plInfo: { flex: 1 },
    plName: { fontSize: rf(14), fontWeight: "700", color: c.text },
    plCount: { fontSize: rf(11), color: c.textMuted, marginTop: rs(1) },
    alreadyBadge: {
      fontSize: rf(10), fontWeight: "700", color: c.accent,
      backgroundColor: c.accentDim,
      borderRadius: rs(8), paddingHorizontal: rs(6), paddingVertical: rs(2),
    },
    emptyHint: { alignItems: "center", gap: rs(8), paddingVertical: rs(16) },
    emptyHintText: { fontSize: rf(13), color: c.textMuted, textAlign: "center" },
    createBox: { width: "100%", gap: rs(10) },
    input: {
      width: "100%", height: rs(48), borderRadius: rs(14),
      borderWidth: 1, borderColor: c.borderAccent,
      backgroundColor: c.accentDim,
      paddingHorizontal: rs(14),
      fontSize: rf(14), color: c.text,
    },
    createBtnRow: { flexDirection: "row", gap: rs(10) },
    btnCancel: {
      flex: 1, height: rs(44), borderRadius: rs(14),
      borderWidth: 1, borderColor: c.border, backgroundColor: c.bg,
      justifyContent: "center", alignItems: "center",
    },
    btnCancelText: { fontSize: rf(14), fontWeight: "700", color: c.textSub },
    btnConfirm: {
      flex: 1, height: rs(44), borderRadius: rs(14),
      backgroundColor: c.accent,
      flexDirection: "row", justifyContent: "center", alignItems: "center", gap: rs(6),
    },
    btnConfirmDim: { opacity: 0.4 },
    btnConfirmText: { fontSize: rf(14), fontWeight: "800", color: c.accentText },
    newPlaylistBtn: {
      flexDirection: "row", alignItems: "center", gap: rs(8),
      paddingVertical: rs(12), paddingHorizontal: rs(16),
      borderRadius: rs(14), borderWidth: 1,
      borderColor: c.borderAccent, backgroundColor: c.accentDim,
      width: "100%",
    },
    newPlaylistText: { fontSize: rf(14), fontWeight: "700", color: c.accent },
    cancelBtn: {
      width: "100%", height: rs(48), borderRadius: rs(14),
      borderWidth: 1, borderColor: c.border, backgroundColor: c.bg,
      justifyContent: "center", alignItems: "center",
    },
    cancelText: { fontSize: rf(15), fontWeight: "700", color: c.textSub },
  });
}

export default function AddToPlaylistModal({ visible, onClose, songId, songTitle }: Props) {
  const { playlists, createPlaylist, addSong, hasSong } = usePlaylists();
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<TextInput>(null);
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  const handleClose = () => {
    setCreating(false);
    setNewName("");
    Keyboard.dismiss();
    onClose();
  };

  const handleSelectPlaylist = (playlistId: string) => {
    addSong(playlistId, songId);
    Toast.show({
      type: "success",
      text1: "Nampiana!",
      text2: `« ${songTitle} » dia nampiana ny playlist.`,
      position: "top",
      visibilityTime: 1800,
    });
    handleClose();
  };

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const id = createPlaylist(trimmed);
    addSong(id, songId);
    Toast.show({
      type: "success",
      text1: "Nampiana!",
      text2: `Playlist « ${trimmed} » noforonina ary « ${songTitle} » nampiana.`,
      position: "top",
      visibilityTime: 2000,
    });
    handleClose();
  };

  const startCreating = () => {
    setCreating(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={handleClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Ampio amin'ny Playlist</Text>
        <Text style={styles.sheetSub} numberOfLines={2}>« {songTitle} »</Text>

        {playlists.length > 0 && (
          <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {playlists.map(pl => {
              const already = hasSong(pl.id, songId);
              return (
                <TouchableOpacity
                  key={pl.id}
                  style={[styles.playlistRow, already && styles.playlistRowDone]}
                  activeOpacity={already ? 1 : 0.75}
                  onPress={() => !already && handleSelectPlaylist(pl.id)}
                >
                  <View style={[styles.plIcon, already && styles.plIconDone]}>
                    <Ionicons
                      name={already ? "checkmark" : "list"}
                      size={rs(17)}
                      color={already ? c.accentText : c.accent}
                    />
                  </View>
                  <View style={styles.plInfo}>
                    <Text style={styles.plName}>{pl.name}</Text>
                    <Text style={styles.plCount}>{pl.songIds.length} hira</Text>
                  </View>
                  {already && <Text style={styles.alreadyBadge}>Efa ao</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {playlists.length === 0 && !creating && (
          <View style={styles.emptyHint}>
            <Ionicons name="list-outline" size={rs(36)} color={c.textMuted} />
            <Text style={styles.emptyHintText}>Tsy misy playlist mbola</Text>
          </View>
        )}

        {creating ? (
          <View style={styles.createBox}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Anaran'ny playlist..."
              placeholderTextColor={c.textMuted}
              maxLength={60}
              returnKeyType="done"
              onSubmitEditing={handleCreate}
            />
            <View style={styles.createBtnRow}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => { setCreating(false); setNewName(""); }}
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
        ) : (
          <TouchableOpacity style={styles.newPlaylistBtn} onPress={startCreating} activeOpacity={0.75}>
            <Ionicons name="add-circle-outline" size={rs(18)} color={c.accent} />
            <Text style={styles.newPlaylistText}>Mamorona playlist vaovao</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.cancelBtn} onPress={handleClose} activeOpacity={0.75}>
          <Text style={styles.cancelText}>Hanafoana</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
