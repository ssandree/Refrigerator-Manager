import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";
import { AuthLayout } from "../../src/components/AuthLayout";
import { PrimaryButton } from "../../src/components/Buttons";
import { InputForm } from "../../src/components/InputForm";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useAuthStore } from "../../src/stores/useAuthStore";

const signupSchema = z
  .object({
    name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
    email: z.string().email("올바른 이메일을 입력하세요"),
    password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SigninScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  useStoreWithError(useAuthStore);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignupForm) => {
    const response = await register({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (response.success) {
      router.replace("/(auth)/Login");
    }
  };

  return (
    <AuthLayout
      title="냉장고 매니징"
      subtitle="새로운 계정을 만들어보세요"
      footerText="이미 계정이 있으신가요?"
      footerLinkText="로그인"
      footerLinkPath="/(auth)/Login"
    >
      <View style={{ width: "100%" }}>
        <InputForm
          control={control}
          errors={errors}
          showPassword={showPassword}
          onToggleShowPassword={() => setShowPassword(!showPassword)}
          showConfirmPassword={showConfirmPassword}
          onToggleShowConfirmPassword={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
          showNameField={true}
        />
        <View style={{ marginTop: 12 }}>
          <PrimaryButton
            label="회원가입"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
        </View>
      </View>
    </AuthLayout>
  );
}
