import { BAR_H } from "@/components/TabBar";
import { useTheme } from "@/stores/useTheme";
import { isTablet, rs } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SongItem from "./SongItem";

interface Song { id: string; title: string; artist?: string; cover?: string; type?: "playback" | "lyrics"; }

const NUM_COLS = isTablet ? 2 : 1;

export default function SongList({ data }: { data: Song[] }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors: c } = useTheme();

  const sorted = useMemo(() =>
    [...data].sort((a, b) => a.title.localeCompare(b.title, "fr", { sensitivity: "base" })),
    [data]
  );

  return (
    <FlatList
      style={{ flex: 1 }}
      data={sorted}
      keyExtractor={item => item.id}
      numColumns={NUM_COLS}
      columnWrapperStyle={isTablet ? { gap: rs(8), paddingHorizontal: rs(8) } : undefined}
      renderItem={({ item, index }) => (
        <SongItem
          song={item}
          isPlayback={item.type === "playback"}
          index={index}
          onPress={() => router.push(`/song/${item.id}`)}
        />
      )}
      ItemSeparatorComponent={() => (
        <View style={{
          height: 1,
          backgroundColor: c.border,
          marginLeft: isTablet ? rs(8) : rs(70),
        }} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: BAR_H + Math.min(insets.bottom, rs(48)) + rs(10) }}
    />
  );
}
