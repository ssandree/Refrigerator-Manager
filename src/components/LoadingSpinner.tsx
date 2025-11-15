import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../styles/common";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
}

/**
 * 공통 로딩 스피너 컴포넌트
 * @param message - 로딩 메시지 (선택)
 * @param size - 스피너 크기 (기본값: "large")
 * @param color - 스피너 색상 (기본값: Colors.primary)
 * @param fullScreen - 전체 화면 로딩 여부 (기본값: false)
 */
export default function LoadingSpinner({
  message,
  size = "large",
  color = Colors.primary,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerStyle = fullScreen
    ? [styles.container, styles.fullScreen]
    : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
