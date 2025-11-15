import { authStyles } from "@/styles/auth";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { OutlinedButton, PrimaryButton } from "../../src/components/Buttons";
import { InputForm, LoginFormValues } from "../../src/components/InputForm";
import { useStoreError } from "../../src/hooks/useStoreError";
import { useAuthStore } from "../../src/stores/useAuthStore";
import { Colors } from "../../src/styles/colors";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const loginWithCredentials = useAuthStore((s) => s.loginWithCredentials);
  const isLoading = useAuthStore((s) => s.isLoading);
  const authStore = useAuthStore((s) => ({
    error: s.error,
    clearError: s.clearError,
  }));

  // Store 에러를 구독하고 토스트로 표시
  useStoreError(authStore);

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
      router.replace("/(tabs)/Home");
    }
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          authStyles.scrollContent,
          { paddingTop: insets.top + 20 },
        ]}
      >
        <View style={authStyles.logoContainer}>
          <Ionicons name="snow" size={60} color={Colors.primary} />
          <Text style={authStyles.logoText}>냉장고 매니징</Text>
          <Text style={authStyles.subtitle}>스마트한 냉장고 관리의 시작</Text>
        </View>

        <View style={authStyles.formContainer}>
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

          <TouchableOpacity style={authStyles.socialButton}>
            <Ionicons name="logo-google" size={20} color={Colors.error} />
            <Text style={authStyles.socialButtonText}>Google로 계속하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={authStyles.socialButton}>
            <Ionicons name="logo-apple" size={20} color={Colors.textPrimary} />
            <Text style={authStyles.socialButtonText}>Apple로 계속하기</Text>
          </TouchableOpacity>

          <View style={authStyles.footer}>
            <Text style={authStyles.footerText}>계정이 없으신가요? </Text>
            <TouchableOpacity onPress={() => router.push("../(auth)/Signin")}>
              <Text style={authStyles.linkText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
