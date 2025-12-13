// components/FilterType.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  selected: string | null;
  onSelect: (type: string | null) => void;
  colors: { bleu: string };
  counts: {
    all: number;
    playback: number;
    lyrics: number;
  };
}

const filters = [
  { label: "Rehetra", value: null, icon: "musical-notes-outline" },
  { label: "Playback", value: "playback", icon: "play-circle-outline" },
  { label: "Lyrics", value: "lyrics", icon: "book-outline" },
] as const;

export default function FilterType({ selected, onSelect, colors, counts }: Props) {
  return (
    <View style={styles.container}>
      {filters.map(({ label, value, icon }) => {
        const isActive = selected === value;
        const count = value === null ? counts.all : counts[value];

        return (
          <TouchableOpacity
            key={value ?? "all"}
            activeOpacity={0.7}
            onPress={() => onSelect(value)}
            style={[styles.btn, isActive && styles.btnActive]}
          >
            <Ionicons
              name={icon as any}
              size={15}
              color={isActive ? colors.bleu : "#aaa"}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {label}
            </Text>

            <View style={[styles.badge, isActive && styles.badgeActive]}>
              <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                {count > 99 ? "99+" : count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 15,
    marginBottom:8,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  btnActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 12.5,
    color: "#aaa",
    fontWeight: "500",
  },
  labelActive: {
    color: "#000",
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeActive: {
    backgroundColor: "#facc15",
  },
  badgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  badgeTextActive: {
    color: "#1a0d5e",
  },
});