import { rf, rs } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DropdownPicker({ value, onChange, max = 10 }: { value: number; onChange: (v: number) => void; max?: number }) {
  const [open, setOpen] = useState(false);
  const opts = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <View>
      <TouchableOpacity style={styles.btn} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <Text style={styles.val}>{value}</Text>
        <Ionicons name="chevron-down" size={rs(14)} color="#b5c6d6" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Misafidiana isa</Text>

          <FlatList
            data={opts}
            keyExtractor={n => String(n)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.opt, item === value && styles.optActive]}
                onPress={() => { onChange(item); setOpen(false); }}
              >
                <Text style={[styles.optText, item === value && styles.optTextActive]}>
                  {item}
                </Text>
                {item === value && <Ionicons name="checkmark-circle" size={rs(20)} color="#facc15" />}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row", alignItems: "center", gap: rs(8),
    backgroundColor: "#0f056b",
    borderWidth: 1, borderColor: "rgba(250,204,21,0.2)",
    borderRadius: rs(14),
    paddingHorizontal: rs(18), paddingVertical: rs(12),
    minWidth: rs(80), justifyContent: "center",
  },
  val: { fontSize: rf(22), fontWeight: "800", color: "#fff" },

  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)" },

  sheet: {
    backgroundColor: "#06033a",
    borderTopLeftRadius: rs(26), borderTopRightRadius: rs(26),
    padding: rs(20), paddingBottom: rs(40),
    maxHeight: "55%",
    borderTopWidth: 1, borderColor: "rgba(255,255,255,0.08)",
  },
  handle: {
    width: rs(36), height: rs(4), borderRadius: rs(2),
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center", marginBottom: rs(16),
  },
  sheetTitle: { fontSize: rf(16), fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: rs(12) },

  opt: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: rs(13), paddingHorizontal: rs(16),
    borderRadius: rs(12), marginBottom: rs(4),
  },
  optActive: { backgroundColor: "rgba(250,204,21,0.08)" },
  optText: { fontSize: rf(17), color: "#b5c6d6", fontWeight: "500" },
  optTextActive: { color: "#facc15", fontWeight: "700" },
});
