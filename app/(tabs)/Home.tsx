import { tabsStyles } from "@/styles/tabs";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import QuickFoodAdd from "../../src/components/QuickFoodAdd";
import ExpiringIngredientSection from "../../src/components/tabs/home/ExpiringIngredientCard";
import NutritionProgress from "../../src/components/tabs/home/NutritionProgress";
import RecipeRecommand from "../../src/components/tabs/home/RecipeRecommand";
import TodayMeals from "../../src/components/tabs/home/TodayMeals";
import TodayProgress from "../../src/components/tabs/home/TodayProgress";
import { useDashboardStore } from "../../src/stores/useDashboardStore";

export default function HomeScreen() {
  const loadToday = useDashboardStore((state) => state.loadToday);
  const todayData = useDashboardStore((state) => state.todayData);
  const isDashboardLoading = useDashboardStore((state) => state.isLoading);
  const dashboardError = useDashboardStore((state) => state.error);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  return (
    <View style={tabsStyles.container}>
      <ScrollView
        style={tabsStyles.content}
        contentContainerStyle={tabsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 오늘의 달성률 */}
        <View style={tabsStyles.section}>
          <TodayProgress />
        </View>

        {/* 오늘의 식사 목록 (Dashboard.todayMeals 사용) */}
        <TodayMeals
          meals={todayData?.todayMeals ?? []}
          isLoading={isDashboardLoading}
          error={dashboardError}
        />

        {/* 오늘의 레시피 추천 (Dashboard.recipeRecommendations 사용) */}
        <RecipeRecommand
          recipes={todayData?.recipeRecommendations ?? []}
          isLoading={isDashboardLoading}
          error={dashboardError}
        />

        {/* 임박 재료 알림 (Dashboard.expiringIngredients 사용) */}
        <ExpiringIngredientSection
          ingredients={todayData?.expiringIngredients ?? []}
        />

        {/* 영양소 달성률 */}
        <View style={tabsStyles.section}>
          <NutritionProgress />
        </View>
      </ScrollView>
      {/* 플로팅 버튼 */}
      <QuickFoodAdd />
    </View>
  );
}
