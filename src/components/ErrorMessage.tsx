import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../styles/common";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

/**
 * 공통 에러 메시지 컴포넌트
 * @param message - 에러 메시지
 * @param onRetry - 재시도 함수 (선택)
 * @param retryText - 재시도 버튼 텍스트 (기본값: "다시 시도")
 */
export default function ErrorMessage({
  message,
  onRetry,
  retryText = "다시 시도",
}: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: "600",
  },
});
