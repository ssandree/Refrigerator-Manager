import { Stack } from "expo-router";

export default function PagesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "modal" }}>
      <Stack.Screen name="LikeRecipe" />
      <Stack.Screen name="RecipeDetail" />
      <Stack.Screen name="RegisterFood" />
      <Stack.Screen name="RegisterMeal" />
      <Stack.Screen name="UpdateHealthGoal" />
      <Stack.Screen
        name="weeklyAchieve"
        options={{
          headerShown: true,
          title: "주간 목표 달성 현황",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        options={{
          headerShown: true,
          title: "설정",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Notifications"
        options={{
          headerShown: true,
          title: "알림",
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}
