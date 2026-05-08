import React from "react";
import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface Props {
  html: string;
  onReady: () => void;
  onMsg: (e: any) => void;
  webRef: React.RefObject<WebView>;
}

export default function NativeWebAudio({ html, onReady, onMsg, webRef }: Props) {
  return (
    <WebView
      ref={webRef}
      source={{ html, baseUrl: "file:///" }}
      style={styles.hidden}
      onLoadEnd={onReady}
      onMessage={onMsg}
      originWhitelist={["*"]}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      allowFileAccessFromFileURLs={true}
      mixedContentMode="always"
      mediaPlaybackRequiresUserAction={false}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowsInlineMediaPlayback={true}
      {...(Platform.OS === "android" ? { androidLayerType: "hardware" } : {})}
    />
  );
}

const styles = StyleSheet.create({
  hidden: { width: 0, height: 0, opacity: 0 },
});
