import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  lyrics?: string;
  fontSize?: number;
  onLinesLayout?: (yPositions: number[]) => void;
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    wrap: { width: "90%", alignSelf: "center", alignItems: "center", paddingHorizontal: rs(8) },
    lineWrap: { width: "100%", alignItems: "center" },
    line: {
      fontSize: rf(16),
      lineHeight: rf(28),
      textAlign: "center",
      fontWeight: "400",
      color: c.textSub,
      letterSpacing: 0.2,
      marginTop: rs(2),
    },
    lineChorus: {
      color: c.accent,
      fontWeight: "700",
    },
  });
}

export default function LyricsDisplay({ lyrics, fontSize = 16, onLinesLayout }: Props) {
  const collectedRef = useRef<Record<number, number>>({});
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  const lines = lyrics ? lyrics.replace(/@/g, "").split("\n") : [];
  const contentLines = lines.filter(l => l.trim() !== "");

  const handleLineLayout = useCallback((contentIndex: number, y: number) => {
    if (!onLinesLayout) return;
    collectedRef.current[contentIndex] = y;
    if (Object.keys(collectedRef.current).length === contentLines.length) {
      const sorted = Object.entries(collectedRef.current)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([, v]) => v);
      onLinesLayout(sorted);
    }
  }, [onLinesLayout, contentLines.length]);

  if (!lyrics) return null;

  let contentIndex = 0;

  return (
    <View style={styles.wrap}>
      {lines.map((raw, i) => {
        const line = raw.trim();
        if (!line) return <View key={i} style={{ height: rs(10) }} />;

        const isChorus = line.startsWith("R:") || line.startsWith("Fiv:");
        const ci = contentIndex++;

        return (
          <View
            key={i}
            style={styles.lineWrap}
            onLayout={onLinesLayout ? e => handleLineLayout(ci, e.nativeEvent.layout.y) : undefined}
          >
            <Text style={[styles.line, isChorus && styles.lineChorus, { fontSize, lineHeight: fontSize * 1.75 }]}>
              {line}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
