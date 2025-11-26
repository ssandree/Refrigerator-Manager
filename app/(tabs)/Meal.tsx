import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MealCardList from "../../src/components/tabs/meal/MealCardList";
import TodayTotal from "../../src/components/tabs/meal/todaytotal";
import { useMealStore } from "../../src/stores/useMealStore";
import { Colors, createShadowStyle } from "../../src/styles/common";

const summaryCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

export default function Meal() {
  const [selectedDateISO, setSelectedDateISO] = useState(
    new Date().toISOString().split("T")[0]
  );

  const selectedDateLabel = useMemo(() => {
    const d = new Date(selectedDateISO + "T00:00:00");
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  }, [selectedDateISO]);

  const todayISO = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const isOneWeekAgo = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const oneWeekAgoIso = oneWeekAgo.toISOString().split("T")[0];
    return selectedDateISO === oneWeekAgoIso;
  }, [selectedDateISO]);

  const isTodayOrAfter = useMemo(() => {
    return selectedDateISO >= todayISO;
  }, [selectedDateISO, todayISO]);

  // MealStore와 연결: 선택된 날짜의 식단을 서버에서 로드
  const loadMealsByDate = useMealStore((s) => s.getMealsByDate);
  const mealsLoading = useMealStore((s) => s.isLoading);
  const mealsError = useMealStore((s) => s.error);

  useEffect(() => {
    // 화면이 열리거나 날짜가 바뀔 때마다 해당 날짜의 식단을 로드
    loadMealsByDate(selectedDateISO);
  }, [selectedDateISO, loadMealsByDate]);

  const goPrevDay = () => {
    if (isOneWeekAgo) return; // 일주일 전이면 더 이상 이전으로 이동 불가

    // ISO 문자열을 직접 파싱하여 날짜 계산 (타임존 문제 방지)
    const [year, month, day] = selectedDateISO.split("-").map(Number);
    const currentDate = new Date(Date.UTC(year, month - 1, day));
    currentDate.setUTCDate(currentDate.getUTCDate() - 1);

    const prevDateISO = currentDate.toISOString().split("T")[0];
    setSelectedDateISO(prevDateISO);
  };

  const goNextDay = () => {
    // 다음 날짜가 오늘 이후면 이동 불가
    const [year, month, day] = selectedDateISO.split("-").map(Number);
    const currentDate = new Date(Date.UTC(year, month - 1, day));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);

    const nextDateISO = currentDate.toISOString().split("T")[0];

    // 다음 날짜가 오늘 이후면 이동 불가
    if (nextDateISO > todayISO) return;

    setSelectedDateISO(nextDateISO);
  };

  return (
    <View style={styles.container}>
      {/* 기본 헤더 사용 (tabs/_layout.tsx) */}

      {/* 날짜 헤더 (좌/우 화살표) */}
      <View style={styles.dateHeader}>
        <TouchableOpacity
          style={styles.dateArrow}
          onPress={goPrevDay}
          disabled={isOneWeekAgo}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={isOneWeekAgo ? "#CCC" : "#666"}
          />
        </TouchableOpacity>
        <Text style={styles.date}>{selectedDateLabel}</Text>
        <TouchableOpacity
          style={styles.dateArrow}
          onPress={goNextDay}
          disabled={isTodayOrAfter}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isTodayOrAfter ? "#CCC" : "#666"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 추가 버튼 */}
        <TouchableOpacity
          style={styles.addMealButton}
          onPress={() =>
            router.push({
              pathname: "/_pages/RegisterMeal",
            } as { pathname: string })
          }
        >
          <Text style={styles.addMealButtonText}>+ 식사 추가</Text>
        </TouchableOpacity>

        {/* 식단 로딩/에러 상태 표시 */}
        {mealsLoading && (
          <Text style={styles.statusText}>식단 정보를 불러오는 중...</Text>
        )}
        {mealsError && <Text style={styles.errorText}>{mealsError}</Text>}

        {/* 리스트 분리 컴포넌트 */}
        <MealCardList dateISO={selectedDateISO} />
        {/* 선택된 날짜의 총계 */}
        <TodayTotal dateISO={selectedDateISO} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // 날짜 헤더
  dateHeader: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    flex: 1,
  },
  dateArrow: {
    padding: 6,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20, // 하단 여백
  },
  mealSection: {
    marginBottom: 24,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 12,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    ...summaryCardShadow,
  },
  statusText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 4,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: 4,
    marginBottom: 4,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  addMealButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  addMealButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
