import TodayHealthGoal from "@/components/tabs/home/TodayNutritionGoal";
import { tabsStyles } from "@/styles/tabs";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import QuickFoodAdd from "../../src/components/QuickFoodAdd";
import ExpiringIngredientSection from "../../src/components/tabs/home/ExpiringIngredientCard";
import Greeting from "../../src/components/tabs/home/Greeting";
import RecipeRecommand from "../../src/components/tabs/home/RecipeRecommand";
import { useAutoLoadData } from "../../src/hooks/useAutoLoadData";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useMealStore } from "../../src/stores/useMealStore";

export default function HomeScreen() {
  const meals = useMealStore((s) => s.meals);
  const loadMeals = useMealStore((s) => s.loadMeals);
  const isLoading = useMealStore((s) => s.isLoading);
  const lastSyncedAt = useMealStore((s) => s.lastSyncedAt);

  useStoreWithError(useMealStore);
  useAutoLoadData(meals, isLoading, loadMeals, {
    checkLastSynced: true,
    lastSyncedAt,
  });

  const mealsCount = meals.length;
  return (
    <View style={tabsStyles.container}>
      <ScrollView
        style={tabsStyles.content}
        contentContainerStyle={tabsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          ) : mealsCount === 0 ? (
            <Text style={tabsStyles.statText}>식사 항목이 없습니다</Text>
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
