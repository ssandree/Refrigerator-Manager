import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import GoalCard from "../../src/components/weeklyAchieve/GoalCard";
import HealthSummaryCard from "../../src/components/weeklyAchieve/HealthSummaryCard";
import SectionHeader from "../../src/components/weeklyAchieve/SectionHeader";
import {
  mockUserProfile,
  mockWeeklyIntake,
} from "../../src/data/mockHealthMetrics";
import {
  useHealthGoalStore,
  type HealthGoal,
} from "../../src/stores/useHealthGoalStore";
import { Colors } from "../../src/styles/common";
import {
  calculateBmr,
  calculateHealthGoalPlan,
  calculateTdee,
  mapGoalTitleToType,
} from "../../src/utils/healthGoalCalculator";

const fallbackGoals: HealthGoal[] = [
  {
    id: 0,
    title: "체중 유지",
    description: "현재 체중을 건강하게 유지",
    icon: "scale-outline",
    color: Colors.primary,
  },
];

export default function WeeklyAchieveScreen() {
  const selectedGoals = useHealthGoalStore((state) => state.selectedGoals);
  const goalsToDisplay =
    selectedGoals.length > 0 ? selectedGoals : fallbackGoals;

  const bmr = useMemo(() => calculateBmr(mockUserProfile), []);
  const tdee = useMemo(() => calculateTdee(mockUserProfile, bmr), [bmr]);

  const plans = useMemo(
    () =>
      goalsToDisplay.map((goal) => {
        const goalType = mapGoalTitleToType(goal.title);
        const plan = calculateHealthGoalPlan(
          mockUserProfile,
          goalType,
          mockWeeklyIntake
        );
        return {
          ...plan,
          goalTitle: goal.title ?? plan.title,
          color: goal.color ?? Colors.primary,
          id: goal.id,
        };
      }),
    [goalsToDisplay]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <HealthSummaryCard bmr={bmr} tdee={tdee} />

        <SectionHeader
          title="선택한 건강 목표"
          subtitle="주간 섭취 데이터를 기반으로 달성도를 계산합니다."
        />

        {plans.map((plan) => (
          <GoalCard key={`${plan.goalType}-${plan.id}`} plan={plan} />
        ))}
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
});
