import TodayHealthGoal from "@/components/tabs/home/TodayNutritionGoal";
import { tabsStyles } from "@/styles/tabs";
import React from "react";
import { ScrollView, View } from "react-native";
import QuickFoodAdd from "../../src/components/QuickFoodAdd";
import ExpiringIngredientSection from "../../src/components/tabs/home/ExpiringIngredientCard";
import Greeting from "../../src/components/tabs/home/Greeting";
import RecipeRecommand from "../../src/components/tabs/home/RecipeRecommand";
import TodayMeals from "../../src/components/tabs/home/TodayMeals";

export default function HomeScreen() {
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

        {/* 오늘의 식사 목록 */}
        <TodayMeals />

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
