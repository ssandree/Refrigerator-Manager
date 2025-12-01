import { Stack, router } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoalCard from "../../src/components/weeklyAchieve/GoalCard";
import HealthSummaryCard from "../../src/components/weeklyAchieve/HealthSummaryCard";
import SectionHeader from "../../src/components/weeklyAchieve/SectionHeader";
import { authService } from "../../src/services/authService";
import { convertActivityLevelToNumber } from "../../src/services/dashboardService";
import { useAuthStore } from "../../src/stores/useAuthStore";
import { useDashboardStore } from "../../src/stores/useDashboardStore";
import { useDateStore } from "../../src/stores/useDateStore";
import { useHealthGoalStore } from "../../src/stores/useHealthGoalStore";
import { useStatisticsStore } from "../../src/stores/useStatisticsStore";
import { Colors, FontSizes } from "../../src/styles/common";
import { addDaysInKorea } from "../../src/utils/dateUtils";

// BMR 계산 (Mifflin-St Jeor Equation)
function calculateBMR(
  age: number | null | undefined,
  sex: string | null | undefined,
  weight: number | null | undefined,
  height: number | null | undefined
): number {
  if (!age || !sex || !weight || !height) return 0;

  // 남성: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
  // 여성: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
  const isMale = sex === "male" || sex === "남성";
  const baseBMR = 10 * weight + 6.25 * height - 5 * age + (isMale ? 5 : -161);
  return baseBMR;
}

// TDEE 계산 (BMR × Activity Level)
function calculateTDEE(
  bmr: number,
  activityLevel: string | null | undefined
): number {
  if (bmr === 0) return 0;
  const activityMultiplier = convertActivityLevelToNumber(activityLevel);
  return bmr * activityMultiplier;
}

// BE에서 받아올 건강 목표 계획 타입 (임시 - BE API 연동 시 실제 타입으로 교체)
export interface HealthGoalPlan {
  goalType: string;
  title: string;
  summary: string;
  overallProgress: number;
  metrics: {
    label: string;
    target: string;
    current?: string;
    progress?: number;
    note?: string;
  }[];
  recommendedFoods: string[];
  notes: string[];
}

export default function WeeklyAchieveScreen() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const dashboardLoading = useDashboardStore((state) => state.isLoading);
  const dashboardError = useDashboardStore((state) => state.error);

  // 건강 목표 스토어 바인딩
  const selectedGoals = useHealthGoalStore((state) => state.selectedGoals);
  const loadUserSelectedGoals = useHealthGoalStore(
    (state) => state.loadUserSelectedGoals
  );

  // 통계 스토어 바인딩
  const weeklyStats = useStatisticsStore((state) => state.weeklyStats);
  const combinedTargets = useStatisticsStore((state) => state.combinedTargets);
  const statisticsLoading = useStatisticsStore((state) => state.isLoading);
  const statisticsError = useStatisticsStore((state) => state.error);
  const fetchWeeklyStats = useStatisticsStore(
    (state) => state.fetchWeeklyStats
  );
  const fetchCombinedTargets = useStatisticsStore(
    (state) => state.fetchCombinedTargets
  );

  // 클라이언트 사이드에서 BMR/TDEE 계산
  const bmr = useMemo(
    () => calculateBMR(user?.age, user?.sex, user?.weight, user?.height),
    [user?.age, user?.sex, user?.weight, user?.height]
  );

  const tdee = useMemo(
    () => calculateTDEE(bmr, user?.activityLevel),
    [bmr, user?.activityLevel]
  );

  // 함수 참조를 useRef로 저장하여 안정적인 참조 유지
  const fetchWeeklyStatsRef = useRef(fetchWeeklyStats);
  const fetchCombinedTargetsRef = useRef(fetchCombinedTargets);
  const loadUserSelectedGoalsRef = useRef(loadUserSelectedGoals);
  const updateUserRef = useRef(updateUser);
  fetchWeeklyStatsRef.current = fetchWeeklyStats;
  fetchCombinedTargetsRef.current = fetchCombinedTargets;
  loadUserSelectedGoalsRef.current = loadUserSelectedGoals;
  updateUserRef.current = updateUser;

  useEffect(() => {
    // 사용자 정보 로드 (온보딩에서 받은 정보 포함)
    const loadUserInfo = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          updateUserRef.current({
            age: response.data.age ?? null,
            sex: response.data.sex ?? null,
            height: response.data.height ?? null,
            weight: response.data.weight ?? null,
            activityLevel: response.data.activityLevel ?? null,
            bmi: response.data.bmi ?? null,
          });
        }
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };
    loadUserInfo();

    // 사용자가 선택한 건강 목표 로드
    loadUserSelectedGoalsRef.current();
    // 주간 통계: 기본으로 최근 7일을 조회
    const todayISO = useDateStore.getState().todayISO;
    // 오늘 포함 지난 7일 (오늘 - 6일)
    const startDateISO = addDaysInKorea(todayISO, -6);
    fetchWeeklyStatsRef.current(startDateISO);
    // 건강 목표별 영양소 목표량 로드
    fetchCombinedTargetsRef.current();
    // 함수들을 의존성 배열에서 제거하고 useRef 사용으로 안정적인 참조 유지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 건강 목표별 계산 함수
  // API에서 받아온 combinedTargets를 사용하여 목표량 계산
  const calculateGoalMetrics = (
    avgCalories: number,
    avgProtein: number,
    avgFat: number,
    avgCarbs: number,
    apiTargets:
      | {
          targetCalories?: number;
          targetProtein?: number | { min?: number; max?: number };
          targetFat?: number | { min?: number; max?: number };
          targetCarbs?: number;
          targetSodium?: number;
          targetVitaminC?: number;
          targetVitaminD?: number;
          targetZinc?: number;
          recommendedFoods?: string[];
          notes?: string[];
        }
      | null
      | undefined
  ) => {
    // API 데이터가 없으면 빈 데이터 반환
    if (!apiTargets) {
      return {
        targetCalories: 0,
        overallProgress: 0,
        metrics: [],
        recommendedFoods: [],
        notes: [],
      };
    }

    // API에서 받아온 목표량 사용
    const targetCalories = apiTargets.targetCalories ?? 0;
    const calorieProgress =
      targetCalories > 0 ? Math.min(1, avgCalories / targetCalories) : 0;

    // 단백질 목표량 파싱
    let targetProteinMin: number | undefined;
    let targetProteinMax: number | undefined;
    if (typeof apiTargets.targetProtein === "number") {
      targetProteinMin = apiTargets.targetProtein;
      targetProteinMax = apiTargets.targetProtein;
    } else if (apiTargets.targetProtein) {
      targetProteinMin = apiTargets.targetProtein.min;
      targetProteinMax = apiTargets.targetProtein.max;
    }

    // 지방 목표량 파싱
    let targetFatMin: number | undefined;
    let targetFatMax: number | undefined;
    if (typeof apiTargets.targetFat === "number") {
      targetFatMin = apiTargets.targetFat;
      targetFatMax = apiTargets.targetFat;
    } else if (apiTargets.targetFat) {
      targetFatMin = apiTargets.targetFat.min;
      targetFatMax = apiTargets.targetFat.max;
    }

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
        progress: calorieProgress,
        note: "일일 목표 칼로리",
      });
    }

    // 단백질
    if (targetProteinMin !== undefined && targetProteinMax !== undefined) {
      const proteinProgress =
        targetProteinMax > 0 ? Math.min(1, avgProtein / targetProteinMax) : 0;
      metrics.push({
        label: "단백질",
        target:
          targetProteinMin === targetProteinMax
            ? `${Math.round(targetProteinMin)} g`
            : `${Math.round(targetProteinMin)}~${Math.round(
                targetProteinMax
              )} g`,
        current: `${Math.round(avgProtein)} g`,
        progress: proteinProgress,
      });
    }

    // 지방
    if (targetFatMin !== undefined && targetFatMax !== undefined) {
      const fatProgress =
        targetFatMax > 0 ? Math.min(1, avgFat / targetFatMax) : 0;
      metrics.push({
        label: "지방",
        target:
          targetFatMin === targetFatMax
            ? `${Math.round(targetFatMin)} g`
            : `${Math.round(targetFatMin)}~${Math.round(targetFatMax)} g`,
        current: `${Math.round(avgFat)} g`,
        progress: fatProgress,
      });
    }

    // 탄수화물
    if (apiTargets.targetCarbs !== undefined) {
      const carbsProgress =
        apiTargets.targetCarbs > 0
          ? Math.min(1, avgCarbs / apiTargets.targetCarbs)
          : 0;
      metrics.push({
        label: "탄수화물",
        target: `${Math.round(apiTargets.targetCarbs)} g`,
        current: `${Math.round(avgCarbs)} g`,
        progress: carbsProgress,
      });
    }

    // 나트륨
    if (apiTargets.targetSodium !== undefined) {
      metrics.push({
        label: "나트륨",
        target: `${Math.round(apiTargets.targetSodium)} mg 이하`,
        current: "추적 필요",
        note: "혈압 관리",
      });
    }

    // 비타민 C
    if (apiTargets.targetVitaminC !== undefined) {
      metrics.push({
        label: "비타민 C",
        target: `${Math.round(apiTargets.targetVitaminC)} mg`,
        current: "추적 필요",
        note: "면역력 강화",
      });
    }

    // 비타민 D
    if (apiTargets.targetVitaminD !== undefined) {
      metrics.push({
        label: "비타민 D",
        target: `${Math.round(apiTargets.targetVitaminD)} IU`,
        current: "추적 필요",
        note: "면역력 강화",
      });
    }

    // 아연
    if (apiTargets.targetZinc !== undefined) {
      metrics.push({
        label: "아연",
        target: `${Math.round(apiTargets.targetZinc)} mg`,
        current: "추적 필요",
        note: "면역력 강화",
      });
    }

    return {
      targetCalories,
      overallProgress: calorieProgress,
      metrics,
      recommendedFoods: apiTargets.recommendedFoods || [],
      notes: apiTargets.notes || [],
    };
  };

  // 사용자가 선택한 건강 목표 + 통계 데이터를 기반으로 카드 구성
  const plans: (HealthGoalPlan & {
    goalTitle: string;
    color: string;
    id: number;
  })[] = useMemo(() => {
    return selectedGoals.map((goal) => {
      // 주간 평균 칼로리/영양소를 이용해 달성률 계산
      const avgCalories = weeklyStats?.averageDailyCalories ?? 0;
      const avgProtein = weeklyStats?.averageDailyProtein ?? 0;
      const avgFat = weeklyStats?.averageDailyFat ?? 0;
      const avgCarbs = weeklyStats?.averageDailyCarbs ?? 0;

      // API에서 받아온 목표량 사용 (goalId를 문자열로 변환하여 조회)
      const apiTargets = combinedTargets?.[String(goal.id)];

      const goalData = calculateGoalMetrics(
        avgCalories,
        avgProtein,
        avgFat,
        avgCarbs,
        apiTargets
      );

      // 목표별 색상 설정
      const goalColors: Record<number, string> = {
        1001: "#4CAF50", // 체중 유지 - 초록
        1002: "#2196F3", // 체지방 감량 - 파랑
        1003: "#FF9800", // 단백질 보충 - 주황
        1004: "#F44336", // 체중 증량 - 빨강
        1005: "#9C27B0", // 혈당 관리 - 보라
        1006: "#00BCD4", // 면역력 강화 - 청록
        1007: "#FF5722", // 체력 유지/향상 - 주황빨강
      };

      return {
        goalType: goal.title,
        title: goal.title,
        summary: goal.description || "",
        overallProgress: goalData.overallProgress,
        metrics: goalData.metrics,
        recommendedFoods: goalData.recommendedFoods,
        notes: goalData.notes,
        goalTitle: goal.title,
        color: goal.color || goalColors[goal.id] || Colors.primary,
        id: goal.id,
      };
    });
  }, [selectedGoals, weeklyStats, combinedTargets]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/MyInfo");
                }
              }}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>주간 목표 달성 현황</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
          >
            <HealthSummaryCard
              bmr={bmr}
              tdee={tdee}
              sex={user?.sex}
              age={user?.age}
              weight={user?.weight}
              height={user?.height}
              activityLevel={user?.activityLevel}
            />

            {dashboardLoading && (
              <Text style={styles.loadingText}>
                대시보드 정보를 불러오는 중...
              </Text>
            )}
            {dashboardError && (
              <Text style={styles.errorText}>{dashboardError}</Text>
            )}

            {statisticsLoading && (
              <Text style={styles.loadingText}>주간 통계를 불러오는 중...</Text>
            )}
            {statisticsError && (
              <Text style={styles.errorText}>{statisticsError}</Text>
            )}

            <SectionHeader
              title="선택한 건강 목표"
              subtitle="주간 섭취 데이터를 기반으로 달성도를 계산합니다."
            />

            {plans.length > 0 ? (
              plans.map((plan) => (
                <GoalCard key={`${plan.goalType}-${plan.id}`} plan={plan} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  건강 목표 데이터를 불러오는 중...
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
    flex: 1,
  },
  headerRight: {
    width: 40, // 뒤로 버튼과 균형을 맞추기 위한 공간
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginBottom: 12,
  },
});
