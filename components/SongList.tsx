import { Link } from "expo-router";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SongItem from "./SongItem";

interface Song {
  id: string;
  title: string;
  artist?: string;
  cover?: string;
  type?: "playback" | "lyrics";
}

interface SongListProps {
  data: Song[];
}

export default function SongList({ data }: SongListProps) {
  const insets = useSafeAreaInsets(); // récupère le safe area bottom

  // Tri alphabétique insensible à la casse + accents
  const sortedData = [...data].sort((a, b) =>
    a.title.localeCompare(b.title, "fr", { sensitivity: "base" })
  );

  return (
    <FlatList
      data={sortedData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Link href={`/song/${item.id}`} asChild>
          <SongItem
            song={item}
            isPlayback={item.type === "playback"}
          />
        </Link>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 40 + insets.bottom, 
      }}
    />
  );
}
