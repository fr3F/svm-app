import { ViewStyle } from "react-native";

export const Shadows = {
  dp2: {
    // iOS
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    
    // Android
    elevation: 2,
  },
} satisfies Record<string, ViewStyle>;
