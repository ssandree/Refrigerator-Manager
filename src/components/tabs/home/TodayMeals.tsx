import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDateStore } from "../../../stores/useDateStore";
import { useFridgeStore } from "../../../stores/useFoodStore";
import { Meal } from "../../../stores/useMealStore";
import { useRecipeStore } from "../../../stores/useRecipeStore";
import { Colors, FontSizes } from "../../../styles/common";
import { tabsStyles } from "../../../styles/tabs";
import { Food } from "../../../types/food";
import { Recipe } from "../../../types/recipe";
import { toKoreaDateISO } from "../../../utils/dateUtils";
import LoadingSpinner from "../../LoadingSpinner";
import DailyDietCard from "../meal/MealCard";

interface TodayMealsProps {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
}

export default function TodayMeals({
  meals,
  isLoading,
  error,
}: TodayMealsProps) {
  const foods = useFridgeStore((s) => s.foods);
  const recipes = useRecipeStore((s) => s.recipes);

  // 한국 시간 기준 오늘 날짜를 전역 스토어에서 가져옴
  const todayDate = useDateStore((s) => s.todayISO);

  const normalizeDate = useCallback((value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value.split("T")[0] ?? value;
    }
    return toKoreaDateISO(date);
  }, []);

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

  const todaysMeals = useMemo(
    () => meals.filter((meal) => normalizeDate(meal.consumedAt) === todayDate),
    [meals, normalizeDate, todayDate]
  );

  // 모든 hooks는 early return 전에 호출되어야 함
  const getRecipeForMeal = useCallback(
    (meal: Meal): Recipe | undefined => {
      if (!meal.recipeId) return undefined;
      return recipes.find((recipe) => recipe.id === meal.recipeId);
    },
    [recipes]
  );

  const getFoodsForMeal = useCallback(
    (meal: Meal): Food[] => {
      return meal.foodIds
        .map((foodId) => foods.find((food) => food.id === foodId))
        .filter((food): food is Food => Boolean(food));
    },
    [foods]
  );

  const handleRegisterMeal = useCallback(() => {
    router.push({
      pathname: "/_pages/RegisterMeal",
    } as { pathname: string });
  }, []);

  if (isLoading) {
    return (
      <View style={[tabsStyles.section, { marginBottom: 24 }]}>
        <View style={styles.headerRow}>
          <Text style={tabsStyles.sectionTitle}>📦 오늘의 식사</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegisterMeal}
          >
            <Text style={styles.registerButtonText}>식사 등록</Text>
          </TouchableOpacity>
        </View>
        <LoadingSpinner message="불러오는 중..." size="small" />
      </View>
    );
  }

  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (error) {
    return (
      <View style={[tabsStyles.section, { marginBottom: 24 }]}>
        <View style={styles.headerRow}>
          <Text style={tabsStyles.sectionTitle}>📦 오늘의 식사</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegisterMeal}
          >
            <Text style={styles.registerButtonText}>식사 등록</Text>
          </TouchableOpacity>
        </View>
        <Text style={tabsStyles.statText}>{error}</Text>
      </View>
    );
  }

  const hasAnyMeals = sections.some((sec) =>
    todaysMeals.some((m) => m.mealType === sec.key)
  );

  if (!hasAnyMeals) {
    return (
      <View style={[tabsStyles.section, { marginBottom: 24 }]}>
        <View style={styles.headerRow}>
          <Text style={tabsStyles.sectionTitle}>📦 오늘의 식사</Text>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegisterMeal}
          >
            <Text style={styles.registerButtonText}>식사 등록</Text>
          </TouchableOpacity>
        </View>
        <Text style={tabsStyles.statText}>오늘 등록된 식사가 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={[tabsStyles.section, { marginBottom: 24 }]}>
      <View style={styles.headerRow}>
        <Text style={tabsStyles.sectionTitle}>📦 오늘의 식사</Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegisterMeal}
        >
          <Text style={styles.registerButtonText}>식사 등록</Text>
        </TouchableOpacity>
      </View>
      {sections.map((sec) => {
        const items = todaysMeals.filter((m) => m.mealType === sec.key);
        if (items.length === 0) return null;
        return (
          <View key={sec.key} style={styles.mealSection}>
            <Text style={styles.mealTitle}>{sec.title}</Text>
            {items.map((meal) => {
              const recipe = getRecipeForMeal(meal);
              return (
                <DailyDietCard
                  key={meal.id}
                  recipeName={recipe?.recipeName || meal.notes || "자유식"}
                  calories={recipe?.calories ?? 0}
                  protein={recipe?.protein ?? 0}
                  carbs={recipe?.carbohydrates ?? 0}
                  fat={recipe?.fat ?? 0}
                  time={formatTime(meal.consumedAt)}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  registerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  registerButtonText: {
    fontSize: FontSizes.base,
    color: Colors.text,
    fontWeight: "600",
  },
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
