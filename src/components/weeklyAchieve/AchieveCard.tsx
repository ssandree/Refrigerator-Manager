import React, { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDateStore } from "../../stores/useDateStore";
import { useStatisticsStore } from "../../stores/useStatisticsStore";
import { Colors, commonStyles, FontSizes } from "../../styles/common";
import { addDaysInKorea } from "../../utils/dateUtils";
import MetricRow from "./MetricRow";

export default function AchieveCard() {
  const nutritionStats = useStatisticsStore((state) => state.nutritionStats);
  const combinedTargets = useStatisticsStore((state) => state.combinedTargets);
  const fetchNutritionStats = useStatisticsStore(
    (state) => state.fetchNutritionStats
  );
  const fetchCombinedTargets = useStatisticsStore(
    (state) => state.fetchCombinedTargets
  );

  const fetchNutritionStatsRef = useRef(fetchNutritionStats);
  const fetchCombinedTargetsRef = useRef(fetchCombinedTargets);
  fetchNutritionStatsRef.current = fetchNutritionStats;
  fetchCombinedTargetsRef.current = fetchCombinedTargets;

  // 데이터 로드
  useEffect(() => {
    const todayISO = useDateStore.getState().todayISO;
    const startDateISO = addDaysInKorea(todayISO, -6);
    // nutritionStats를 사용하여 모든 영양소 정보 가져오기
    fetchNutritionStatsRef.current(startDateISO, todayISO);
    fetchCombinedTargetsRef.current();
  }, []);

  // 주간 평균 영양소 계산 (nutritionStats에서 가져오기)
  const avgCalories = nutritionStats?.average?.calories ?? 0;
  const avgProtein = nutritionStats?.average?.protein ?? 0;
  const avgFat = nutritionStats?.average?.fat ?? 0;
  const avgCarbs = nutritionStats?.average?.carbs ?? 0;
  const avgVitaminC = nutritionStats?.average?.vitamin_c ?? 0;
  const avgVitaminD = nutritionStats?.average?.vitamin_d ?? 0;
  const avgZinc = nutritionStats?.average?.zinc ?? 0;

  // API에서 받아온 목표량 사용
  const apiTargets = combinedTargets?.targets;

  // 영양소 지표 계산
  const nutritionMetrics = useMemo(() => {
    if (!apiTargets) {
      return [];
    }

    const metrics: {
      label: string;
      target: string;
      current?: string;
      progress?: number;
      note?: string;
    }[] = [];

    // 칼로리
    const targetCalories = apiTargets.calories ?? 0;
    const calorieProgress =
      targetCalories > 0
        ? Math.min(1, avgCalories / targetCalories)
        : undefined;
    metrics.push({
      label: "칼로리",
      target: `${Math.round(targetCalories)} kcal`,
      current: `${Math.round(avgCalories)} kcal`,
      progress: calorieProgress,
    });

    // 단백질
    const targetProtein = apiTargets.protein ?? 0;
    const proteinProgress =
      targetProtein > 0 ? Math.min(1, avgProtein / targetProtein) : undefined;
    metrics.push({
      label: "단백질",
      target: `${Math.round(targetProtein)} g`,
      current: `${Math.round(avgProtein)} g`,
      progress: proteinProgress,
    });

    // 지방
    const targetFat = apiTargets.fat ?? 0;
    const fatProgress =
      targetFat > 0 ? Math.min(1, avgFat / targetFat) : undefined;
    metrics.push({
      label: "지방",
      target: `${Math.round(targetFat)} g`,
      current: `${Math.round(avgFat)} g`,
      progress: fatProgress,
    });

    // 탄수화물
    const targetCarbs = apiTargets.carbohydrates ?? 0;
    const carbsProgress =
      targetCarbs > 0 ? Math.min(1, avgCarbs / targetCarbs) : undefined;
    metrics.push({
      label: "탄수화물",
      target: `${Math.round(targetCarbs)} g`,
      current: `${Math.round(avgCarbs)} g`,
      progress: carbsProgress,
    });

    // 나트륨 (염분)
    const targetSodium = apiTargets.sodium ?? 0;
    // 나트륨은 nutritionStats에 없으므로 현재 값은 "추적 필요"로 표시
    metrics.push({
      label: "나트륨 (염분)",
      target: `${Math.round(targetSodium)} mg 이하`,
      current: "추적 필요",
      note: "혈압 관리",
    });

    // 비타민 C
    const targetVitaminC = apiTargets.vitamin_c ?? 0;
    const vitaminCProgress =
      targetVitaminC > 0
        ? Math.min(1, avgVitaminC / targetVitaminC)
        : undefined;
    metrics.push({
      label: "비타민 C",
      target: `${Math.round(targetVitaminC)} mg`,
      current: `${Math.round(avgVitaminC)} mg`,
      progress: vitaminCProgress,
      note: "면역력 강화",
    });

    // 비타민 D
    const targetVitaminD = apiTargets.vitamin_d ?? 0;
    const vitaminDProgress =
      targetVitaminD > 0
        ? Math.min(1, avgVitaminD / targetVitaminD)
        : undefined;
    metrics.push({
      label: "비타민 D",
      target: `${Math.round(targetVitaminD)} µg`,
      current: `${Math.round(avgVitaminD)} µg`,
      progress: vitaminDProgress,
      note: "면역력 강화",
    });

    // 아연
    const targetZinc = apiTargets.zinc ?? 0;
    const zincProgress =
      targetZinc > 0 ? Math.min(1, avgZinc / targetZinc) : undefined;
    metrics.push({
      label: "아연",
      target: `${Math.round(targetZinc)} mg`,
      current: `${Math.round(avgZinc)} mg`,
      progress: zincProgress,
      note: "면역력 강화",
    });

    return metrics;
  }, [
    apiTargets,
    avgCalories,
    avgProtein,
    avgFat,
    avgCarbs,
    avgVitaminC,
    avgVitaminD,
    avgZinc,
  ]);

  if (nutritionMetrics.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyText}>영양소 데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>주간 영양소 달성 현황</Text>
      <View style={styles.metricsContainer}>
        {nutritionMetrics.map((metric) => (
          <MetricRow
            key={metric.label}
            metric={metric}
            color={Colors.primary}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...commonStyles.shadow,
  },
  cardTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 20,
  },
  metricsContainer: {
    gap: 0,
  },
  emptyText: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingVertical: 20,
  },
});
