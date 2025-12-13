import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchInputProps
  extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  colors: {
    black: string;
    grayWhite: string;
  };
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = "Karoka hira... (ohatra: Longoko)",
  colors,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const clearText = () => onChangeText("");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.grayWhite,
          borderColor: focused ? colors.black + "55" : "transparent",
          shadowOpacity: focused ? 0.22 : 0.12,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={22}
        color={colors.black + "88"}
        style={styles.icon}
      />

      <TextInput
        style={[styles.input, { color: colors.black }]}
        placeholder={placeholder}
        placeholderTextColor={colors.black + "66"}
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
        <TouchableOpacity onPress={clearText} style={styles.clearButton}>
          <Ionicons
            name="close-circle"
            size={22}
            color={colors.black + "66"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 15,

    // Ombre douce premium
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,

    borderWidth: 1.4,
  },

  icon: {
    marginRight: 10,
    opacity: 0.8,
  },

  input: {
    flex: 1,
    fontSize: 15.5,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    letterSpacing: 0.2,
  },

  clearButton: {
    paddingLeft: 8,
  },
});
