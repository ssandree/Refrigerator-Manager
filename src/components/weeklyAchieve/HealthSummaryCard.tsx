import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { activityLabelMap } from "../../data/mockHealthMetrics";
import { Colors, commonStyles, FontSizes } from "../../styles/common";

interface HealthSummaryCardProps {
  bmr: number;
  tdee: number;
  sex?: string | null;
  age?: number | null;
  weight?: number | null;
  height?: number | null;
  activityLevel?: string | null;
}

// 활동 레벨을 mockHealthMetrics의 ActivityLevel 타입으로 변환
function normalizeActivityLevel(
  activityLevel?: string | null
): "sedentary" | "light" | "moderate" | "active" | "veryActive" | null {
  if (!activityLevel) return null;
  const normalized = activityLevel.toLowerCase();
  if (normalized === "verylow" || normalized === "sedentary")
    return "sedentary";
  if (normalized === "low" || normalized === "light") return "light";
  if (normalized === "medium" || normalized === "moderate") return "moderate";
  if (normalized === "high" || normalized === "active") return "active";
  if (normalized === "veryhigh" || normalized === "veryactive")
    return "veryActive";
  return null;
}

export default function HealthSummaryCard({
  bmr,
  tdee,
  sex,
  age,
  weight,
  height,
  activityLevel,
}: HealthSummaryCardProps) {
  const normalizedActivityLevel = normalizeActivityLevel(activityLevel);
  const sexLabel = sex === "male" || sex === "남성" ? "남성" : "여성";
  const activityLabel = normalizedActivityLevel
    ? activityLabelMap[normalizedActivityLevel]
    : "정보 없음";

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>이번 주 건강 요약</Text>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>기초대사량 (BMR)</Text>
          <Text style={styles.summaryValue}>
            {bmr > 0 ? `${Math.round(bmr)} kcal` : "정보 없음"}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>유지 칼로리 (TDEE)</Text>
          <Text style={styles.summaryValue}>
            {tdee > 0 ? `${Math.round(tdee)} kcal` : "정보 없음"}
          </Text>
        </View>
      </View>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>신체 정보</Text>
          <Text style={styles.summaryValue}>
            {sex && age ? `${sexLabel} · ${age}세` : "정보 없음"}
          </Text>
          {(height || weight) && (
            <Text style={styles.summarySubValue}>
              {height ? `${Math.round(height)}cm` : ""}
              {height && weight ? " · " : ""}
              {weight ? `${Math.round(weight)}kg` : ""}
            </Text>
          )}
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>활동지수</Text>
          <Text style={styles.summaryValue}>{activityLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
