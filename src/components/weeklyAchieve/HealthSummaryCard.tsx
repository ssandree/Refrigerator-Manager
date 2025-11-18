import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  activityLabelMap,
  mockUserProfile,
} from "../../data/mockHealthMetrics";
import { Colors, commonStyles, FontSizes } from "../../styles/common";

interface HealthSummaryCardProps {
  bmr: number;
  tdee: number;
}

export default function HealthSummaryCard({
  bmr,
  tdee,
}: HealthSummaryCardProps) {
  return (
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
