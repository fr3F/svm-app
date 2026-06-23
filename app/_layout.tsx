import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import AudioWebViewEngine from "@/components/player/AudioWebViewEngine";
import MiniPlayer from "@/components/player/MiniPlayer";
import TabBar from "@/components/TabBar";
import { ThemeProvider, useTheme } from "@/stores/useTheme";

SplashScreen.preventAutoHideAsync();

function AppShell() {
  const [loaded, error] = useFonts({ ...Ionicons.font });
  const { colors: c, ready: themeReady } = useTheme();

  useEffect(() => {
    if ((loaded || error) && themeReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, themeReady]);

  if (!loaded && !error) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={c.accent} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1, backgroundColor: c.bg },
        }}
      />
      <TabBar />
      <AudioWebViewEngine />
      <MiniPlayer />
      <Toast />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
