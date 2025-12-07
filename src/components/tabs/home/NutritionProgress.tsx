import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import { DimensionValue, StyleSheet, Text, View } from "react-native";
import { useDateStore } from "../../../stores/useDateStore";
import { useNutritionStore } from "../../../stores/useNutritionStore";
import { useStatisticsStore } from "../../../stores/useStatisticsStore";
import { Colors, createShadowStyle } from "../../../styles/common";
import { toKoreaDateISO } from "../../../utils/dateUtils";

const statsCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

export default function NutritionProgress() {
  const totals = useNutritionStore((s) => s.totals);
  const targets = useNutritionStore((s) => s.targets);
  const setTotals = useNutritionStore((s) => s.setTotals);
  const setTargets = useNutritionStore((s) => s.setTargets);
  const setDate = useNutritionStore((s) => s.setDate);

  const dailyStats = useStatisticsStore((s) => s.dailyStats);
  const combinedTargets = useStatisticsStore((s) => s.combinedTargets);
  const fetchDailyStats = useStatisticsStore((s) => s.fetchDailyStats);
  const fetchCombinedTargets = useStatisticsStore(
    (s) => s.fetchCombinedTargets
  );

  // 한국 시간 기준 오늘 날짜를 전역 스토어에서 가져옴
  const todayISO = useDateStore((s) => s.todayISO);

  // 함수 참조를 useRef로 저장하여 안정적인 참조 유지
  const fetchDailyStatsRef = useRef(fetchDailyStats);
  const fetchCombinedTargetsRef = useRef(fetchCombinedTargets);
  fetchDailyStatsRef.current = fetchDailyStats;
  fetchCombinedTargetsRef.current = fetchCombinedTargets;

  // 오늘 날짜 기준 일일 통계 및 목표치 로드
  useEffect(() => {
    fetchDailyStatsRef.current(todayISO);
    fetchCombinedTargetsRef.current();
    // 함수들을 의존성 배열에서 제거하고 useRef 사용으로 안정적인 참조 유지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayISO]);

  // 통계 응답을 NutritionStore의 totals로 반영
  useEffect(() => {
    if (!dailyStats) return;

    // dailyStats의 날짜가 오늘 날짜와 일치하는지 확인
    // 절대 split("T")[0]를 사용하지 않음 - UTC 기준 날짜가 잘못될 수 있음
    const statsDate = toKoreaDateISO(new Date(dailyStats.date));
    if (statsDate !== todayISO) return;

    setDate(statsDate);
    // 모든 필드를 명시적으로 설정 (부분 업데이트 방지)
    // API 응답 구조: { date, calories, macros: { ... }, mealCount, mealHistory }
    setTotals({
      calories: Number(dailyStats.calories) || 0,
      protein: Number(dailyStats.macros?.protein) || 0,
      carbs: Number(dailyStats.macros?.carbs) || 0,
      fat: Number(dailyStats.macros?.fat) || 0,
      vitaminC: Number(dailyStats.macros?.vitamin_c) || 0,
      vitaminD: Number(dailyStats.macros?.vitamin_d) || 0,
      zinc: Number(dailyStats.macros?.zinc) || 0,
    });
  }, [dailyStats, todayISO, setDate, setTotals]);

  // combinedTargets를 NutritionStore의 targets로 반영
  // 여러 건강 목표가 있을 경우 첫 번째 목표의 목표치를 사용
  const prevCombinedTargetsRef = useRef<string | null>(null);
  useEffect(() => {
    if (!combinedTargets) return;

    const goalIds = Object.keys(combinedTargets);
    if (goalIds.length === 0) return;

    // combinedTargets가 변경되었는지 확인 (무한 루프 방지)
    const combinedTargetsKey = JSON.stringify(combinedTargets);
    if (prevCombinedTargetsRef.current === combinedTargetsKey) return;
    prevCombinedTargetsRef.current = combinedTargetsKey;

    // API 응답 구조: { goalCount, goals, targets: { ... } }
    if (combinedTargets.targets) {
      const currentTargets = useNutritionStore.getState().targets;
      setTargets({
        calories: combinedTargets.targets.calories ?? currentTargets.calories,
        protein: combinedTargets.targets.protein ?? currentTargets.protein,
        carbs: combinedTargets.targets.carbohydrates ?? currentTargets.carbs,
        fat: combinedTargets.targets.fat ?? currentTargets.fat,
        vitaminC: combinedTargets.targets.vitamin_c ?? currentTargets.vitaminC,
        vitaminD: combinedTargets.targets.vitamin_d ?? currentTargets.vitaminD,
        zinc: combinedTargets.targets.zinc ?? currentTargets.zinc,
      });
    }
  }, [combinedTargets, setTargets]);

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
