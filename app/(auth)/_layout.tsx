import { authStyles } from "@/styles/auth";
import { router, Slot, usePathname } from "expo-router";
import React, { useMemo } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // 현재 라우트에 따라 제목과 서브타이틀 설정
  const authConfig = useMemo(() => {
    if (pathname?.includes("Signup")) {
      return {
        title: "냉장고 매니징",
        subtitle: "새로운 계정을 만들어보세요",
        footerText: "이미 계정이 있으신가요?",
        footerLinkText: "로그인",
        footerLinkPath: "/(auth)/Login",
      };
    }
    // Login (기본값)
    return {
      title: "냉장고 매니징",
      subtitle: "스마트한 냉장고 관리의 시작",
      footerText: "계정이 없으신가요?",
      footerLinkText: "회원가입",
      footerLinkPath: "/(auth)/Signup",
    };
  }, [pathname]);

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
          <Image
            source={require("../../assets/icon.png")}
            style={{ width: 110, height: 100 }}
            resizeMode="contain"
          />
          <Text style={authStyles.logoText}>{authConfig.title}</Text>
          <Text style={authStyles.subtitle}>{authConfig.subtitle}</Text>
        </View>

        <Slot />

        {authConfig.footerText &&
          authConfig.footerLinkText &&
          authConfig.footerLinkPath && (
            <View style={authStyles.footer}>
              <Text style={authStyles.footerText}>
                {authConfig.footerText}{" "}
              </Text>
              <TouchableOpacity
                onPress={() => router.push(authConfig.footerLinkPath!)}
              >
                <Text style={authStyles.linkText}>
                  {authConfig.footerLinkText}
                </Text>
              </TouchableOpacity>
            </View>
          )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
