import { router, Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, commonStyles, FontSizes } from "../styles/common";

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
      <View style={styles.container}>
        <Text style={styles.title}>냉장고 매니징</Text>
        <Text style={styles.subtitle}>신선한 재료로 건강한 식단을 만들어보세요</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleGoToOnboarding}>
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.centerContainer,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: FontSizes['4xl'],
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSizes.xl,
    fontWeight: "600",
  },
});
