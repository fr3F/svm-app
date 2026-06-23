import { useTheme } from "@/stores/useTheme";
import { ThemeColors } from "@/utils/colors";
import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Platform, StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface SearchInputProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    wrap: {
      flexDirection: "row",
      alignItems: "center",
      height: rs(46),
      borderRadius: rs(14),
      backgroundColor: c.accentDim,
      borderWidth: 1.5,
      borderColor: c.border,
      paddingHorizontal: rs(13),
      marginBottom: rs(10),
    },
    wrapFocused: {
      borderColor: c.borderAccent,
      backgroundColor: c.accentDim,
    },
    icon: { marginRight: rs(8) },
    input: {
      flex: 1,
      fontSize: rf(14),
      color: c.text,
      paddingVertical: Platform.OS === "ios" ? rs(10) : rs(6),
    },
  });
}

export default function SearchInput({ value, onChangeText, placeholder = "Karoka hira...", ...rest }: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const { colors: c } = useTheme();
  const styles = useMemo(() => makeStyles(c), [c]);

  return (
    <View style={[styles.wrap, focused && styles.wrapFocused]}>
      <Ionicons name="search" size={rs(18)} color={focused ? c.accent : c.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={c.textMuted}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close-circle" size={rs(18)} color={c.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}
