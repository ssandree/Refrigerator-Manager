import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, commonStyles, FontSizes } from "../../styles/common";
import MetricRow from "./MetricRow";

// BE에서 받아올 건강 목표 계획 타입
export interface HealthGoalPlan {
  goalType: string;
  title: string;
  summary: string;
  overallProgress: number;
  metrics: Array<{
    label: string;
    target: string;
    current?: string;
    progress?: number;
    note?: string;
  }>;
  recommendedFoods: string[];
  notes: string[];
}

type ExtendedPlan = HealthGoalPlan & {
  goalTitle: string;
  color: string;
  id: number;
};

interface GoalCardProps {
  plan: ExtendedPlan;
}

export default function GoalCard({ plan }: GoalCardProps) {
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
          <MetricRow
            key={metric.label}
            metric={metric}
            color={plan.color || Colors.primary}
          />
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
}

const styles = StyleSheet.create({
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
});
