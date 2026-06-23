import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  songTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: rs(32),
    },
    card: {
      width: "100%",
      backgroundColor: c.surface,
      borderRadius: rs(24),
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: rs(24),
      paddingTop: rs(32), paddingBottom: rs(24),
      alignItems: "center",
      gap: rs(10),
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5, shadowRadius: 24, elevation: 20,
    },
    iconRing: {
      width: rs(72), height: rs(72), borderRadius: rs(36),
      borderWidth: 1, borderColor: "rgba(248,113,113,0.3)",
      justifyContent: "center", alignItems: "center", marginBottom: rs(4),
    },
    iconInner: {
      width: rs(56), height: rs(56), borderRadius: rs(28),
      backgroundColor: "rgba(248,113,113,0.12)",
      justifyContent: "center", alignItems: "center",
    },
    title: { fontSize: rf(17), fontWeight: "800", color: c.text, textAlign: "center", letterSpacing: 0.2 },
    songName: { fontSize: rf(13), color: c.textSub, textAlign: "center", lineHeight: rf(20), marginBottom: rs(6) },
    btnRow: { flexDirection: "row", gap: rs(10), width: "100%", marginTop: rs(4) },
    btnCancel: {
      flex: 1, height: rs(46), borderRadius: rs(14),
      borderWidth: 1, borderColor: c.border,
      backgroundColor: c.bg,
      justifyContent: "center", alignItems: "center",
    },
    btnCancelText: { fontSize: rf(14), fontWeight: "700", color: c.textSub },
    btnConfirm: {
      flex: 1, height: rs(46), borderRadius: rs(14),
      backgroundColor: "#f87171",
      flexDirection: "row", justifyContent: "center", alignItems: "center", gap: rs(6),
      shadowColor: "#f87171",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
    },
    btnConfirmText: { fontSize: rf(14), fontWeight: "700", color: "#fff" },
  });
}

export default function ConfirmModal({ visible, songTitle, onConfirm, onCancel }: Props) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconRing}>
            <View style={styles.iconInner}>
              <Ionicons name="heart-dislike" size={rs(28)} color="#f87171" />
            </View>
          </View>
          <Text style={styles.title}>Esorina amin'ny Tiako?</Text>
          <Text style={styles.songName} numberOfLines={2}>« {songTitle} »</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.btnCancel} onPress={onCancel} activeOpacity={0.75}>
              <Text style={styles.btnCancelText}>Tsia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnConfirm} onPress={onConfirm} activeOpacity={0.75}>
              <Ionicons name="trash-outline" size={rs(15)} color="#fff" />
              <Text style={styles.btnConfirmText}>Esorina</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
