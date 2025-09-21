import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../styles/common";

export default function FridgeRegisterQuick() {
  const handlePress = () => {
    router.push("../screens/AddFood");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.floatingButton} onPress={handlePress}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 75, // 하단에서 20px 위에 위치
    right: 20,
    zIndex: 1000,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
