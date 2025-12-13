import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const tabBarHeight = Platform.OS === "ios" ? 70 : 65;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#facc15",
        tabBarInactiveTintColor: "#b5c6d6",
        tabBarShowLabel: true,
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: tabBarHeight + insets.bottom,
          paddingBottom: 8 + insets.bottom, // laisse un espace avec navigation Android
          paddingTop: 8,
          backgroundColor: "rgba(1, 33, 66, 0.92)",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.18,
          shadowRadius: 12,
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontSize: 11.5,
          fontWeight: "600",
          marginTop: 3,
        },
      }}
    >
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Tiako",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "Mitady",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="search" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="akitsapaka"
        options={{
          title: "Akitsapaka",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="casino" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
