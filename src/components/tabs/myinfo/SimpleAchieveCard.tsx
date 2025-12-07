import React, { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDateStore } from "../../../stores/useDateStore";
import { useStatisticsStore } from "../../../stores/useStatisticsStore";
import { Colors, commonStyles, FontSizes } from "../../../styles/common";
import { addDaysInKorea } from "../../../utils/dateUtils";
import MetricRow from "../../weeklyAchieve/MetricRow";

export default function SimpleAchieveCard() {
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

  // 주간 평균 칼로리/영양소 계산 (nutritionStats에서 가져오기)
  const avgCalories = nutritionStats?.average?.calories ?? 0;
  const avgProtein = nutritionStats?.average?.protein ?? 0;
  const avgFat = nutritionStats?.average?.fat ?? 0;
  const avgCarbs = nutritionStats?.average?.carbs ?? 0;
  const avgVitaminC = nutritionStats?.average?.vitamin_c ?? 0;
  const avgVitaminD = nutritionStats?.average?.vitamin_d ?? 0;
  const avgZinc = nutritionStats?.average?.zinc ?? 0;

  // API에서 받아온 목표량 사용
  const apiTargets = combinedTargets?.targets;

  // 목표 지표 계산
  const goalMetrics = useMemo(() => {
    if (!apiTargets) {
      return {
        targetCalories: 0,
        overallProgress: 0,
        metrics: [],
      };
    }

    // 각 영양소별 달성률 계산
    const progressMap: Record<string, number> = {};

    // 칼로리
    const targetCalories = apiTargets.calories ?? 0;
    if (targetCalories > 0) {
      progressMap.calories = Math.min(1, avgCalories / targetCalories);
    }

    // 단백질
    const targetProtein = apiTargets.protein ?? 0;
    if (targetProtein > 0) {
      progressMap.protein = Math.min(1, avgProtein / targetProtein);
    }

    // 지방
    const targetFat = apiTargets.fat ?? 0;
    if (targetFat > 0) {
      progressMap.fat = Math.min(1, avgFat / targetFat);
    }

    // 탄수화물
    const targetCarbs = apiTargets.carbohydrates ?? 0;
    if (targetCarbs > 0) {
      progressMap.carbs = Math.min(1, avgCarbs / targetCarbs);
    }

    // 비타민 C
    const targetVitaminC = apiTargets.vitamin_c ?? 0;
    if (targetVitaminC > 0) {
      progressMap.vitaminC = Math.min(1, avgVitaminC / targetVitaminC);
    }

    // 비타민 D
    const targetVitaminD = apiTargets.vitamin_d ?? 0;
    if (targetVitaminD > 0) {
      progressMap.vitaminD = Math.min(1, avgVitaminD / targetVitaminD);
    }

    // 아연
    const targetZinc = apiTargets.zinc ?? 0;
    if (targetZinc > 0) {
      progressMap.zinc = Math.min(1, avgZinc / targetZinc);
    }

    // 전체 달성률 계산 (모든 영양소의 평균)
    const progressValues = Object.values(progressMap);
    const overallProgress =
      progressValues.length > 0
        ? progressValues.reduce((sum, val) => sum + val, 0) /
          progressValues.length
        : 0;

    const metrics: {
      label: string;
      target: string;
      current?: string;
      progress?: number;
      note?: string;
    }[] = [];

    // 칼로리
    if (targetCalories > 0) {
      metrics.push({
        label: "목표 칼로리",
        target: `${Math.round(targetCalories)} kcal`,
        current: `${Math.round(avgCalories)} kcal`,
        progress: progressMap.calories,
        note: "일일 목표 칼로리",
      });
    }

    // 단백질
    if (targetProtein > 0) {
      metrics.push({
        label: "단백질",
        target: `${Math.round(targetProtein)} g`,
        current: `${Math.round(avgProtein)} g`,
        progress: progressMap.protein,
      });
    }

    // 지방
    if (targetFat > 0) {
      metrics.push({
        label: "지방",
        target: `${Math.round(targetFat)} g`,
        current: `${Math.round(avgFat)} g`,
        progress: progressMap.fat,
      });
    }

    // 탄수화물
    if (targetCarbs > 0) {
      metrics.push({
        label: "탄수화물",
        target: `${Math.round(targetCarbs)} g`,
        current: `${Math.round(avgCarbs)} g`,
        progress: progressMap.carbs,
      });
    }

    // 나트륨
    if (apiTargets.sodium > 0) {
      metrics.push({
        label: "나트륨",
        target: `${Math.round(apiTargets.sodium)} mg 이하`,
        current: "추적 필요",
        note: "혈압 관리",
      });
    }

    // 비타민 C
    if (targetVitaminC > 0) {
      metrics.push({
        label: "비타민 C",
        target: `${Math.round(targetVitaminC)} mg`,
        current: `${Math.round(avgVitaminC)} mg`,
        progress: progressMap.vitaminC,
        note: "면역력 강화",
      });
    }

    // 비타민 D
    if (targetVitaminD > 0) {
      metrics.push({
        label: "비타민 D",
        target: `${Math.round(targetVitaminD)} µg`,
        current: `${Math.round(avgVitaminD)} µg`,
        progress: progressMap.vitaminD,
        note: "면역력 강화",
      });
    }

    // 아연
    if (targetZinc > 0) {
      metrics.push({
        label: "아연",
        target: `${Math.round(targetZinc)} mg`,
        current: `${Math.round(avgZinc)} mg`,
        progress: progressMap.zinc,
        note: "면역력 강화",
      });
    }

    return {
      targetCalories,
      overallProgress,
      metrics,
    };
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

  const progressPercent = Math.round(goalMetrics.overallProgress * 100);

  return (
    <View style={styles.SimpleAchieveCard}>
      <View style={styles.goalHeader}>
        <View>
          <Text style={styles.goalTitle}>전체 건강 목표 달성률</Text>
          <Text style={styles.goalSummary}>
            선택한 모든 건강 목표의 달성도를 종합하여 표시합니다.
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: Colors.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.progressDescription}>
          전체 달성률 {progressPercent}%
        </Text>
      </View>

      <View style={styles.metricContainer}>
        <Text style={styles.metricHeading}>주요 지표</Text>
        {goalMetrics.metrics.map((metric) => (
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
  SimpleAchieveCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...commonStyles.shadow,
  },
  goalHeader: {
    marginBottom: 16,
  },
  goalHeaderContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
  },
  goalSummary: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: Colors.borderLight,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressDescription: {
    marginTop: 8,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  metricContainer: {
    marginTop: 20,
  },
  metricHeading: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  detailSection: {
    marginTop: 16,
  },
  detailTitle: {
    fontSize: FontSizes.base,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 6,
  },
  detailText: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 6,
  },
  noteBullet: {
    width: 6,
    height: 6,
    marginTop: 8,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  foodChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  foodChip: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  foodChipText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    fontWeight: "500",
  },
});
