import TabBar from "@/components/TabBar";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <TabBar />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="about" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="akitsapaka" />
    </Tabs>
  );
}
