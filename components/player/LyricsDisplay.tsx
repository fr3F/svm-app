import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";

interface LyricsDisplayProps {
  lyrics?: string;
}

export default function LyricsDisplay({ lyrics }: LyricsDisplayProps) {
  if (!lyrics) return null;

  return (
    <View style={styles.container}>
      <ThemedText color="grayWhite" style={styles.text}>
        {lyrics
          .replace(/@/g, "")
          .split("\n")
          .map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {"\n"}
            </React.Fragment>
          ))}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,  
    right:16,
    top:-40
  },
  text: {
    fontSize: 20,
    lineHeight: 36,          
    textAlign: "center",    
    fontWeight: "500",
    color: "#eee",           // si tu veux forcer la couleur ici
  },
});
