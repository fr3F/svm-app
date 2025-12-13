import { useThemeColors } from "@/hooks/useThemeColors";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const colors = useThemeColors();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("(tabs)/about");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bleu }]}>
      <TouchableOpacity onPress={() => router.replace("(tabs)/about")}>
        <Image
          source={require("@/assets/images/svm.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 4,
  },
});
