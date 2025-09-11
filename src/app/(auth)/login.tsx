import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Colors } from "../../constants/Colors";
import { authStyles } from "./styles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }
    
    // 로그인 로직 구현
    Alert.alert("로그인", "로그인 기능은 추후 구현됩니다.");
  };

  return (
    <KeyboardAvoidingView 
      style={authStyles.container as any}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={authStyles.scrollContent as any}>
        <View style={authStyles.logoContainer as any}>
          <Ionicons name="snow" size={60} color={Colors.primary[500]} />
          <Text style={authStyles.logoText as any}>냉장고 매니징</Text>
          <Text style={authStyles.subtitle as any}>스마트한 냉장고 관리의 시작</Text>
        </View>

        <View style={authStyles.formContainer as any}>
          <View style={authStyles.inputContainer as any}>
            <Text style={authStyles.inputLabel as any}>이메일</Text>
            <TextInput
              style={authStyles.input as any}
              placeholder="이메일을 입력하세요"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={authStyles.inputContainer as any}>
            <Text style={authStyles.inputLabel as any}>비밀번호</Text>
            <View style={authStyles.passwordContainer as any}>
              <TextInput
                style={authStyles.passwordInput as any}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
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
          </View>

          <TouchableOpacity style={authStyles.loginButton as any} onPress={handleLogin}>
            <Text style={authStyles.loginButtonText as any}>로그인</Text>
          </TouchableOpacity>

          <View style={authStyles.divider as any}>
            <View style={authStyles.dividerLine as any} />
            <Text style={authStyles.dividerText as any}>또는</Text>
            <View style={authStyles.dividerLine as any} />
          </View>

          <TouchableOpacity style={authStyles.socialButton as any}>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={authStyles.socialButtonText as any}>Google로 계속하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={authStyles.socialButton as any}>
            <Ionicons name="logo-apple" size={20} color="#000" />
            <Text style={authStyles.socialButtonText as any}>Apple로 계속하기</Text>
          </TouchableOpacity>

          <View style={authStyles.footer as any}>
            <Text style={authStyles.footerText as any}>계정이 없으신가요? </Text>
            <TouchableOpacity>
              <Text style={authStyles.linkText as any}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

