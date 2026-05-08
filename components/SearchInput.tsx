import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface SearchInputProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChangeText, placeholder = "Karoka hira...", ...rest }: SearchInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, focused && styles.wrapFocused]}>
      <Ionicons name="search" size={rs(18)} color={focused ? "#facc15" : "#5a6e90"} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#5a6e90"
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
          <Ionicons name="close-circle" size={rs(18)} color="#5a6e90" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    height: rs(46),
    borderRadius: rs(14),
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: rs(13),
    marginBottom: rs(10),
  },
  wrapFocused: {
    borderColor: "rgba(250,204,21,0.55)",
    backgroundColor: "rgba(250,204,21,0.04)",
  },
  icon: { marginRight: rs(8) },
  input: {
    flex: 1,
    fontSize: rf(14),
    color: "#fff",
    paddingVertical: Platform.OS === "ios" ? rs(10) : rs(6),
  },
});
