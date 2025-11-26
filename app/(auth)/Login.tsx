import { zodResolver } from "@hookform/resolvers/zod";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { BackHandler, View } from "react-native";
import { z } from "zod";
import { PrimaryButton } from "../../src/components/Buttons";
import { InputForm, LoginFormValues } from "../../src/components/InputForm";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useAuthStore } from "../../src/stores/useAuthStore";
import { logger } from "../../src/utils/logger";
import { needsOnboarding } from "../../src/utils/onboardingGuard";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = useAuthStore((s) => s.isLoading);
  const loginWithCredentials = useAuthStore((s) => s.loginWithCredentials);

  useStoreWithError(useAuthStore);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const response = await loginWithCredentials(data.email, data.password);
    if (response.success) {
      const authState = useAuthStore.getState();
      const shouldGoOnboarding = needsOnboarding(authState.user);
      // 로그인 성공 후 온보딩 시작
      // dismissAll()을 사용하지 않고 replace만 사용하여 스택 문제 방지
      try {
        router.replace(
          shouldGoOnboarding ? "/onboarding/GetSexAge" : "/(tabs)/Home"
        );
      } catch (navError) {
        logger.error("네비게이션 오류:", navError);
        // 에러 발생 시에도 replace 재시도
        setTimeout(() => {
          router.replace(
            shouldGoOnboarding ? "/onboarding/GetSexAge" : "/(tabs)/Home"
          );
        }, 100);
      }
    } else {
      // 로그인 실패 시 에러 메시지는 useStoreWithError가 처리
      logger.error("로그인 실패:", response.message);
    }
  };

  // 로그인 화면에서는 뒤로 가기 동작을 막는다 (돌아갈 화면이 없음)
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true
      );
      return () => subscription.remove();
    }, [])
  );

  return (
    <View style={{ width: "100%" }}>
      <InputForm
        control={control}
        errors={errors}
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
      />
      <View style={{ marginTop: 12 }}>
        <PrimaryButton
          label="로그인"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          style={{ marginBottom: 16 }}
        />
      </View>
    </View>
  );
}
