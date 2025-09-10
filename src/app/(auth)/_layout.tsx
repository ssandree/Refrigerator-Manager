import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: "로그인",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#D5ECB0",
          },
          headerTintColor: "#2D2D2D",
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: "회원가입",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#D5ECB0",
          },
          headerTintColor: "#2D2D2D",
        }} 
      />
    </Stack>
  );
}
