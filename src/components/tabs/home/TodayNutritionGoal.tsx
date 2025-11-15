import { tabsStyles } from "@/styles/tabs";
import React, { useMemo } from "react";
import { DimensionValue, Text, View } from "react-native";
import { useNutritionStore } from "../../../stores/useNutritionStore";

const LABELS: Record<string, { label: string; unit: string }> = {
  calories: { label: "칼로리", unit: "kcal" },
  protein: { label: "단백질", unit: "g" },
  carbs: { label: "탄수화물", unit: "g" },
  fat: { label: "지방", unit: "g" },
  vitaminC: { label: "비타민 C", unit: "mg" },
  vitaminD: { label: "비타민 D", unit: "µg" },
  zinc: { label: "아연", unit: "mg" },
};

export default function TodayHealthGoal() {
  const totals = useNutritionStore((s) => s.totals);
  const targets = useNutritionStore((s) => s.targets);

  const items = useMemo(
    () =>
      (Object.keys(LABELS) as (keyof typeof LABELS)[]).map((k) => {
        const current = totals[k as keyof typeof totals] || 0;
        const target = targets[k as keyof typeof targets] || 0;
        return { key: k, current, target, ...LABELS[k] };
      }),
    [totals, targets]
  );

  return (
    <View style={tabsStyles.section}>
      <Text style={tabsStyles.sectionTitle}>🎯 오늘의 건강 목표</Text>
      <View style={tabsStyles.goalContainer}>
        {items.map((n) => {
          const ratio = Math.max(
            0,
            Math.min(1, n.current / Math.max(1, n.target))
          );
          const percent: DimensionValue = `${Math.round(ratio * 100)}%`;
          return (
            <View key={n.key} style={tabsStyles.goalItem}>
              <Text style={tabsStyles.goalLabel}>{n.label}</Text>
              <View style={tabsStyles.progressBar}>
                <View style={[tabsStyles.progressFill, { width: percent }]} />
              </View>
              <Text style={tabsStyles.goalText}>
                {n.current} / {n.target} {n.unit}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
