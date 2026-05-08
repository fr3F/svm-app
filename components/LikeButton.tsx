import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import Toast from "react-native-toast-message";

type LikeButtonProps = {
  liked?: boolean;
  onPress?: (newLikedState: boolean) => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
};

export default function LikeButton({
  liked = false,
  onPress,
  size = 26,
  activeColor = "#facc15",
  inactiveColor = "#5a6e90",
}: LikeButtonProps) {
  const [internalLiked, setInternalLiked] = useState(liked);
  const animRef = useRef<Animatable.View & { animate: any }>(null);
  const isLiked = onPress ? liked : internalLiked;

  const handlePress = () => {
    const newState = !isLiked;

    Toast.show({
      type: newState ? "success" : "info",
      text1: newState ? "Tiako ity hira ity !" : "Tsy tiako intsony",
      text2: newState
        ? "Nampiana ao amin'ny hira tianao ity hira ity."
        : "Esorinao amin'ny hira tianao ity hira ity.",
      position: "top",
      visibilityTime: 1500,
    });

    if (animRef.current) {
      animRef.current.animate(
        { 0: { scale: 1 }, 0.5: { scale: 1.5 }, 1: { scale: 1 } },
        400
      );
    }

    if (onPress) onPress(newState);
    else setInternalLiked(newState);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7} style={styles.button}>
      <Animatable.View ref={animRef}>
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={size}
          color={isLiked ? activeColor : inactiveColor}
        />
      </Animatable.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 12,
  },
});
