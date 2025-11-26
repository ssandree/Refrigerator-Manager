import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { useNutritionStore } from "../../../stores/useNutritionStore";
import { Colors, createShadowStyle } from "../../../styles/common";

const statsCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

export default function NutritionProgress() {
  const totals = useNutritionStore((s) => s.totals);
  const targets = useNutritionStore((s) => s.targets);

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
      {
        key: "vitaminC",
        label: "비타민 C",
        unit: "mg",
        icon: "leaf" as const,
      },
      {
        key: "vitaminD",
        label: "비타민 D",
        unit: "µg",
        icon: "sunny" as const,
      },
      {
        key: "zinc",
        label: "아연",
        unit: "mg",
        icon: "cube" as const,
      },
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

  return (
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
  );
}

const styles = StyleSheet.create({
  nutritionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
});
