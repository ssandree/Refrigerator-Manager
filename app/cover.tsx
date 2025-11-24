import { getToken } from "@/services/tokenStorage";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../src/components/Buttons";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { useAuthStore } from "../src/stores/useAuthStore";
import { Colors } from "../src/styles/colors";
import { FontSizes } from "../src/styles/common";
import { logger } from "../src/utils/logger";
import { needsOnboarding } from "../src/utils/onboardingGuard";

export default function Cover() {
  const [isChecking, setIsChecking] = useState(false);

  const checkAuthAndRedirect = async () => {
    setIsChecking(true);
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
          const shouldGoOnboarding = needsOnboarding(currentAuth.user);
          router.replace(
            shouldGoOnboarding ? "/onboarding/GetSexAge" : "/(tabs)/Home"
          );
          return;
        }
      }

      // 토큰 없음 또는 인증되지 않음 → 로그인부터 시작
      router.replace("/(auth)/Login");
    } catch (error) {
      logger.error("Auth check error:", error);
      // 에러 발생 시 로그인으로 이동
      router.replace("/(auth)/Login");
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={styles.container}>
          <LoadingSpinner message="로딩 중..." fullScreen />
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>냉장고 매니징</Text>
          <Text style={styles.subtitle}>
            신선한 재료로 건강한 식단을 만들어보세요
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            label="시작하기"
            onPress={checkAuthAndRedirect}
            style={styles.button}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FontSizes["4xl"],
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 25,
  },
});
