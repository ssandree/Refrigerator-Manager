// React Query 전역 Provider로 서버 상태를 관리
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
// 보안 저장소에서 토큰을 로드/저장
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import api from "./services/api";

// 앱 전역에서 재사용할 QueryClient 인스턴스
const queryClient = new QueryClient();

export default function RootLayout() {
  // 앱 시작 시 보안 저장소에서 토큰을 읽어 API 클라이언트에 세팅
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        if (token) {
          api.setToken(token);
        }
      } catch {}
    })();
  }, []);

  return (
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
    </QueryClientProvider>
  );
}
