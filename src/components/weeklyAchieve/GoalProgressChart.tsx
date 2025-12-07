import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";
import { Colors, FontSizes } from "../../styles/common";

interface GoalProgressChartProps {
  goals: Array<{
    id: number;
    title: string;
    progress: number;
    color: string;
  }>;
}

export default function GoalProgressChart({ goals }: GoalProgressChartProps) {
  const chartData = useMemo(() => {
    return goals.map((goal) => ({
      ...goal,
      progressPercent: Math.min(
        100,
        Math.max(0, Math.round(goal.progress * 100))
      ),
    }));
  }, [goals]);

  const overallProgress = useMemo(() => {
    if (chartData.length === 0) return 0;
    const total = chartData.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.min(
      100,
      Math.max(0, Math.round((total / chartData.length) * 100))
    );
  }, [chartData]);

  // 원형 차트 크기
  const size = 120;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>전체 목표 달성률</Text>

      {/* 2열 레이아웃: 원형 차트와 막대 그래프 */}
      <View style={styles.chartRow}>
        {/* 전체 달성률 원형 차트 */}
        <View style={styles.overallChartContainer}>
          <Svg width={size} height={size} style={styles.chart}>
            {/* 배경 원 */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={Colors.borderLight}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* 진행률 원 */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={Colors.primary}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference - (overallProgress / 100) * circumference
              }
              strokeLinecap="round"
              transform={`rotate(-90 ${center} ${center})`}
            />
            {/* 중앙 텍스트 */}
            <SvgText
              x={center}
              y={center - 8}
              fontSize={FontSizes.xl}
              fontWeight="700"
              fill={Colors.textPrimary}
              textAnchor="middle"
            >
              {overallProgress}%
            </SvgText>
            <SvgText
              x={center}
              y={center + 12}
              fontSize={FontSizes.sm}
              fill={Colors.textSecondary}
              textAnchor="middle"
            >
              달성
            </SvgText>
          </Svg>
        </View>

        {/* 목표별 막대 그래프 */}
        <View style={styles.barChartContainer}>
          {chartData.map((goal) => (
            <View key={goal.id} style={styles.barItem}>
              <View style={styles.barLabelContainer}>
                <View
                  style={[styles.colorDot, { backgroundColor: goal.color }]}
                />
                <Text style={styles.barLabel} numberOfLines={1}>
                  {goal.title}
                </Text>
                <Text style={styles.barPercent}>{goal.progressPercent}%</Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${goal.progressPercent}%`,
                      backgroundColor: goal.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  chartRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  overallChartContainer: {
    flex: 1,
    alignItems: "center",
  },
  chart: {
    transform: [{ rotate: "0deg" }],
  },
  subtitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  barChartContainer: {
    flex: 1,
    gap: 16,
  },
  barItem: {
    marginBottom: 4,
  },
  barLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  barLabel: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  barPercent: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.textSecondary,
    minWidth: 50,
    textAlign: "right",
  },
  barTrack: {
    height: 12,
    backgroundColor: Colors.borderLight,
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },
});
