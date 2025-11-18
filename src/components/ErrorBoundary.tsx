// 전역 에러 바운더리 컴포넌트
import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, FontSizes, commonStyles } from "../styles/common";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⚠️ 오류가 발생했습니다</Text>
        <Text style={styles.message}>
          {error.message || "알 수 없는 오류가 발생했습니다."}
        </Text>
        <TouchableOpacity style={styles.button} onPress={resetErrorBoundary}>
          <Text style={styles.buttonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export default function ErrorBoundary({
  children,
  fallback = ErrorFallback,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback}
      onError={(error: Error, info: { componentStack: string }) => {
        // 에러 로깅 (나중에 에러 추적 서비스에 연결 가능)
        console.error("ErrorBoundary caught an error:", error, info);
        // Toast는 ErrorBoundary 내부에 있어서 순환 참조를 피하기 위해 제거
        // 에러는 ErrorFallback 컴포넌트에서 표시됨
      }}
      onReset={() => {
        // 에러 리셋 시 필요한 작업 수행
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
  },
  title: {
    fontSize: FontSizes["2xl"],
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    ...commonStyles.button,
    minWidth: 120,
  },
  buttonText: {
    ...commonStyles.buttonText,
  },
});
