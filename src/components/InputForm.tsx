import { authStyles } from "@/styles/auth";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../styles/colors";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues extends LoginFormValues {
  name?: string;
  confirmPassword?: string;
}

interface InputFormProps {
  control: Control<LoginFormValues | SignupFormValues>;
  errors: FieldErrors<LoginFormValues | SignupFormValues>;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  showConfirmPassword?: boolean;
  onToggleShowConfirmPassword?: () => void;
  showNameField?: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  control,
  errors,
  showPassword,
  onToggleShowPassword,
  showConfirmPassword = false,
  onToggleShowConfirmPassword,
  showNameField = false,
}) => {
  // 비밀번호 확인 필드의 텍스트 표시/숨김을 내부에서 관리
  const [showConfirmPasswordText, setShowConfirmPasswordText] = useState(false);

  return (
    <View style={authStyles.formContainer}>
      {/* 이름 필드 (회원가입 시에만 표시) */}
      {showNameField && (
        <View style={authStyles.inputContainer}>
          <Text style={[authStyles.inputLabel, { textAlign: "left" }]}>
            이름
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={authStyles.input}
                placeholder="이름을 입력하세요"
                value={value || ""}
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
      )}

      {/* 이메일 필드 */}
      <View style={authStyles.inputContainer}>
        <Text style={[authStyles.inputLabel, { textAlign: "left" }]}>
          이메일
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={authStyles.input}
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

      {/* 비밀번호 필드 */}
      <View style={authStyles.inputContainer}>
        <Text style={[authStyles.inputLabel, { textAlign: "left" }]}>
          비밀번호
        </Text>
        <View style={authStyles.passwordContainer}>
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                style={authStyles.passwordInput}
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
            style={authStyles.eyeButton}
            onPress={onToggleShowPassword}
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

      {/* 비밀번호 확인 필드 (회원가입 시에만 표시) */}
      {showConfirmPassword && (
        <View style={authStyles.inputContainer}>
          <Text style={[authStyles.inputLabel, { textAlign: "left" }]}>
            비밀번호 확인
          </Text>
          <View style={authStyles.passwordContainer}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  style={authStyles.passwordInput}
                  placeholder="비밀번호를 다시 입력하세요"
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showConfirmPasswordText}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              )}
            />
            <TouchableOpacity
              style={authStyles.eyeButton}
              onPress={() => {
                setShowConfirmPasswordText(!showConfirmPasswordText);
                onToggleShowConfirmPassword?.();
              }}
            >
              <Ionicons
                name={
                  showConfirmPasswordText ? "eye-off-outline" : "eye-outline"
                }
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
      )}
    </View>
  );
};

export default InputForm;
