// src/components/player/PlaybackControls.tsx
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface PlaybackControlsProps {
  audioSource: any; // ex: require("@/assets/audio/xxx.mp3") ou { uri: "https://..." }
  onStatusUpdate?: (status: AVPlaybackStatus) => void;
}

export default function PlaybackControls({ audioSource }: PlaybackControlsProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Important : on garde une référence pour éviter les fuites
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const formatTime = (millis: number) => {
    if (!millis || millis === 0) return "0:00";
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Précharge le son dès le montage (crucial sur iOS)
  useEffect(() => {
    if (!audioSource) return;

    let isActive = true;
    let currentSound: Audio.Sound | null = null;

    const loadSound = async () => {
      try {
        setLoading(true);
        // Mode par défaut pour iOS : on autorise le ducking (son réduit si appel, etc.)
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAudio: true,
        });

        const { sound: newSound } = await Audio.Sound.createAsync(
          audioSource,
          {
            shouldPlay: false,        // ← NE PAS jouer automatiquement
            isLooping: false,
          },
          onPlaybackStatusUpdate
        );

        if (isActive && isMounted.current) {
          currentSound = newSound;
          setSound(newSound);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur chargement audio:", error);
        if (isMounted.current) setLoading(false);
      }
    };

    loadSound();

    return () => {
      isActive = false;
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [audioSource]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.error("Erreur playback:", status.error);
      }
      return;
    }

    setPosition(status.positionMillis || 0);
    setDuration(status.durationMillis || 0);
    setIsPlaying(status.isPlaying);

    if (status.didJustFinish) {
      setIsPlaying(false);
      // Optionnel : revenir au début
      sound?.setPositionAsync(0);
    }
  };

  const playPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      // Sur iOS, cette action vient d'une interaction utilisateur → autorisé
      await sound.playAsync();
    }
  };

  const seekBackward = async () => {
    if (sound) {
      const newPos = Math.max(0, position - 10000);
      await sound.setPositionAsync(newPos);
    }
  };

  const seekForward = async () => {
    if (sound && duration > 0) {
      const newPos = Math.min(duration, position + 10000);
      await sound.setPositionAsync(newPos);
    }
  };

  // Nettoyage propre à la destruction du composant
  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  return (
    <>
      {duration > 0 && (
        <View style={styles.miniProgressContainer}>
          <ThemedText color="grayWhite" style={styles.miniTime}>
            {formatTime(position)}
          </ThemedText>

          <View style={styles.miniProgressBar}>
            <View
              style={{
                height: "100%",
                width: `${duration > 0 ? (position / duration) * 100 : 0}%`,
                backgroundColor: "#e6d709",
                borderRadius: 2,
              }}
            />
          </View>

          <ThemedText color="grayWhite" style={styles.miniTime}>
            {formatTime(duration)}
          </ThemedText>
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity onPress={seekBackward} style={styles.btn} disabled={loading}>
          <Ionicons name="play-skip-back-circle" size={48} color="#e6d709" />
          <ThemedText color="black" style={styles.label}>-10s</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={playPause} disabled={loading || !sound}>
          {loading ? (
            <Ionicons name="hourglass" size={80} color="#ccc" />
          ) : (
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={80}
              color="#e6d709"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={seekForward} style={styles.btn} disabled={loading}>
          <Ionicons name="play-skip-forward-circle" size={48} color="#e6d709" />
          <ThemedText style={styles.label}>+10s</ThemedText>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  btn: { alignItems: "center" },
  label: { fontSize: 11, marginTop: 4 ,color:"#fff"},
  miniProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginVertical: 8,
    gap: 10,
  },
  miniProgressBar: {
    flex: 1,
    height: 6,
    maxWidth: 180,
    backgroundColor: "#444",
    borderRadius: 2,
    overflow: "hidden",
  },
  miniTime: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "center",
  },
});