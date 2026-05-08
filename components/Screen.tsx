import { isTablet } from "@/utils/responsive";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

const MAX_WIDTH = 720;

export default function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  if (!isTablet) return <View style={[{ flex: 1 }, style]}>{children}</View>;
  return (
    <View style={styles.outer}>
      <View style={[styles.inner, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, alignItems: "center" },
  inner: { flex: 1, width: "100%", maxWidth: MAX_WIDTH },
});
