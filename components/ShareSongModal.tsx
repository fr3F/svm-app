import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  Alert,
  Linking,
  Modal,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  lyrics?: string;
}

function buildText(title: string, lyrics?: string) {
  const header = `🎵 ${title}\n— SVM Malaza Fahazavana —\n\n`;
  return lyrics ? header + lyrics.trim() : header;
}

function buildHtml(title: string, lyrics?: string) {
  const lines = (lyrics ?? "")
    .trim()
    .split("\n")
    .map((l) => `<p>${l.trim() === "" ? "&nbsp;" : l.trim()}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  body { font-family: Georgia, serif; margin: 40px; color: #111; }
  h1 { font-size: 22px; text-align: center; margin-bottom: 4px; }
  .sub { text-align: center; font-size: 13px; color: #555; margin-bottom: 28px; }
  p { font-size: 15px; line-height: 1.7; margin: 2px 0; }
</style>
</head>
<body>
  <h1>${title}</h1>
  <div class="sub">SVM Malaza Fahazavana</div>
  ${lines}
</body>
</html>`;
}

export default function ShareSongModal({ visible, onClose, title, lyrics }: Props) {
  const shareAsText = async () => {
    onClose();
    try {
      await Share.share({ message: buildText(title, lyrics) });
    } catch {}
  };

  const shareViaMessenger = async () => {
    onClose();
    const text = encodeURIComponent(buildText(title, lyrics));
    // scheme => package name
    const candidates: [string, string][] = [
      ["fb-messenger://", "com.facebook.orca"],   // Messenger
      ["fb-messenger-lite://", "com.facebook.mlite"], // Messenger Lite
      ["fb://", "com.facebook.katana"],            // Facebook
      ["fb://", "com.facebook.lite"],              // Facebook Lite
    ];
    for (const [scheme, pkg] of candidates) {
      try {
        const canOpen = await Linking.canOpenURL(scheme);
        if (canOpen) {
          const intentUrl = `intent://share#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=${text};package=${pkg};end`;
          await Linking.openURL(intentUrl);
          return;
        }
      } catch {}
    }
    // Tsy hita ny iray amin'ireo — native share sheet
    try {
      await Share.share({ message: buildText(title, lyrics) });
    } catch {}
  };

  const shareViaWhatsApp = async () => {
    onClose();
    const msg = encodeURIComponent(buildText(title, lyrics));
    const url = `whatsapp://send?text=${msg}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert("WhatsApp", "WhatsApp tsy hita amin'ity fitaovana ity.");
    }
  };

  const shareAsPdf = async () => {
    onClose();
    try {
      const { uri } = await Print.printToFileAsync({
        html: buildHtml(title, lyrics),
        base64: false,
      });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: title,
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert("PDF", "Tsy azo zarazarina amin'ity fitaovana ity.");
      }
    } catch (e) {
      Alert.alert("Hadisoana", "Tsy nahavita namorona PDF.");
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Fizarana hira</Text>
        <Text style={styles.sheetSub} numberOfLines={2}>« {title} »</Text>

        <View style={styles.options}>
          {/* WhatsApp */}
          <TouchableOpacity style={styles.option} activeOpacity={0.75} onPress={shareViaWhatsApp}>
            <View style={[styles.optIcon, { backgroundColor: "rgba(37,211,102,0.12)", borderColor: "rgba(37,211,102,0.3)" }]}>
              <Ionicons name="logo-whatsapp" size={rs(24)} color="#25D366" />
            </View>
            <Text style={styles.optLabel}>WhatsApp</Text>
          </TouchableOpacity>

          {/* Messenger */}
          <TouchableOpacity style={styles.option} activeOpacity={0.75} onPress={shareViaMessenger}>
            <View style={[styles.optIcon, { backgroundColor: "rgba(0,132,255,0.1)", borderColor: "rgba(0,132,255,0.3)" }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={rs(24)} color="#0084ff" />
            </View>
            <Text style={styles.optLabel}>Messenger</Text>
          </TouchableOpacity>

          {/* PDF */}
          <TouchableOpacity style={styles.option} activeOpacity={0.75} onPress={shareAsPdf}>
            <View style={[styles.optIcon, { backgroundColor: "rgba(248,113,113,0.1)", borderColor: "rgba(248,113,113,0.25)" }]}>
              <Ionicons name="document-text-outline" size={rs(24)} color="#f87171" />
            </View>
            <Text style={styles.optLabel}>PDF</Text>
          </TouchableOpacity>

          {/* Hafa */}
          <TouchableOpacity style={styles.option} activeOpacity={0.75} onPress={shareAsText}>
            <View style={[styles.optIcon, { backgroundColor: "rgba(250,204,21,0.1)", borderColor: "rgba(250,204,21,0.25)" }]}>
              <Ionicons name="share-social-outline" size={rs(24)} color="#facc15" />
            </View>
            <Text style={styles.optLabel}>Hafa</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.75}>
          <Text style={styles.cancelText}>Hanafoana</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,1,24,0.6)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#06033a",
    borderTopLeftRadius: rs(24),
    borderTopRightRadius: rs(24),
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingTop: rs(12),
    paddingBottom: rs(32),
    paddingHorizontal: rs(24),
    alignItems: "center",
    gap: rs(14),
  },
  handle: {
    width: rs(40),
    height: rs(4),
    borderRadius: rs(2),
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: rs(4),
  },
  sheetTitle: {
    fontSize: rf(18),
    fontWeight: "800",
    color: "#fff",
  },
  sheetSub: {
    fontSize: rf(13),
    color: "#b5c6d6",
    textAlign: "center",
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: rs(20),
    marginTop: rs(4),
    width: "100%",
  },
  option: {
    alignItems: "center",
    gap: rs(8),
    flex: 1,
  },
  optIcon: {
    width: rs(60),
    height: rs(60),
    borderRadius: rs(18),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  optLabel: {
    fontSize: rf(12),
    fontWeight: "600",
    color: "#b5c6d6",
  },
  cancelBtn: {
    marginTop: rs(4),
    width: "100%",
    height: rs(48),
    borderRadius: rs(14),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontSize: rf(15),
    fontWeight: "700",
    color: "#b5c6d6",
  },
});
