import { useThemeColors } from "@/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import LikeButton from "./LikeButton";

type HeaderProps = {
  title: string;
  showBack?: boolean;
  showLikeButton?: boolean;
  liked?: boolean;
  onLikePress?: (newLikedState: boolean) => void;
};

export function Header({
  title,
  showBack = true,
  showLikeButton = false,   
  liked = false,
  onLikePress,
}: HeaderProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const { width } = useWindowDimensions();

  const [internalLiked, setInternalLiked] = useState(liked);
  const isLiked = onLikePress ? liked : internalLiked;

  const statusBarHeight = Platform.OS === "android"
    ? StatusBar.currentHeight ?? 0
    : Constants.statusBarHeight ?? 0;

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("(tabs)/about");
  };

  const handleLike = () => {
    const newState = !isLiked;
    if (onLikePress) onLikePress(newState);
    else setInternalLiked(newState);
  };

  return (
    <>
      <View style={[styles.statusBar, { backgroundColor: colors.bleu, height: statusBarHeight }]} />
      <StatusBar barStyle="light-content" backgroundColor={colors.bleu} />

      <View style={[styles.header, { backgroundColor: colors.bleu, paddingTop: statusBarHeight + 10 }]}>
        {/* Placeholder gauche */}
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.sideButton} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.sideButtonPlaceholder} />
        )}

        {/* Titre + logo sur la même ligne */}
        <View style={styles.titleContainer}>
          <Image
            source={require("@/assets/images/svm.png")}
            style={{ width: width * 0.08, height: width * 0.08, marginRight: 8 }}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: colors.grayWhite }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Placeholder droit */}
        {showLikeButton ? (
          <LikeButton liked={isLiked} onPress={handleLike} />
        ) : (
          <View style={styles.sideButtonPlaceholder} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  sideButton: {
    width: 46,
    justifyContent: "center",
    alignItems: "center",
  },
  sideButtonPlaceholder: {
    width: 46,
    height: 44,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",      // ← ligne horizontale
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
});
