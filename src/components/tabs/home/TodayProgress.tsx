import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
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

export default function TodayProgress() {
  // 한국 시간 기준 오늘 날짜
  const todayISO = useDateStore((s) => s.todayISO);

  // NutritionStore의 날짜와 totals
  const nutritionDateISO = useNutritionStore((s) => s.dateISO);
  const totals = useNutritionStore((s) => s.totals);
  const targets = useNutritionStore((s) => s.targets);
  const setTargets = useNutritionStore((s) => s.setTargets);

  const dailyStats = useStatisticsStore((s) => s.dailyStats);
  const combinedTargets = useStatisticsStore((s) => s.combinedTargets);
  const fetchDailyStats = useStatisticsStore((s) => s.fetchDailyStats);
  const fetchCombinedTargets = useStatisticsStore(
    (s) => s.fetchCombinedTargets
  );

  // fetchDailyStats 함수 참조를 useRef로 저장하여 안정적인 참조 유지
  const fetchDailyStatsRef = useRef(fetchDailyStats);
  fetchDailyStatsRef.current = fetchDailyStats;

  // 오늘 날짜 기준 일일 통계 로드
  useEffect(() => {
    fetchDailyStatsRef.current(todayISO);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayISO]);

  // 오늘 날짜의 데이터만 사용 (다른 날짜의 데이터는 0으로 처리)
  const todayTotals = useMemo(() => {
    // dailyStats가 있고 오늘 날짜와 일치하는 경우에만 사용
    if (dailyStats) {
      const statsDate = toKoreaDateISO(new Date(dailyStats.date));
      if (statsDate === todayISO) {
        return {
          calories: Number(dailyStats.calories) || 0,
          protein: Number(dailyStats.macros?.protein) || 0,
          carbs: Number(dailyStats.macros?.carbs) || 0,
          fat: Number(dailyStats.macros?.fat) || 0,
          vitaminC: Number(dailyStats.macros?.vitamin_c) || 0,
          vitaminD: Number(dailyStats.macros?.vitamin_d) || 0,
          zinc: Number(dailyStats.macros?.zinc) || 0,
        };
      }
    }
    // 오늘 날짜의 데이터가 없으면 모든 값을 0으로
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      vitaminC: 0,
      vitaminD: 0,
      zinc: 0,
    };
  }, [dailyStats, todayISO]);

  // fetchCombinedTargets 함수 참조를 useRef로 저장하여 안정적인 참조 유지
  const fetchCombinedTargetsRef = useRef(fetchCombinedTargets);
  fetchCombinedTargetsRef.current = fetchCombinedTargets;

  // combinedTargets 로드
  useEffect(() => {
    fetchCombinedTargetsRef.current();
    // fetchCombinedTargets를 의존성 배열에서 제거하고 useRef 사용으로 안정적인 참조 유지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // combinedTargets를 NutritionStore의 targets로 반영
  const prevCombinedTargetsRef = useRef<string | null>(null);
  useEffect(() => {
    if (!combinedTargets) return;

    const goalIds = Object.keys(combinedTargets);
    if (goalIds.length === 0) return;

    // combinedTargets가 변경되었는지 확인 (무한 루프 방지)
    const combinedTargetsKey = JSON.stringify(combinedTargets);
    if (prevCombinedTargetsRef.current === combinedTargetsKey) return;
    prevCombinedTargetsRef.current = combinedTargetsKey;

    // 첫 번째 건강 목표의 목표치를 사용
    const firstGoal = combinedTargets[goalIds[0]];
    if (firstGoal) {
      const currentTargets = useNutritionStore.getState().targets;
      setTargets({
        calories: firstGoal.targetCalories ?? currentTargets.calories,
        protein:
          typeof firstGoal.targetProtein === "number"
            ? firstGoal.targetProtein
            : firstGoal.targetProtein?.max ??
              firstGoal.targetProtein?.min ??
              currentTargets.protein,
        carbs: firstGoal.targetCarbs ?? currentTargets.carbs,
        fat:
          typeof firstGoal.targetFat === "number"
            ? firstGoal.targetFat
            : firstGoal.targetFat?.max ??
              firstGoal.targetFat?.min ??
              currentTargets.fat,
        vitaminC: firstGoal.targetVitaminC ?? currentTargets.vitaminC,
        vitaminD: firstGoal.targetVitaminD ?? currentTargets.vitaminD,
        zinc: firstGoal.targetZinc ?? currentTargets.zinc,
      });
    }
  }, [combinedTargets, setTargets]);

  // 영양소 달성률 계산 (전체 평균 계산용)
  const nutritionProgress = useMemo(() => {
    const items = [
      { key: "calories" },
      { key: "protein" },
      { key: "carbs" },
      { key: "fat" },
    ];

    return items.map((item) => {
      const current = todayTotals[item.key as keyof typeof todayTotals] || 0;
      const target = targets[item.key as keyof typeof targets] || 1;
      const progress = Math.min(100, Math.round((current / target) * 100));

      return {
        ...item,
        current,
        target,
        progress,
      };
    });
  }, [todayTotals, targets]);

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
            <Text style={styles.overallLabel}>오늘의 건강 목표 달성률</Text>
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
