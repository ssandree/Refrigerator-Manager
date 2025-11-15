import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, createShadowStyle } from "../styles/common";

const floatingButtonShadow = createShadowStyle({
  offsetHeight: 4,
  opacity: 0.3,
  radius: 8,
  elevation: 6,
});

export default function FridgeRegisterQuick() {
  const handlePress = () => {
    router.push("../_pages/AddFood");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
        <Plus size={28} color={Colors.textLight} strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20, // 하단에서 20px 위에 위치
    right: 20,
    zIndex: 1000,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...floatingButtonShadow,
  },
});
