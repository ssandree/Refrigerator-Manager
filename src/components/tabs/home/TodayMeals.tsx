import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { mealService } from "../../../services/mealService";
import { Meal } from "../../../stores/useMealStore";
import { tabsStyles } from "../../../styles/tabs";
import { logger } from "../../../utils/logger";
import LoadingSpinner from "../../LoadingSpinner";
import DailyDietCard from "../meal/MealCard";

export default function TodayMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 오늘 날짜 (YYYY-MM-DD 형식)
  const todayDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  const loadTodayMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mealService.getMealsByDate(todayDate);
      if (response.success && response.data) {
        setMeals(response.data);
      } else {
        setError(response.message || "식사 목록을 불러오는데 실패했습니다.");
      }
    } catch (err) {
      setError("식사 목록을 불러오는 중 오류가 발생했습니다.");
      logger.error("Failed to load today's meals:", err);
    } finally {
      setIsLoading(false);
    }
  }, [todayDate]);

  useEffect(() => {
    loadTodayMeals();
  }, [loadTodayMeals]);

  useFocusEffect(
    useCallback(() => {
      loadTodayMeals();
    }, [loadTodayMeals])
  );

  const sections = useMemo(
    () =>
      [
        { key: "breakfast", title: "🌅 아침" },
        { key: "lunch", title: "☀️ 점심" },
        { key: "dinner", title: "🌙 저녁" },
        { key: "snack", title: "🍎 간식" },
      ] as const,
    []
  );

  if (isLoading) {
    return (
      <View style={tabsStyles.section}>
        <Text style={tabsStyles.sectionTitle}>📦 오늘의 식사</Text>
        <LoadingSpinner message="불러오는 중..." size="small" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tabsStyles.section}>
        <Text style={tabsStyles.sectionTitle}>📦 오늘의 식사</Text>
        <Text style={tabsStyles.statText}>{error}</Text>
      </View>
    );
  }

  const hasAnyMeals = sections.some((sec) =>
    meals.some((m) => m.mealType === sec.key)
  );

  if (!hasAnyMeals) {
    return (
      <View style={tabsStyles.section}>
        <Text style={tabsStyles.sectionTitle}>📦 오늘의 식사</Text>
        <Text style={tabsStyles.statText}>오늘 등록된 식사가 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={tabsStyles.section}>
      <Text style={tabsStyles.sectionTitle}>📦 오늘의 식사</Text>
      {sections.map((sec) => {
        const items = meals.filter((m) => m.mealType === sec.key);
        if (items.length === 0) return null;
        return (
          <View key={sec.key} style={styles.mealSection}>
            <Text style={styles.mealTitle}>{sec.title}</Text>
            {items.map((meal) => (
              <DailyDietCard
                key={meal.id}
                recipeName={meal.recipe?.recipeName || meal.notes || "자유식"}
                calories={
                  meal.recipe?.calories ||
                  meal.foods.reduce(
                    (sum, food) =>
                      sum +
                      (food.calories_per_gram || 0) *
                        (parseFloat(
                          food.weight?.replace(/[^0-9.]/g, "") || "0"
                        ) || 0),
                    0
                  ) ||
                  0
                }
                protein={
                  meal.recipe?.protein ||
                  meal.foods.reduce(
                    (sum, food) => sum + (food.protein || 0),
                    0
                  ) ||
                  0
                }
                carbs={
                  meal.recipe?.carbohydrates ||
                  meal.foods.reduce(
                    (sum, food) => sum + (food.carbohydrates || 0),
                    0
                  ) ||
                  0
                }
                fat={
                  meal.recipe?.fat ||
                  meal.foods.reduce((sum, food) => sum + (food.fat || 0), 0) ||
                  0
                }
                time={meal.consumedAt}
              />
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  mealSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 8,
  },
});
