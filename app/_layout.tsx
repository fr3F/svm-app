import { Stack } from "expo-router";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      {/* Toast global accessible partout */}
      <Toast />
    </View>
  );
}
