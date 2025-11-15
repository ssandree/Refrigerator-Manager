// React Query 전역 Provider로 서버 상태를 관리
import { default as apiClient } from "@/services/api";
import type { DefaultOptions } from "@tanstack/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ErrorBoundary from "../src/components/ErrorBoundary";
import { toastConfig } from "../src/components/ToastConfig";
import { getToken } from "../src/services/tokenStorage";
import { getErrorMessage } from "../src/utils/storeErrorHandler";
import { showApiErrorToast } from "../src/utils/toast";

type HttpError = {
  status?: number;
  message?: string;
  error?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

const isHttpError = (error: unknown): error is HttpError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as HttpError).status === "number"
  );
};

// 앱 전역에서 재사용할 QueryClient 인스턴스
const defaultQueryClientOptions: DefaultOptions = {
  queries: {
    retry: (failureCount, error: unknown) => {
      if (
        isHttpError(error) &&
        typeof error.status === "number" &&
        error.status >= 400 &&
        error.status < 500
      ) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "데이터를 불러오는 중 오류가 발생했습니다."
      );
      showApiErrorToast(errorMessage);
    },
  },
  mutations: {
    retry: false,
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(
        error,
        "작업을 수행하는 중 오류가 발생했습니다."
      );
      showApiErrorToast(errorMessage);
    },
  },
} as DefaultOptions;

const queryClient = new QueryClient({
  defaultOptions: defaultQueryClientOptions,
});

export default function RootLayout() {
  // 앱 시작 시 보안 저장소에서 토큰을 읽어 API 클라이언트에 세팅
  // persist 미들웨어가 자동으로 사용자 정보를 복원합니다
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          apiClient.setToken(token);
        }
      } catch (error) {
        console.error("앱 초기화 중 오류:", error);
      }
    })();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="(auth)"
              options={{
                presentation: "modal",
              }}
            />
            <Stack.Screen name="_pages" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="index" />
          </Stack>
          <Toast config={toastConfig} />
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
