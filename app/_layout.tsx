import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import AudioWebViewEngine from "@/components/player/AudioWebViewEngine";
import MiniPlayer from "@/components/player/MiniPlayer";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <AudioWebViewEngine />
      <MiniPlayer />
      <Toast />
    </View>
  );
}
