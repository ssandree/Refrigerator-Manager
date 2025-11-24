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
import { useMealStore } from "../../../stores/useMealStore";
import { Colors, FontSizes } from "../../../styles/common";
import DailyDietCard from "./MealCard";

interface MealCardListProps {
  dateISO?: string; // YYYY-MM-DD
}

export default function MealCardList({ dateISO }: MealCardListProps) {
  const meals = useMealStore((s) => s.meals);
  const removeMeal = useMealStore((s) => s.removeMeal);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const todayMeals = useMemo(
    () => meals.filter((m) => m.consumedAt === (dateISO || today)),
    [meals, today, dateISO]
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
