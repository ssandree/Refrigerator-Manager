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
import AchieveCard from "../../src/components/weeklyAchieve/AchieveCard";
import GoalProgressChart from "../../src/components/weeklyAchieve/GoalProgressChart";
import SectionHeader from "../../src/components/weeklyAchieve/SectionHeader";
import { useDateStore } from "../../src/stores/useDateStore";
import { useHealthGoalStore } from "../../src/stores/useHealthGoalStore";
import { useStatisticsStore } from "../../src/stores/useStatisticsStore";
import { Colors, FontSizes } from "../../src/styles/common";
import { addDaysInKorea } from "../../src/utils/dateUtils";

export default function WeeklyAchieveScreen() {
  // 건강 목표 스토어 바인딩
  const selectedGoals = useHealthGoalStore((state) => state.selectedGoals);
  const loadUserSelectedGoals = useHealthGoalStore(
    (state) => state.loadUserSelectedGoals
  );

  // 통계 스토어 바인딩
  const weeklyStats = useStatisticsStore((state) => state.weeklyStats);
  const combinedTargets = useStatisticsStore((state) => state.combinedTargets);
  const fetchWeeklyStats = useStatisticsStore(
    (state) => state.fetchWeeklyStats
  );
  const fetchCombinedTargets = useStatisticsStore(
    (state) => state.fetchCombinedTargets
  );

  const loadUserSelectedGoalsRef = useRef(loadUserSelectedGoals);
  const fetchWeeklyStatsRef = useRef(fetchWeeklyStats);
  const fetchCombinedTargetsRef = useRef(fetchCombinedTargets);
  loadUserSelectedGoalsRef.current = loadUserSelectedGoals;
  fetchWeeklyStatsRef.current = fetchWeeklyStats;
  fetchCombinedTargetsRef.current = fetchCombinedTargets;

  useEffect(() => {
    // 사용자가 선택한 건강 목표 로드
    loadUserSelectedGoalsRef.current();
    // 주간 통계: 기본으로 최근 7일을 조회
    const todayISO = useDateStore.getState().todayISO;
    const startDateISO = addDaysInKorea(todayISO, -6);
    fetchWeeklyStatsRef.current(startDateISO);
    // 건강 목표별 영양소 목표량 로드
    fetchCombinedTargetsRef.current();
  }, []);

  // 그래프용 데이터 계산
  const chartData = useMemo(() => {
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

    const avgCalories = weeklyStats?.weeklyTotal?.averageCalories ?? 0;
    const apiTargets = combinedTargets?.targets;
    const targetCalories = apiTargets?.calories ?? 0;
    const calorieProgress =
      targetCalories > 0 ? Math.min(1, avgCalories / targetCalories) : 0;

    return selectedGoals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      progress: calorieProgress,
      color: goal.color || goalColors[goal.id] || Colors.primary,
    }));
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
            {/* 목표 달성률 그래프 */}
            {selectedGoals.length > 0 && chartData.length > 0 && (
              <GoalProgressChart goals={chartData} />
            )}

            <SectionHeader
              title="영양소 달성 현황"
              subtitle="주간 섭취 데이터를 기반으로 달성도를 계산합니다."
            />

            <AchieveCard />
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
