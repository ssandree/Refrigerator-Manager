import { Stack, router } from "expo-router";
import React, { useEffect, useState } from "react";
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
import dashboardService from "../../src/services/dashboardService";
import { useAuthStore } from "../../src/stores/useAuthStore";
import { Colors, FontSizes } from "../../src/styles/common";

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
  // 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);
  const [bmr, setBmr] = useState<number>(0);
  const [tdee, setTdee] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // BMR과 TDEE 조회
  useEffect(() => {
    const fetchBMRAndTDEE = async () => {
      if (!user) {
        setBmr(0);
        setTdee(0);
        return;
      }

      setIsLoading(true);
      try {
        // 내 BMR 조회
        const bmrResponse = await dashboardService.getMyBMR();
        if (bmrResponse.success && bmrResponse.data) {
          setBmr(bmrResponse.data.bmr);
        }

        // 내 TDEE 조회
        const tdeeResponse = await dashboardService.getMyTDEE();
        if (tdeeResponse.success && tdeeResponse.data) {
          setTdee(tdeeResponse.data.tdee);
        }
      } catch (error) {
        console.error("BMR/TDEE 조회 실패:", error);
        setBmr(0);
        setTdee(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBMRAndTDEE();
  }, [user]);

  // TODO: BE에서 건강 목표 계획 데이터를 받아옴
  // const { data: plans, isLoading } = useHealthGoalPlans(selectedGoals);

  // 임시: 빈 배열 (BE 연동 시 제거)
  const plans: (HealthGoalPlan & {
    goalTitle: string;
    color: string;
    id: number;
  })[] = [];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← 뒤로</Text>
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
              activityLevel={user?.activityLevel}
            />

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
});
