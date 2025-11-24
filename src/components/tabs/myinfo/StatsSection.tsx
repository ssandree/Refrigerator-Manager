import { ChevronRight } from "lucide-react-native";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFavoriteRecipeStore } from "../../../stores/useFavoriteRecipeStore";
import { useFridgeStore } from "../../../stores/useFoodStore";
import { useMealStore } from "../../../stores/useMealStore";
import { Colors, createShadowStyle } from "../../../styles/common";
import { tabsStyles } from "../../../styles/tabs";

const statsCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

interface StatsSectionProps {
  onWeeklyAchievePress?: () => void;
}

export default function StatsSection({
  onWeeklyAchievePress,
}: StatsSectionProps) {
  const foods = useFridgeStore((state) => state.foods);
  const favoriteRecipes = useFavoriteRecipeStore(
    (state) => state.favoriteRecipes
  );
  const meals = useMealStore((state) => state.meals);

  // 등록된 재료 개수
  const registeredFoodsCount = foods.length;

  // 즐겨찾기 레시피 개수
  const favoriteRecipesCount = favoriteRecipes.length;

  // 이번 주 식사 개수 계산
  const weeklyMealCount = useMemo(() => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    return meals.filter((meal) => {
      const mealDate = new Date(meal.consumedAt);
      return mealDate >= weekAgo && mealDate <= today;
    }).length;
  }, [meals]);

  return (
    <View style={tabsStyles.section}>
      <View style={styles.sectionHeader}>
        <Text style={tabsStyles.sectionTitle}>📊 나의 통계</Text>
        {onWeeklyAchievePress && (
          <TouchableOpacity
            style={styles.weeklyButton}
            onPress={onWeeklyAchievePress}
          >
            <Text style={styles.weeklyButtonText}>주간 달성</Text>
            <ChevronRight size={16} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{registeredFoodsCount}</Text>
          <Text style={styles.statLabel}>등록된 재료</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{favoriteRecipesCount}</Text>
          <Text style={styles.statLabel}>즐겨찾기 레시피</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{weeklyMealCount}</Text>
          <Text style={styles.statLabel}>이번 주 식사</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weeklyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  weeklyButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    ...statsCardShadow,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
