import { nativeEngine } from "@/stores/nativeEngine";
import { usePlayer } from "@/stores/usePlayer";
import { Platform, StyleSheet } from "react-native";
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
    <WebView
      ref={ref => { nativeEngine.webRef = ref; }}
      source={{ html: AUDIO_HTML, baseUrl: "file:///" }}
      style={styles.hidden}
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
      {...(Platform.OS === "android" ? { androidLayerType: "hardware" } : {})}
    />
  );
}

const styles = StyleSheet.create({
  hidden: { width: 0, height: 0, opacity: 0, position: "absolute" },
});
