import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  align?: "left" | "center" | "right"; 
};

export function Button({ title, onPress, align = "center" }: ButtonProps) {
  const colors = useThemeColors();

  const alignmentStyle = {
    alignSelf:
      align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, { backgroundColor: colors.grayDark }, alignmentStyle]}
    >
      <ThemedText variant="headline" color="grayWhite">
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
});
