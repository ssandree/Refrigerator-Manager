import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import GoalCard from "../../src/components/weeklyAchieve/GoalCard";
import HealthSummaryCard from "../../src/components/weeklyAchieve/HealthSummaryCard";
import SectionHeader from "../../src/components/weeklyAchieve/SectionHeader";
import { Colors } from "../../src/styles/common";

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
  // TODO: BE에서 건강 목표 계획 데이터를 받아옴
  // const { data: plans, isLoading } = useHealthGoalPlans(selectedGoals);

  // 임시: 빈 배열 (BE 연동 시 제거)
  const plans: (HealthGoalPlan & {
    goalTitle: string;
    color: string;
    id: number;
  })[] = [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TODO: BE에서 bmr, tdee를 받아옴 */}
        <HealthSummaryCard bmr={0} tdee={0} />

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
