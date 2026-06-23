import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => null}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="about" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="akitsapaka" />
      <Tabs.Screen name="info" />
      <Tabs.Screen name="playlist" />
    </Tabs>
  );
}
