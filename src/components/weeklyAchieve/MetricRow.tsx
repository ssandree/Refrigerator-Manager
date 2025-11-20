import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, FontSizes } from "../../styles/common";

// BE에서 받아올 메트릭 타입
export interface HealthGoalMetric {
  label: string;
  target: string;
  current?: string;
  progress?: number;
  note?: string;
}

interface MetricRowProps {
  metric: HealthGoalMetric;
  color?: string;
}

const formatProgress = (value?: number) =>
  value === undefined ? "데이터 없음" : `${Math.round(value * 100)}%`;

export default function MetricRow({
  metric,
  color = Colors.primary,
}: MetricRowProps) {
  const progressPercent = metric.progress ?? 0;
  const progressWidth = Math.min(100, Math.max(0, progressPercent * 100));

  return (
    <View style={styles.metricRow}>
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
        <View style={styles.progressBarContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressWidth}%`,
                  backgroundColor: color,
                },
              ]}
            />
          </View>
        </View>
        <Text style={styles.metricProgressText}>
          {formatProgress(metric.progress)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  metricLabelColumn: {
    flex: 1.2,
  },
  metricValueColumn: {
    flex: 1.2,
  },
  metricProgressColumn: {
    width: 100,
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
  progressBarContainer: {
    width: "100%",
    marginBottom: 4,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  metricProgressText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
});
