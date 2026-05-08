import { View, type ViewProps } from "react-native";
import { Shadows } from "@/constants/Shadows";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = ViewProps;

export function Card({ style, ...rest }: Props) {
  const colors = useThemeColors();
  return (
    <View
      style={[
        {
          borderRadius: 20,
          backgroundColor: colors.card ?? "#1A1A2E",
          borderWidth: 1,
          borderColor: colors.border ?? "#252540",
        },
        Shadows.dp2,
        style,
      ]}
      {...rest}
    />
  );
}   