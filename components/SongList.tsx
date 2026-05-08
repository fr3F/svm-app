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

  const sorted = useMemo(() =>
    [...data].sort((a, b) => a.title.localeCompare(b.title, "fr", { sensitivity: "base" })),
    [data]
  );

  return (
    <FlatList
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
          backgroundColor: "rgba(255,255,255,0.05)",
          marginLeft: isTablet ? rs(8) : rs(70),
        }} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: rs(90) + insets.bottom }}
    />
  );
}
