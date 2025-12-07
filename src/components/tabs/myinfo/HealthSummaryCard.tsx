import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { activityLabelMap } from "../../../data/mockHealthMetrics";
import { authService } from "../../../services/authService";
import { useAuthStore } from "../../../stores/useAuthStore";
import { Colors, FontSizes } from "../../../styles/common";

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

export default function HealthSummaryCard() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const updateUserRef = useRef(updateUser);
  updateUserRef.current = updateUser;

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          updateUserRef.current({
            age: response.data.age ?? null,
            sex: response.data.sex ?? null,
            height: response.data.height ?? null,
            weight: response.data.weight ?? null,
            activityLevel: response.data.activityLevel ?? null,
            bmi: response.data.bmi ?? null,
          });
        }
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };
    loadUserInfo();
  }, []);

  const normalizedActivityLevel = normalizeActivityLevel(user?.activityLevel);
  const activityLabel = normalizedActivityLevel
    ? activityLabelMap[normalizedActivityLevel]
    : "정보 없음";

  return (
    <View style={styles.container}>
      {/* 키, 몸무게, 활동지수 */}
      <View style={styles.summaryCard}>
        <View style={styles.cardContent}>
          <View style={styles.cardItem}>
            <Text style={styles.summaryLabel}>키</Text>
            <Text style={styles.summaryValue}>
              {user?.height ? `${Math.round(user.height)}cm` : "정보 없음"}
            </Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardItem}>
            <Text style={styles.summaryLabel}>몸무게</Text>
            <Text style={styles.summaryValue}>
              {user?.weight ? `${Math.round(user.weight)}kg` : "정보 없음"}
            </Text>
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardItem}>
            <Text style={styles.summaryLabel}>활동지수</Text>
            <Text style={styles.summaryValue}>{activityLabel}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: "100%",
  },
  summaryCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 12,
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  cardItem: {
    flex: 1,
    alignItems: "center",
  },
  cardDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 8,
  },
  summaryLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
    textAlign: "center",
  },
  summaryValue: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
});
