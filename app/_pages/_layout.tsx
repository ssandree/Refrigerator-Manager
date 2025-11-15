import { Stack } from "expo-router";

export default function PagesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: "modal" }}>
      <Stack.Screen name="LikeRecipe" />
      <Stack.Screen name="RecipeDetail" />
      <Stack.Screen name="RegisterFood" />
      <Stack.Screen name="RegisterMeal" />
      <Stack.Screen name="UpdateHealthGoal" />
      <Stack.Screen name="weeklyAchieve" />
    </Stack>
  );
}
