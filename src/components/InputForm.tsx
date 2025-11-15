import { authStyles } from "@/styles/auth";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../styles/colors";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface InputFormProps {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  showPassword: boolean;
  onToggleShowPassword: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  control,
  errors,
  showPassword,
  onToggleShowPassword,
}) => {
  return (
    <View style={authStyles.formContainer}>
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
            {/* 아이콘은 부모에서 그리지 않고 스타일만 재사용 */}
          </TouchableOpacity>
        </View>
        {errors.password?.message ? (
          <Text style={{ color: Colors.error, marginTop: 6 }}>
            {errors.password.message}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default InputForm;
