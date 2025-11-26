import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNutritionStore } from "../../../stores/useNutritionStore";
import { Colors, createShadowStyle } from "../../../styles/common";

const statsCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

export default function TodayProgress() {
  const totals = useNutritionStore((s) => s.totals);
  const targets = useNutritionStore((s) => s.targets);

  // 영양소 달성률 계산 (전체 평균 계산용)
  const nutritionProgress = useMemo(() => {
    const items = [
      { key: "calories" },
      { key: "protein" },
      { key: "carbs" },
      { key: "fat" },
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
    <View style={styles.overallCard}>
      <View style={styles.overallContent}>
        <View style={styles.overallInfo}>
          <View style={styles.labelRow}>
            <Text style={styles.overallLabel}>오늘의 달성률</Text>
            <View style={styles.trophyContainer}>
              <Ionicons name="trophy" size={32} color={Colors.primary} />
            </View>
          </View>
          <View style={styles.progressRow}>
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overallCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    ...statsCardShadow,
  },
  overallContent: {
    width: "100%",
  },
  overallInfo: {
    width: "100%",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  overallLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  overallPercent: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    minWidth: 60,
  },
  overallProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  overallProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  trophyContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
