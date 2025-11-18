import { authStyles } from "@/styles/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../styles/colors";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkPath?: string;
  showSocialButtons?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkPath,
  showSocialButtons = false,
}) => {
  const insets = useSafeAreaInsets();

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
          <Text style={authStyles.logoText}>{title}</Text>
          <Text style={authStyles.subtitle}>{subtitle}</Text>
        </View>

        {children}

        {showSocialButtons && (
          <>
            <TouchableOpacity style={authStyles.socialButton}>
              <Ionicons name="logo-google" size={20} color={Colors.error} />
              <Text style={authStyles.socialButtonText}>Google로 계속하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={authStyles.socialButton}>
              <Ionicons
                name="logo-apple"
                size={20}
                color={Colors.textPrimary}
              />
              <Text style={authStyles.socialButtonText}>Apple로 계속하기</Text>
            </TouchableOpacity>
          </>
        )}

        {footerText && footerLinkText && footerLinkPath && (
          <View style={authStyles.footer}>
            <Text style={authStyles.footerText}>{footerText} </Text>
            <TouchableOpacity onPress={() => router.push(footerLinkPath)}>
              <Text style={authStyles.linkText}>{footerLinkText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthLayout;
