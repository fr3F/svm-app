import { rf, rs } from "@/utils/responsive";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props { lyrics?: string; }

export default function LyricsDisplay({ lyrics }: Props) {
  if (!lyrics) return null;

  const lines = lyrics.replace(/@/g, "").split("\n");

  return (
    <View style={styles.wrap}>
      {lines.map((raw, i) => {
        const line = raw.trim();
        if (!line) return <View key={i} style={{ height: rs(10) }} />;

        const isChorus = line.startsWith("R:") || line.startsWith("Fiv:");

        return (
          <Text key={i} style={[styles.line, isChorus && styles.lineChorus]}>
            {line}
          </Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "90%", alignSelf: "center", alignItems: "center", paddingHorizontal: rs(8) },

  line: {
    fontSize: rf(16),
    lineHeight: rf(28),
    textAlign: "center",
    fontWeight: "400",
    color: "#c8d8e8",
    letterSpacing: 0.2,
    marginTop: rs(2),
  },
  lineChorus: {
    color: "#facc15",
    fontWeight: "700",
  },
});
