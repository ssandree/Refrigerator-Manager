import { getToken } from "@/services/tokenStorage";
import { indexStyles } from "@/styles/app";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { useAuthStore } from "../src/stores/useAuthStore";

export default function Index() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // 1. 토큰 확인
        const token = await getToken();

        if (token) {
          // 2. persist 미들웨어가 자동으로 사용자 정보를 복원하므로,
          //    약간의 지연을 두어 복원이 완료될 시간을 줌
          await new Promise((resolve) => setTimeout(resolve, 300));

          // 3. 인증 상태와 사용자 정보가 있으면 바로 Home으로 이동
          const currentAuth = useAuthStore.getState();
          if (currentAuth.isAuthenticated && currentAuth.user) {
            router.replace("/(tabs)/Home");
            return;
          }
        }

        // 토큰 없음 또는 인증되지 않음 → 온보딩 시작
        router.replace("./onboarding/GetSexAge");
      } catch (error) {
        console.error("Auth check error:", error);
        // 에러 발생 시 온보딩으로 이동
        router.replace("./onboarding/GetSexAge");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, []); // 마운트 시 한 번만 실행

  // 로딩 중일 때 스플래시 화면 표시
  if (isChecking) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={indexStyles.container}>
          <LoadingSpinner message="로딩 중..." fullScreen />
        </View>
      </>
    );
  }

  // 이 코드는 실행되지 않을 가능성이 높지만, 안전을 위해 유지
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={indexStyles.container}>
        <Text style={indexStyles.title}>냉장고 매니징</Text>
        <Text style={indexStyles.subtitle}>
          신선한 재료로 건강한 식단을 만들어보세요
        </Text>
      </View>
    </>
  );
}
