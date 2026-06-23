import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  selected: string | null;
  onSelect: (type: string | null) => void;
  counts: { all: number; playback: number; lyrics: number };
}

const filters = [
  { label: "Rehetra", value: null, icon: "musical-notes-outline" },
  { label: "Playback", value: "playback", icon: "headset-outline" },
  { label: "Lyrics", value: "lyrics", icon: "book-outline" },
] as const;

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    track: {
      flexDirection: "row",
      backgroundColor: c.accentDim,
      borderRadius: rs(16),
      padding: rs(4),
      marginBottom: rs(12),
      borderWidth: 1,
      borderColor: c.border,
      gap: rs(4),
    },
    pill: {
      flex: 1, flexDirection: "row", alignItems: "center",
      justifyContent: "center", gap: rs(4),
      paddingVertical: rs(7), paddingHorizontal: rs(4),
      borderRadius: rs(11),
    },
    pillActive: {
      backgroundColor: c.accent,
      shadowColor: c.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    label: { fontSize: rf(11), color: c.textSub, fontWeight: "600" },
    labelActive: { color: c.accentText },
    badge: {
      backgroundColor: c.border,
      borderRadius: rs(7),
      minWidth: rs(20), paddingHorizontal: rs(5), paddingVertical: rs(1),
      alignItems: "center",
    },
    badgeActive: { backgroundColor: "rgba(0,0,0,0.15)" },
    badgeText: { fontSize: rf(10), color: c.textSub, fontWeight: "700" },
    badgeTextActive: { color: c.accentText },
  });
}

export default function FilterType({ selected, onSelect, counts }: Props) {
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={styles.track}>
      {filters.map(({ label, value, icon }) => {
        const active = selected === value;
        const count = value === null ? counts.all : counts[value];
        return (
          <TouchableOpacity
            key={value ?? "all"}
            activeOpacity={0.75}
            onPress={() => onSelect(value)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Ionicons name={icon as any} size={rs(12)} color={active ? c.accentText : c.textSub} />
            <Text style={[styles.label, active && styles.labelActive]} allowFontScaling={false}>{label}</Text>
            <View style={[styles.badge, active && styles.badgeActive]}>
              <Text style={[styles.badgeText, active && styles.badgeTextActive]} allowFontScaling={false}>{count}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
