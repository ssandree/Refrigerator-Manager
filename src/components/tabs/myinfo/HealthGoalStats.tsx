import { tabsStyles } from "@/styles/tabs";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { useHealthGoalStore } from "../../../stores/useHealthGoalStore";
import { useMealStore } from "../../../stores/useMealStore";
import { useNutritionStore } from "../../../stores/useNutritionStore";
import { Colors, createShadowStyle } from "../../../styles/common";

const statsCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

export default function HealthGoalStats() {
  const totals = useNutritionStore((s) => s.totals);
  const targets = useNutritionStore((s) => s.targets);
  const selectedGoals = useHealthGoalStore((s) => s.selectedGoals);
  const meals = useMealStore((s) => s.meals);

  // 이번 주 식사 횟수 계산
  const weeklyMealCount = useMemo(() => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    return meals.filter((meal) => {
      const mealDate = new Date(meal.consumedAt);
      return mealDate >= weekAgo && mealDate <= today;
    }).length;
  }, [meals]);

  // 영양소 달성률 계산
  const nutritionProgress = useMemo(() => {
    const items = [
      {
        key: "calories",
        label: "칼로리",
        unit: "kcal",
        icon: "flame" as const,
      },
      { key: "protein", label: "단백질", unit: "g", icon: "fitness" as const },
      {
        key: "carbs",
        label: "탄수화물",
        unit: "g",
        icon: "restaurant" as const,
      },
      { key: "fat", label: "지방", unit: "g", icon: "water" as const },
    ];

    return items.map((item) => {
      const current = totals[item.key as keyof typeof totals] || 0;
      const target = targets[item.key as keyof typeof targets] || 1;
      const progress = Math.min(100, Math.round((current / target) * 100));

      return {
        ...item,
        current,
        target,
        progress,
      };
    });
  }, [totals, targets]);

  // 전체 평균 달성률
  const overallProgress = useMemo(() => {
    const sum = nutritionProgress.reduce((acc, item) => acc + item.progress, 0);
    return Math.round(sum / nutritionProgress.length);
  }, [nutritionProgress]);

  return (
    <View style={tabsStyles.section}>
      <Text style={tabsStyles.sectionTitle}>📈 건강 목표 통계</Text>

      {/* 전체 달성률 카드 */}
      <View style={styles.overallCard}>
        <View style={styles.overallContent}>
          <View style={styles.overallInfo}>
            <Text style={styles.overallLabel}>오늘의 달성률</Text>
            <Text style={styles.overallPercent}>{overallProgress}%</Text>
            <View style={styles.overallProgressBar}>
              <View
                style={[
                  styles.overallProgressFill,
                  {
                    width: `${overallProgress}%`,
                    backgroundColor:
                      overallProgress >= 80
                        ? Colors.primary
                        : overallProgress >= 50
                        ? Colors.secondary
                        : Colors.warning,
                  },
                ]}
              />
            </View>
          </View>
          <View style={styles.trophyContainer}>
            <Ionicons name="trophy" size={48} color={Colors.primary} />
          </View>
        </View>
      </View>

      {/* 영양소 진행률 */}
      <View style={styles.nutritionCard}>
        <Text style={styles.cardTitle}>영양소 달성률</Text>
        {nutritionProgress.map((item, index) => {
          const progressWidth: DimensionValue = `${item.progress}%`;
          const isOver = item.progress > 100;
          const isLast = index === nutritionProgress.length - 1;

          return (
            <View
              key={item.key}
              style={[styles.nutritionItem, isLast && styles.nutritionItemLast]}
            >
              <View style={styles.nutritionHeader}>
                <View style={styles.nutritionLabelContainer}>
                  <Ionicons name={item.icon} size={18} color={Colors.primary} />
                  <Text style={styles.nutritionLabel}>{item.label}</Text>
                </View>
                <Text style={styles.nutritionPercent}>{item.progress}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: progressWidth,
                      backgroundColor: isOver
                        ? Colors.warning
                        : item.progress >= 80
                        ? Colors.primary
                        : Colors.secondary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.nutritionValue}>
                {item.current.toFixed(0)} / {item.target.toFixed(0)} {item.unit}
              </Text>
            </View>
          );
        })}
      </View>

      {/* 건강 목표 및 주간 통계 */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardLeft]}>
          <View style={styles.statIconContainer}>
            <Ionicons name="flag" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.statNumber}>{selectedGoals.length}</Text>
          <Text style={styles.statLabel}>선택한 목표</Text>
        </View>
        <View style={[styles.statCard, styles.statCardRight]}>
          <View style={styles.statIconContainer}>
            <Ionicons name="calendar" size={24} color={Colors.secondary} />
          </View>
          <Text style={styles.statNumber}>{weeklyMealCount}</Text>
          <Text style={styles.statLabel}>이번 주 식사</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overallCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...statsCardShadow,
  },
  overallContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overallInfo: {
    flex: 1,
  },
  overallLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  overallPercent: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  overallProgressBar: {
    height: 12,
    backgroundColor: Colors.borderLight,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  overallProgressFill: {
    height: "100%",
    borderRadius: 6,
  },
  trophyContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  nutritionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...statsCardShadow,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  nutritionItem: {
    marginBottom: 16,
  },
  nutritionItemLast: {
    marginBottom: 0,
  },
  nutritionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nutritionLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  nutritionPercent: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  nutritionValue: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    ...statsCardShadow,
  },
  statCardLeft: {
    marginRight: 0,
  },
  statCardRight: {
    marginLeft: 0,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
