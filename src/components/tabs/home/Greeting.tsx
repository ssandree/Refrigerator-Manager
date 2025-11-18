import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../../stores/useAuthStore";
import { Colors, FontSizes } from "../../../styles/common";

export default function Greeting() {
  const user = useAuthStore((s) => s.user);
  const userName = user?.name || "사용자";

  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>
        {userName}님 오늘 어떤 것을 드셨나요?
      </Text>

      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => router.push("/_pages/RegisterMeal" as any)}
      >
        <Text style={styles.secondaryButtonText}>식사 등록</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  greetingText: {
    fontSize: FontSizes.lg,
    color: Colors.text,
    fontWeight: "700",
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  primaryButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.base,
    fontWeight: "700",
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: FontSizes.base,
    fontWeight: "600",
  },
});
