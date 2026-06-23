import ConfirmModal from "@/components/ConfirmModal";
import { useFavorites } from "@/stores/useFavorites";
import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

interface Song { id: string; title: string; artist?: string; }
interface Props { song: Song; onPress?: () => void; isPlayback?: boolean; index?: number; }

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    row: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: rs(11),
      paddingLeft: rs(18),
      paddingRight: rs(14),
      gap: rs(12),
      position: "relative",
    },
    accentBar: {
      position: "absolute",
      left: 0, top: rs(10), bottom: rs(10),
      width: rs(3), borderRadius: 2,
      backgroundColor: c.accent,
    },
    iconBox: {
      width: rs(40), height: rs(40), borderRadius: rs(12),
      backgroundColor: c.accentDim,
      borderWidth: 1, borderColor: c.border,
      justifyContent: "center", alignItems: "center",
    },
    iconBoxPlayback: {
      backgroundColor: c.accentDim,
      borderColor: c.borderAccent,
    },
    textBox: { flex: 1 },
    title: { fontSize: rf(14), fontWeight: "600", color: c.text },
    hint: { fontSize: rf(10), color: c.accent, marginTop: rs(2), fontWeight: "600", opacity: 0.85 },
    chevron: { marginLeft: rs(2) },
  });
}

export default function SongItem({ song, onPress, isPlayback = false }: Props) {
  const { toggle, isFavorite } = useFavorites();
  const liked = isFavorite(song.id);
  const [showConfirm, setShowConfirm] = useState(false);
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.65}>
      {isPlayback && <View style={styles.accentBar} />}

      <View style={[styles.iconBox, isPlayback && styles.iconBoxPlayback]}>
        <Ionicons
          name={isPlayback ? "headset" : "musical-note"}
          size={rs(17)}
          color={isPlayback ? c.accent : c.textSub}
        />
      </View>

      <View style={styles.textBox}>
        <Text style={styles.title} numberOfLines={1}>{song.title}</Text>
        {isPlayback && <Text style={styles.hint}>Playback</Text>}
      </View>

      <TouchableOpacity
        onPress={() => {
          if (liked) {
            setShowConfirm(true);
          } else {
            toggle(song.id);
            Toast.show({
              type: "success",
              text1: "Tiako ity hira ity !",
              text2: "Nampiana ao amin'ny hira tianao.",
              position: "top",
              visibilityTime: 1500,
            });
          }
        }}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={rs(19)}
          color={liked ? c.accent : c.textMuted}
        />
      </TouchableOpacity>

      <ConfirmModal
        visible={showConfirm}
        songTitle={song.title}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          toggle(song.id);
          setShowConfirm(false);
          Toast.show({
            type: "info",
            text1: "Esorina amin'ny Tiako",
            text2: `« ${song.title} » dia nofoananao.`,
            position: "top",
            visibilityTime: 1800,
          });
        }}
      />

      <Ionicons name="chevron-forward" size={rs(15)} color={c.textMuted} style={styles.chevron} />
    </TouchableOpacity>
  );
}
