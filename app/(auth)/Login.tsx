import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { AuthLayout } from "../../src/components/AuthLayout";
import { OutlinedButton, PrimaryButton } from "../../src/components/Buttons";
import { InputForm, LoginFormValues } from "../../src/components/InputForm";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useAuthStore } from "../../src/stores/useAuthStore";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = useAuthStore((s) => s.isLoading);
  // TODO: API 연결 후 사용
  // const loginWithCredentials = useAuthStore((s) => s.loginWithCredentials);

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
    // API 연결 전: 입력값과 관계없이 Home으로 이동
    // 스택을 모두 닫고 Home으로 이동
    router.dismissAll();
    router.replace("/(tabs)/Home");

    // TODO: API 연결 후 아래 코드 활성화
    // const response = await loginWithCredentials(data.email, data.password);
    // if (response.success) {
    //   router.replace("/(tabs)/Home");
    // }
  };

  return (
    <AuthLayout
      title="냉장고 매니징"
      subtitle="스마트한 냉장고 관리의 시작"
      footerText="계정이 없으신가요?"
      footerLinkText="회원가입"
      footerLinkPath="/(auth)/Signup"
      showSocialButtons={true}
    >
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
    </AuthLayout>
  );
}
