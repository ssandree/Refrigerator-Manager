import { authStyles } from "@/styles/auth";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { PrimaryButton } from "../../src/components/Buttons";
import { InputForm } from "../../src/components/InputForm";
import { useStoreError } from "../../src/hooks/useStoreError";
import { useAuthStore } from "../../src/stores/useAuthStore";
import { Colors } from "../../src/styles/colors";

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
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const register = useAuthStore((s) => s.register);
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
          <Text style={authStyles.subtitle}>새로운 계정을 만들어보세요</Text>
        </View>

        {/* 이름 */}
        <View style={authStyles.formContainer}>
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>이름</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  style={authStyles.input}
                  placeholder="이름을 입력하세요"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              )}
            />
            {errors.name?.message ? (
              <Text style={{ color: Colors.error, marginTop: 6 }}>
                {errors.name.message}
              </Text>
            ) : null}
          </View>
        </View>

        {/* 이메일/비밀번호는 InputForm 재사용 */}
        <InputForm
          control={control}
          errors={errors}
          showPassword={showPassword}
          onToggleShowPassword={() => setShowPassword(!showPassword)}
        />

        {/* 비밀번호 확인 */}
        <View style={authStyles.inputContainer}>
          <Text style={authStyles.inputLabel}>비밀번호 확인</Text>
          <View style={authStyles.passwordContainer}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  style={authStyles.passwordInput}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
            <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword?.message ? (
            <Text style={{ color: Colors.error, marginTop: 6 }}>
              {errors.confirmPassword.message}
            </Text>
          ) : null}
        </View>

        <View style={{ marginTop: 12 }}>
          <PrimaryButton
            label="회원가입"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          />
        </View>

        <View style={authStyles.footer}>
          <Text style={authStyles.footerText}>이미 계정이 있으신가요? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
            <Text style={authStyles.linkText}>로그인</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
