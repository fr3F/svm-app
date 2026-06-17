import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => null}
      sceneContainerStyle={{ flex: 1, backgroundColor: "#020118" }}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="about" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="akitsapaka" />
    </Tabs>
  );
}
