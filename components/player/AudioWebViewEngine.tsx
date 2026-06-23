import { nativeEngine } from "@/stores/nativeEngine";
import { usePlayer } from "@/stores/usePlayer";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { AUDIO_HTML } from "./audioHtml";

export default function AudioWebViewEngine() {
  if (Platform.OS === "web") return null;

  const handleMsg = (e: any) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === "status") {
        usePlayer.getState().setIsPlaying(msg.isPlaying);
      } else if (msg.type === "ended") {
        usePlayer.getState().setIsPlaying(false);
      }
      nativeEngine.msgHandlers.forEach(h => h(msg));
    } catch {}
  };

  const handleReady = () => {
    nativeEngine.ready = true;
    nativeEngine.onReadyCallbacks.forEach(cb => cb());
    nativeEngine.onReadyCallbacks.clear();
  };

  return (
    <View pointerEvents="none" style={styles.wrapper}>
      <WebView
        ref={ref => { nativeEngine.webRef = ref; }}
        source={{ html: AUDIO_HTML, baseUrl: "file:///" }}
        style={styles.webview}
        onLoadEnd={handleReady}
        onMessage={handleMsg}
        originWhitelist={["*"]}
        allowFileAccess
        allowUniversalAccessFromFileURLs
        allowFileAccessFromFileURLs
        mixedContentMode="always"
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        scrollEnabled={false}
        overScrollMode="never"
        {...(Platform.OS === "android" ? { androidLayerType: "hardware" } : {})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // opacity:0 + taille réelle — évite le throttling Android sur les WebViews 0×0
  wrapper: { position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden" },
  webview: { width: 1, height: 1, backgroundColor: "transparent" },
});
