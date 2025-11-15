import TodayHealthGoal from "@/components/tabs/home/TodayNutritionGoal";
import { tabsStyles } from "@/styles/tabs";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import QuickFoodAdd from "../../src/components/QuickFoodAdd";
import ExpiringIngredientSection from "../../src/components/tabs/home/ExpiringIngredientCard";
import Greeting from "../../src/components/tabs/home/Greeting";
import RecipeRecommand from "../../src/components/tabs/home/RecipeRecommand";
import { useStoreError } from "../../src/hooks/useStoreError";
import { useMealStore } from "../../src/stores/useMealStore";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const meals = useMealStore((s) => s.meals);
  const loadMeals = useMealStore((s) => s.loadMeals);
  const isLoading = useMealStore((s) => s.isLoading);
  const mealStore = useMealStore((s) => ({
    error: s.error,
    clearError: s.clearError,
  }));

  useStoreError(mealStore);

  useEffect(() => {
    if (meals.length === 0 && !isLoading) {
      loadMeals(false);
    }
  }, [meals.length, isLoading, loadMeals]);

  const mealsCount = meals.length;
  return (
    <View style={tabsStyles.container}>
      <ScrollView
        style={tabsStyles.content}
        contentContainerStyle={[
          tabsStyles.scrollContent,
          { paddingTop: insets.top },
        ]}
      >
        {/* 인사 및 빠른 등록 버튼 */}
        <View style={tabsStyles.section}>
          <Greeting />
        </View>

        {/* 서버 데이터 예시: 사용자 식사 목록 카운트 */}
        <View style={tabsStyles.section}>
          <Text style={tabsStyles.sectionTitle}>📦 식사 목록</Text>
          {isLoading ? (
            <LoadingSpinner message="불러오는 중..." size="small" />
          ) : (
            <Text style={tabsStyles.statText}>식사 항목: {mealsCount}개</Text>
          )}
        </View>

        {/* 오늘의 레시피 추천 */}
        <RecipeRecommand />

        {/* 임박 재료 알림 */}
        <ExpiringIngredientSection />

        {/* 건강 목표 */}
        <TodayHealthGoal />
      </ScrollView>

      {/* 플로팅 버튼 */}
      <QuickFoodAdd />
    </View>
  );
}
