import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNutritionStore } from "../../../stores/useNutritionStore";
import { Colors, FontSizes, commonStyles } from "../../../styles/common";

export default function TodayTotal() {
  const totals = useNutritionStore((s) => s.totals);

  const nutritionItems = [
    { label: "총 칼로리", value: `${totals.calories}`, unit: "kcal" },
    { label: "단백질", value: `${totals.protein}`, unit: "g" },
    { label: "탄수화물", value: `${totals.carbs}`, unit: "g" },
    { label: "지방", value: `${totals.fat}`, unit: "g" },
  ] as const;

  return (
    <View style={styles.summarySection}>
      <Text style={styles.summaryTitle}>📊 오늘의 총계</Text>
      <View style={[commonStyles.card, styles.summaryCard]}>
        {nutritionItems.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.summaryItem,
              index < nutritionItems.length - 1 && styles.summaryItemBorder,
            ]}
          >
            <Text style={styles.summaryLabel}>{item.label}</Text>
            <Text style={styles.summaryValue}>
              {item.value} {item.unit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  summaryCard: {
    // commonStyles.card를 사용하므로 추가 스타일만 정의
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  summaryLabel: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
