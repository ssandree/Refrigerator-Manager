import { Redirect, Stack, useRootNavigationState } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function Index() {
  const navigationState = useRootNavigationState();

  // Router가 준비되지 않았으면 아무것도 렌더링하지 않음
  if (!navigationState?.key) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={{ flex: 1 }} />
      </>
    );
  }

  // Router가 준비되면 cover로 리다이렉트
  return <Redirect href="./cover" />;
}
