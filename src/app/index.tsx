import { router, Stack } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { indexStyles } from "./styles";

export default function Index() {
  const handleGoToOnboarding = () => {
    router.push("./onboarding/GetSexAge");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={indexStyles.container}>
        <Text style={indexStyles.title}>냉장고 매니징</Text>
        <Text style={indexStyles.subtitle}>
          신선한 재료로 건강한 식단을 만들어보세요
        </Text>

        <TouchableOpacity
          style={indexStyles.button}
          onPress={handleGoToOnboarding}
        >
          <Text style={indexStyles.buttonText}>시작하기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
