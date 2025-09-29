import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { FavoriteRecipeProvider } from "../contexts/FavoriteRecipeContext";
import { HealthGoalProvider } from "../contexts/HealthGoalContext";

export default function RootLayout() {
  return (
    <HealthGoalProvider>
      <FavoriteRecipeProvider>
        <StatusBar style="dark" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              presentation: "modal" 
            }} 
          />
          <Stack.Screen 
            name="screens" 
          />
        </Stack>
      </FavoriteRecipeProvider>
    </HealthGoalProvider>
  );
}