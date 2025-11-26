import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFridgeStore } from "../../../stores/useFoodStore";
import { Meal } from "../../../stores/useMealStore";
import { useRecipeStore } from "../../../stores/useRecipeStore";
import { tabsStyles } from "../../../styles/tabs";
import { Food } from "../../../types/food";
import { Recipe } from "../../../types/recipe";
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

  // 오늘 날짜 (YYYY-MM-DD 형식)
  const todayDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  const normalizeDate = useCallback((value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value.split("T")[0] ?? value;
    }
    return date.toISOString().split("T")[0];
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

  if (isLoading) {
    return (
      <View style={tabsStyles.section}>
        <Text style={tabsStyles.sectionTitle}>📦 오늘의 식사</Text>
        <LoadingSpinner message="불러오는 중..." size="small" />
      </View>
    );
  }

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

  const sumFoodCalories = (items: Food[]) =>
    items.reduce((sum, food) => {
      const grams =
        parseFloat(food.weight?.replace(/[^0-9.]/g, "") || "0") || 0;
      return sum + (food.calories_per_gram || 0) * grams;
    }, 0);

  const sumMacro = (items: Food[], key: "protein" | "carbohydrates" | "fat") =>
    items.reduce((sum, food) => sum + (food[key] || 0), 0);

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
      <View style={tabsStyles.section}>
        <Text style={tabsStyles.sectionTitle}>📦 오늘의 식사</Text>
        <Text style={tabsStyles.statText}>{error}</Text>
      </View>
    );
  }

  const hasAnyMeals = sections.some((sec) =>
    todaysMeals.some((m) => m.mealType === sec.key)
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
        const items = todaysMeals.filter((m) => m.mealType === sec.key);
        if (items.length === 0) return null;
        return (
          <View key={sec.key} style={styles.mealSection}>
            <Text style={styles.mealTitle}>{sec.title}</Text>
            {items.map((meal) => {
              const recipe = getRecipeForMeal(meal);
              const linkedFoods = getFoodsForMeal(meal);
              return (
                <DailyDietCard
                  key={meal.id}
                  recipeName={recipe?.recipeName || meal.notes || "자유식"}
                  calories={recipe?.calories ?? sumFoodCalories(linkedFoods)}
                  protein={recipe?.protein ?? sumMacro(linkedFoods, "protein")}
                  carbs={
                    recipe?.carbohydrates ??
                    sumMacro(linkedFoods, "carbohydrates")
                  }
                  fat={recipe?.fat ?? sumMacro(linkedFoods, "fat")}
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
