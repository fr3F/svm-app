import { useFavorites } from "@/stores/useFavorites";
import { isTablet, rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabConfig = {
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
};

const TABS: TabConfig[] = [
  { icon: "search-outline",         iconActive: "search",           label: "Mitady",     route: "/(tabs)/about" },
  { icon: "heart-outline",          iconActive: "heart",            label: "Tiako",      route: "/(tabs)/favorites" },
  { icon: "shuffle-outline",        iconActive: "shuffle",          label: "Akitsapaka", route: "/(tabs)/akitsapaka" },
  { icon: "information-circle-outline", iconActive: "information-circle", label: "Momba", route: "/(tabs)/info" },
];

export const BAR_H = Platform.OS === "ios" ? rs(72) : rs(66);
const PILL_INSET = rs(6);
const SPRING = { damping: 18, stiffness: 160, mass: 0.7 };

function getActiveIndex(pathname: string): number {
  if (pathname.includes("favorites")) return 1;
  if (pathname.includes("akitsapaka")) return 2;
  if (pathname.includes("info")) return 3;
  return 0;
}

export default function TabBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const activeIndex = getActiveIndex(pathname);
  const { list: favorites } = useFavorites();
  const favCount = favorites.length;

  const [tabWidth, setTabWidth] = useState(0);
  const activeX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth > 0) {
      activeX.value = withSpring(activeIndex * tabWidth, SPRING);
    }
  }, [activeIndex, tabWidth]);

  const pillAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: activeX.value + PILL_INSET }],
  }));

  if (pathname === "/") return null;

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: Math.max(insets.bottom, rs(8)),
          left: isTablet ? "15%" : rs(16),
          right: isTablet ? "15%" : rs(16),
        },
      ]}
    >
      <View
        style={[styles.bar, { height: BAR_H }]}
        onLayout={e => {
          const w = e.nativeEvent.layout.width / 4;
          if (w !== tabWidth) {
            setTabWidth(w);
            activeX.value = activeIndex * w;
          }
        }}
      >
        {tabWidth > 0 && (
          <Animated.View
            style={[styles.pill, { width: tabWidth - PILL_INSET * 2 }, pillAnim]}
          />
        )}

        {TABS.map((tab, index) => {
          const focused = activeIndex === index;
          return (
            <TouchableOpacity
              key={tab.route}
              style={styles.tabItem}
              activeOpacity={0.85}
              onPress={() => router.replace(tab.route as any)}
            >
              <View style={styles.iconWrap}>
                <Ionicons
                  name={focused ? tab.iconActive : tab.icon}
                  size={rs(22)}
                  color={focused ? "#0a0630" : "#4a6080"}
                />
                {index === 1 && favCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText} allowFontScaling={false}>
                      {favCount > 99 ? "99+" : favCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[styles.label, focused && styles.labelActive]}
                allowFontScaling={false}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
  },
  bar: {
    flexDirection: "row",
    backgroundColor: "#070530",
    borderRadius: rs(28),
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.18)",
    elevation: 24,
    shadowColor: "#facc15",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 22,
    overflow: "hidden",
  },
  pill: {
    position: "absolute",
    top: rs(7),
    bottom: rs(7),
    backgroundColor: "#facc15",
    borderRadius: rs(20),
    shadowColor: "#facc15",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: rs(4),
    zIndex: 1,
  },
  label: {
    fontSize: rs(11),
    fontWeight: "700",
    color: "#4a6080",
    letterSpacing: 0.2,
  },
  labelActive: { color: "#0a0630" },

  iconWrap: { position: "relative" },
  badge: {
    position: "absolute",
    top: -rs(5),
    right: -rs(7),
    minWidth: rs(16),
    height: rs(16),
    borderRadius: rs(8),
    backgroundColor: "#facc15",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: rs(3),
  },
  badgeText: {
    fontSize: rf(9),
    fontWeight: "800",
    color: "#020118",
    lineHeight: rs(16),
  },
});
