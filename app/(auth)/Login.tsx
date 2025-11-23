import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { OutlinedButton, PrimaryButton } from "../../src/components/Buttons";
import { InputForm, LoginFormValues } from "../../src/components/InputForm";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useAuthStore } from "../../src/stores/useAuthStore";
import { applyOnboardingData } from "../../src/utils/applyOnboardingData";

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
      try {
        // 로그인 성공 후 온보딩 데이터 적용 (실패해도 홈으로 이동)
        const user = useAuthStore.getState().user;
        if (user?.id) {
          await applyOnboardingData(user.id).catch((error) => {
            console.error("온보딩 데이터 적용 실패:", error);
            // 온보딩 데이터 적용 실패해도 계속 진행
          });
        }
      } catch (error) {
        console.error("온보딩 데이터 적용 중 오류:", error);
        // 에러가 발생해도 홈으로 이동
      }

      // 홈 화면으로 이동
      // (auth)가 modal로 설정되어 있으므로 dismissAll 후 replace
      try {
        router.dismissAll();
        // dismissAll이 비동기일 수 있으므로 약간의 지연 후 이동
        setTimeout(() => {
          router.replace("/(tabs)/Home");
        }, 50);
      } catch (navError) {
        console.error("네비게이션 오류:", navError);
        // 네비게이션 실패 시 다른 방법 시도
        router.push("/(tabs)/Home");
      }
    } else {
      // 로그인 실패 시 에러 메시지는 useStoreWithError가 처리
      console.error("로그인 실패:", response.message);
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <InputForm
        control={control}
        errors={errors}
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword(!showPassword)}
      />
      <View style={{ marginTop: 12 }}>
        <OutlinedButton
          label="이전으로 돌아가기"
          onPress={() => router.push("/onboarding/GetHealthGoal")}
        />
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
