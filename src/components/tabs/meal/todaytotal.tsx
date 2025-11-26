import React, { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNutritionStore } from "../../../stores/useNutritionStore";
import { useStatisticsStore } from "../../../stores/useStatisticsStore";
import { Colors, FontSizes, commonStyles } from "../../../styles/common";

interface TodayTotalProps {
  dateISO?: string; // 선택된 날짜 (ISO 형식: YYYY-MM-DD), 없으면 오늘
}

export default function TodayTotal({ dateISO }: TodayTotalProps) {
  const totals = useNutritionStore((s) => s.totals);
  const setTotals = useNutritionStore((s) => s.setTotals);
  const setDate = useNutritionStore((s) => s.setDate);

  const dailyStats = useStatisticsStore((s) => s.dailyStats);
  const fetchDailyStats = useStatisticsStore((s) => s.fetchDailyStats);
  const statsLoading = useStatisticsStore((s) => s.isLoading);
  const statsError = useStatisticsStore((s) => s.error);

  // 선택된 날짜(또는 오늘) 기준 일일 통계 로드
  useEffect(() => {
    const targetDate = dateISO || new Date().toISOString().split("T")[0];
    fetchDailyStats(targetDate);
  }, [dateISO, fetchDailyStats]);

  // 통계 응답을 NutritionStore의 totals로 반영
  useEffect(() => {
    if (!dailyStats) return;
    setDate(dailyStats.date);
    setTotals({
      calories: dailyStats.calories,
      protein: dailyStats.protein,
      carbs: dailyStats.carbohydrates,
      fat: dailyStats.fat,
      vitaminC: dailyStats.vitamin_c,
      vitaminD: dailyStats.vitamin_d,
      zinc: dailyStats.zinc,
    });
  }, [dailyStats, setDate, setTotals]);

  const nutritionItems = [
    { label: "총 칼로리", value: `${totals.calories}`, unit: "kcal" },
    { label: "단백질", value: `${totals.protein}`, unit: "g" },
    { label: "탄수화물", value: `${totals.carbs}`, unit: "g" },
    { label: "지방", value: `${totals.fat}`, unit: "g" },
  ] as const;

  // 날짜 레이블 생성
  const dateLabel = useMemo(() => {
    const targetDate = dateISO || new Date().toISOString().split("T")[0];
    const date = new Date(targetDate + "T00:00:00");
    const today = new Date();
    const isToday =
      date.toISOString().split("T")[0] === today.toISOString().split("T")[0];
    if (isToday) {
      return "오늘의 총계";
    }
    return `${date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    })}의 총계`;
  }, [dateISO]);

  return (
    <View style={styles.summarySection}>
      <Text style={styles.summaryTitle}>📊 {dateLabel}</Text>
      {statsLoading && (
        <Text style={styles.summaryStatus}>일일 통계를 불러오는 중...</Text>
      )}
      {statsError && <Text style={styles.summaryError}>{statsError}</Text>}
      <View style={[commonStyles.card, styles.summaryCard]}>
        {nutritionItems.map((item, index) => (
          <View
            key={item.label}
            style={[
              styles.summaryItem,
              index < nutritionItems.length - 1 && styles.summaryItemBorder,
            ]}
          >
            <Text style={styles.summaryLabel}>{item.label}</Text>
            <Text style={styles.summaryValue}>
              {item.value} {item.unit}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  summaryStatus: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  summaryError: {
    fontSize: FontSizes.sm,
    color: Colors.error,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  summaryCard: {
    // commonStyles.card를 사용하므로 추가 스타일만 정의
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  summaryLabel: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
