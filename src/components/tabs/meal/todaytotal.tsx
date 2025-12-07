import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDateStore } from "../../../stores/useDateStore";
import { useNutritionStore } from "../../../stores/useNutritionStore";
import { useStatisticsStore } from "../../../stores/useStatisticsStore";
import { Colors, FontSizes, commonStyles } from "../../../styles/common";
import { parseKoreaDate, toKoreaDateISO } from "../../../utils/dateUtils";

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

  // 한국 시간 기준 오늘 날짜를 전역 스토어에서 가져옴
  const todayISO = useDateStore((s) => s.todayISO);

  // fetchDailyStats 함수 참조를 useRef로 저장하여 안정적인 참조 유지
  const fetchDailyStatsRef = useRef(fetchDailyStats);
  fetchDailyStatsRef.current = fetchDailyStats;

  // 선택된 날짜(또는 오늘) 기준 일일 통계 로드
  useEffect(() => {
    const targetDate = dateISO || todayISO;
    fetchDailyStatsRef.current(targetDate);
    // fetchDailyStats를 의존성 배열에서 제거하고 useRef 사용으로 안정적인 참조 유지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO, todayISO]);

  // 통계 응답을 NutritionStore의 totals로 반영
  useEffect(() => {
    if (!dailyStats) return;

    const targetDate = dateISO || todayISO;
    // 절대 split("T")[0]를 사용하지 않음 - UTC 기준 날짜가 잘못될 수 있음
    const statsDate = toKoreaDateISO(new Date(dailyStats.date));

    // dailyStats의 날짜가 선택된 날짜와 일치하는지 확인
    if (statsDate !== targetDate) return;

    setDate(statsDate);
    // 모든 필드를 명시적으로 설정 (부분 업데이트 방지)
    // API 응답 구조: { date, calories, macros: { ... }, mealCount, mealHistory }
    setTotals({
      calories: Number(dailyStats.calories) || 0,
      protein: Number(dailyStats.macros?.protein) || 0,
      carbs: Number(dailyStats.macros?.carbs) || 0,
      fat: Number(dailyStats.macros?.fat) || 0,
      vitaminC: Number(dailyStats.macros?.vitamin_c) || 0,
      vitaminD: Number(dailyStats.macros?.vitamin_d) || 0,
      zinc: Number(dailyStats.macros?.zinc) || 0,
    });
  }, [dailyStats, dateISO, todayISO, setDate, setTotals]);

  const nutritionItems = [
    { label: "총 칼로리", value: `${totals.calories ?? 0}`, unit: "kcal" },
    { label: "단백질", value: `${totals.protein ?? 0}`, unit: "g" },
    { label: "탄수화물", value: `${totals.carbs ?? 0}`, unit: "g" },
    { label: "지방", value: `${totals.fat ?? 0}`, unit: "g" },
  ] as const;

  // 날짜 레이블 생성
  const dateLabel = useMemo(() => {
    const targetDate = dateISO || todayISO;
    // 한국 시간 기준으로 날짜 파싱
    const date = parseKoreaDate(targetDate);
    const isToday = targetDate === todayISO;
    if (isToday) {
      return "오늘의 총계";
    }
    return `${date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      timeZone: "Asia/Seoul",
    })}의 총계`;
  }, [dateISO, todayISO]);

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
