import { Stack, router } from "expo-router";
import React, { useEffect, useMemo } from "react";
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
  const statisticsLoading = useStatisticsStore((state) => state.isLoading);
  const statisticsError = useStatisticsStore((state) => state.error);
  const fetchWeeklyStats = useStatisticsStore(
    (state) => state.fetchWeeklyStats
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

  useEffect(() => {
    // 사용자 정보 로드 (온보딩에서 받은 정보 포함)
    const loadUserInfo = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          updateUser({
            age: response.data.age ?? undefined,
            sex: response.data.sex ?? undefined,
            height: response.data.height ?? undefined,
            weight: response.data.weight ?? undefined,
            activityLevel: response.data.activityLevel ?? undefined,
            bmi: response.data.bmi ?? undefined,
          });
        }
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };
    loadUserInfo();

    // 사용자가 선택한 건강 목표 로드
    loadUserSelectedGoals();
    // 주간 통계: 기본으로 최근 7일을 조회
    const todayISO = useDateStore.getState().todayISO;
    // 오늘 포함 지난 7일 (오늘 - 6일)
    const startDateISO = addDaysInKorea(todayISO, -6);
    fetchWeeklyStats(startDateISO);
  }, [fetchWeeklyStats, loadUserSelectedGoals, updateUser]);

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

      const targetCalories = tdee ?? 0;
      const calorieProgress =
        targetCalories > 0 ? Math.min(1, avgCalories / targetCalories) : 0;

      const overallProgress = calorieProgress;

      const metrics =
        weeklyStats && targetCalories > 0
          ? [
              {
                label: "평균 일일 칼로리",
                target: `${Math.round(targetCalories)} kcal`,
                current: `${Math.round(avgCalories)} kcal`,
                progress: calorieProgress,
                note: "유지 칼로리 대비 섭취량",
              },
              {
                label: "평균 일일 단백질",
                target: "권장 섭취량은 개인에 따라 다릅니다",
                current: `${Math.round(avgProtein)} g`,
              },
              {
                label: "평균 일일 지방",
                target: "권장 섭취량은 개인에 따라 다릅니다",
                current: `${Math.round(avgFat)} g`,
              },
            ]
          : [];

      return {
        goalType: goal.title,
        title: goal.title,
        summary: "",
        overallProgress,
        metrics,
        recommendedFoods: [],
        notes: [],
        goalTitle: goal.title,
        color: Colors.primary,
        id: goal.id,
      };
    });
  }, [selectedGoals, weeklyStats, tdee]);

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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
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
  },
  headerRight: {
    width: 60, // 뒤로 버튼과 균형을 맞추기 위한 공간
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
