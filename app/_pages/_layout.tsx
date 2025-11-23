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
          headerBackTitle: "뒤로",
        }}
      />
      <Stack.Screen name="Settings" />
      <Stack.Screen
        name="Notifications"
        options={{
          headerShown: true,
          title: "알림",
          headerBackTitle: "뒤로",
        }}
      />
    </Stack>
  );
}
