import { router, Stack } from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  activityLabelMap,
  mockUserProfile,
  mockWeeklyIntake,
} from "../../src/data/mockHealthMetrics";
import {
  useHealthGoalStore,
  type HealthGoal,
} from "../../src/stores/useHealthGoalStore";
import { Colors, commonStyles, FontSizes } from "../../src/styles/common";
import {
  calculateBmr,
  calculateHealthGoalPlan,
  calculateTdee,
  mapGoalTitleToType,
  type HealthGoalPlan,
} from "../../src/utils/healthGoalCalculator";

const formatProgress = (value?: number) =>
  value === undefined ? "데이터 없음" : `${Math.round(value * 100)}%`;

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
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "주간 목표 달성 현황",
          headerLeft: () => (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← 뒤로</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>이번 주 건강 요약</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>기초대사량 (BMR)</Text>
                <Text style={styles.summaryValue}>{Math.round(bmr)} kcal</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>유지 칼로리 (TDEE)</Text>
                <Text style={styles.summaryValue}>{Math.round(tdee)} kcal</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>신체 정보</Text>
                <Text style={styles.summaryValue}>
                  {mockUserProfile.sex === "male" ? "남성" : "여성"} ·{" "}
                  {mockUserProfile.age}세
                </Text>
                <Text style={styles.summarySubValue}>
                  {mockUserProfile.heightCm}cm · {mockUserProfile.weightKg}kg
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>활동지수</Text>
                <Text style={styles.summaryValue}>
                  {activityLabelMap[mockUserProfile.activityLevel]}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>선택한 건강 목표</Text>
            <Text style={styles.sectionSubtitle}>
              주간 섭취 데이터를 기반으로 달성도를 계산합니다.
            </Text>
          </View>

          {plans.map((plan) => (
            <GoalCard key={`${plan.goalType}-${plan.id}`} plan={plan} />
          ))}
        </ScrollView>
      </View>
    </>
  );
}

type ExtendedPlan = HealthGoalPlan & {
  goalTitle: string;
  color: string;
  id: number;
};

interface GoalCardProps {
  plan: ExtendedPlan;
}

const GoalCard = ({ plan }: GoalCardProps) => {
  const progressPercent = Math.round(plan.overallProgress * 100);

  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View>
          <Text style={styles.goalTitle}>{plan.goalTitle}</Text>
          <Text style={styles.goalSummary}>{plan.summary}</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>{progressPercent}%</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: plan.color || Colors.primary,
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
        {plan.metrics.map((metric) => (
          <View key={metric.label} style={styles.metricRow}>
            <View style={styles.metricLabelColumn}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              {metric.note ? (
                <Text style={styles.metricNote}>{metric.note}</Text>
              ) : null}
            </View>
            <View style={styles.metricValueColumn}>
              <Text style={styles.metricTarget}>{metric.target}</Text>
              <Text style={styles.metricCurrent}>
                {metric.current ?? "데이터 없음"}
              </Text>
            </View>
            <View style={styles.metricProgressColumn}>
              <Text style={styles.metricProgressText}>
                {formatProgress(metric.progress)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>추천 식품</Text>
        <Text style={styles.detailText}>
          {plan.recommendedFoods.join(" · ")}
        </Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.detailTitle}>참고 사항</Text>
        {plan.notes.map((note, index) => (
          <View style={styles.noteRow} key={`${plan.goalType}-note-${index}`}>
            <View style={styles.noteBullet} />
            <Text style={styles.detailText}>{note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  backButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: "600",
  },
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
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...commonStyles.shadow,
  },
  summaryTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
  },
  summarySubValue: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  goalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...commonStyles.shadow,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
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
  progressBadge: {
    minWidth: 64,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBadgeText: {
    color: Colors.surface,
    fontWeight: "700",
    fontSize: FontSizes.base,
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
    fontSize: FontSizes.base,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  metricLabelColumn: {
    flex: 1.2,
  },
  metricValueColumn: {
    flex: 1.2,
  },
  metricProgressColumn: {
    width: 80,
    alignItems: "flex-end",
  },
  metricLabel: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.text,
  },
  metricNote: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  metricTarget: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  metricCurrent: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  metricProgressText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.primary,
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
});
