import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFridgeStore } from "../../../stores/useFoodStore";
import { useMealStore } from "../../../stores/useMealStore";
import { useRecipeStore } from "../../../stores/useRecipeStore";
import { Colors, FontSizes } from "../../../styles/common";
import { Food } from "../../../types/food";
import DailyDietCard from "./MealCard";

interface MealCardListProps {
  dateISO?: string; // YYYY-MM-DD
}

export default function MealCardList({ dateISO }: MealCardListProps) {
  const meals = useMealStore((s) => s.meals);
  const removeMeal = useMealStore((s) => s.removeMeal);
  const foods = useFridgeStore((s) => s.foods);
  const recipes = useRecipeStore((s) => s.recipes);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const normalizeDate = useMemo(
    () => (value: string) => {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) {
        return value.split("T")[0] ?? value;
      }
      return parsed.toISOString().split("T")[0];
    },
    []
  );
  const targetDate = dateISO || today;
  const todayMeals = useMemo(
    () => meals.filter((m) => normalizeDate(m.consumedAt) === targetDate),
    [meals, normalizeDate, targetDate]
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

  const openEditScreen = (mealId: string) => {
    router.push({
      pathname: "/_pages/RegisterMeal",
      params: { mealId },
    });
  };

  const confirmDeleteMeal = (mealId: string) => {
    Alert.alert("식사 삭제", "정말로 이 식사를 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await removeMeal(mealId);
        },
      },
    ]);
  };

  const handleLongPress = (mealId: string) => {
    setSelectedMealId(mealId);
    setActionModalVisible(true);
  };

  const handleEdit = () => {
    if (selectedMealId) {
      setActionModalVisible(false);
      openEditScreen(selectedMealId);
    }
  };

  const handleDelete = () => {
    if (!selectedMealId) return;
    setActionModalVisible(false);
    confirmDeleteMeal(selectedMealId);
  };

  const getRecipeForMeal = (mealId: string | null | undefined) => {
    if (!mealId) {
      return undefined;
    }
    return recipes.find((recipe) => recipe.id === mealId);
  };

  const getFoodsForMeal = (meal: { foodIds: string[] }): Food[] =>
    meal.foodIds
      .map((id) => foods.find((food) => food.id === id))
      .filter((food): food is Food => Boolean(food));

  const sumFoodCalories = (items: Food[]) =>
    items.reduce((sum, food) => {
      const grams =
        parseFloat(food.weight?.replace(/[^0-9.]/g, "") || "0") || 0;
      return sum + (food.calories_per_gram || 0) * grams;
    }, 0);

  const sumMacro = (items: Food[], key: "protein" | "carbohydrates" | "fat") =>
    items.reduce((sum, food) => sum + (food[key] || 0), 0);

  const formatTime = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {sections.map((sec) => {
        const items = todayMeals.filter((m) => m.mealType === sec.key);
        if (items.length === 0) return null;
        return (
          <View key={sec.key} style={styles.mealSection}>
            <Text style={styles.mealTitle}>{sec.title}</Text>
            {items.map((meal) => (
              <DailyDietCard
                key={meal.id}
                recipeName={
                  getRecipeForMeal(meal.recipeId)?.recipeName ||
                  meal.notes ||
                  "자유식"
                }
                calories={
                  getRecipeForMeal(meal.recipeId)?.calories ||
                  sumFoodCalories(getFoodsForMeal(meal))
                }
                protein={
                  getRecipeForMeal(meal.recipeId)?.protein ||
                  sumMacro(getFoodsForMeal(meal), "protein")
                }
                carbs={
                  getRecipeForMeal(meal.recipeId)?.carbohydrates ||
                  sumMacro(getFoodsForMeal(meal), "carbohydrates")
                }
                fat={
                  getRecipeForMeal(meal.recipeId)?.fat ||
                  sumMacro(getFoodsForMeal(meal), "fat")
                }
                time={formatTime(meal.consumedAt)}
                onLongPress={() => handleLongPress(meal.id)}
                onEdit={() => openEditScreen(meal.id)}
                onDelete={() => confirmDeleteMeal(meal.id)}
              />
            ))}
          </View>
        );
      })}

      {/* 액션 모달 */}
      <Modal
        visible={actionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActionModalVisible(false)}
        >
          <View style={styles.actionModal}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <Text style={styles.actionButtonText}>수정</Text>
            </TouchableOpacity>
            <View style={styles.actionDivider} />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDelete}
            >
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                삭제
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  mealSection: {
    marginBottom: 24,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionModal: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  deleteButtonText: {
    color: Colors.error,
  },
  actionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
});
