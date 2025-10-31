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
import { z } from "zod";
import { useAuthStore } from "../../stores/useAuthStore";
import { Colors } from "../../styles/colors";
import { authStyles } from "./styles";

const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginForm) => {
    login({
      id: Date.now().toString(),
      name: data.email.split("@")[0] || "사용자",
      email: data.email,
    });
    router.replace("/(tabs)/Home");
  };

  return (
    <KeyboardAvoidingView
      style={authStyles.container as any}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={authStyles.scrollContent as any}>
        <View style={authStyles.logoContainer as any}>
          <Ionicons name="snow" size={60} color={Colors.primary} />
          <Text style={authStyles.logoText as any}>냉장고 매니징</Text>
          <Text style={authStyles.subtitle as any}>
            스마트한 냉장고 관리의 시작
          </Text>
        </View>

        <View style={authStyles.formContainer as any}>
          <View style={authStyles.inputContainer as any}>
            <Text style={authStyles.inputLabel as any}>이메일</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  style={authStyles.input as any}
                  placeholder="이메일을 입력하세요"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
            {errors.email?.message ? (
              <Text style={{ color: Colors.error, marginTop: 6 }}>
                {errors.email.message}
              </Text>
            ) : null}
          </View>

          <View style={authStyles.inputContainer as any}>
            <Text style={authStyles.inputLabel as any}>비밀번호</Text>
            <View style={authStyles.passwordContainer as any}>
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={authStyles.passwordInput as any}
                    placeholder="비밀번호를 입력하세요"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                style={authStyles.eyeButton as any}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password?.message ? (
              <Text style={{ color: Colors.error, marginTop: 6 }}>
                {errors.password.message}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={authStyles.loginButton as any}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={authStyles.loginButtonText as any}>로그인</Text>
          </TouchableOpacity>

          <View style={authStyles.divider as any}>
            <View style={authStyles.dividerLine as any} />
            <Text style={authStyles.dividerText as any}>또는</Text>
            <View style={authStyles.dividerLine as any} />
          </View>

          <TouchableOpacity style={authStyles.socialButton as any}>
            <Ionicons name="logo-google" size={20} color={Colors.error} />
            <Text style={authStyles.socialButtonText as any}>
              Google로 계속하기
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={authStyles.socialButton as any}>
            <Ionicons name="logo-apple" size={20} color={Colors.textPrimary} />
            <Text style={authStyles.socialButtonText as any}>
              Apple로 계속하기
            </Text>
          </TouchableOpacity>

          <View style={authStyles.footer as any}>
            <Text style={authStyles.footerText as any}>
              계정이 없으신가요?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("../(auth)/Signin")}>
              <Text style={authStyles.linkText as any}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
