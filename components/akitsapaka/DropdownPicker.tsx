import React, { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function DropdownPicker({
  value,
  onChange,
  max = 10,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  const [visible, setVisible] = useState(false);

  const options = [...Array(max)].map((_, i) => i + 1);

  return (
    <View style={styles.wrapper}>
      {/* BOUTON */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.buttonText}>{value}</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        />

        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Misafidiana isa</Text>

          <FlatList
            data={options}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onChange(item);
                  setVisible(false);
                }}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    width: "100%",
  },

  button: {
    width: 140,
    height: 55,
    borderRadius: 14,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },

  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "55%",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },

  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },

  optionText: {
    fontSize: 20,
    color: "#333",
  },
});
