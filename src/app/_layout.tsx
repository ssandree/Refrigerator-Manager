import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            headerShown: false,
            presentation: "modal" 
          }} 
        />
        <Stack.Screen 
          name="screens" 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack>
    </>
  );
}