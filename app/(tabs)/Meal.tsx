import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MealCardList from "../../src/components/tabs/meal/MealCardList";
import TodayTotal from "../../src/components/tabs/meal/todaytotal";
import { Colors, createShadowStyle } from "../../src/styles/common";

const summaryCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

export default function Meal() {
  const insets = useSafeAreaInsets();
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

  const isToday = useMemo(() => {
    const todayIso = new Date().toISOString().split("T")[0];
    return selectedDateISO === todayIso;
  }, [selectedDateISO]);

  const isOneWeekAgo = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const oneWeekAgoIso = oneWeekAgo.toISOString().split("T")[0];
    return selectedDateISO === oneWeekAgoIso;
  }, [selectedDateISO]);

  const goPrevDay = () => {
    if (isOneWeekAgo) return; // 일주일 전이면 더 이상 이전으로 이동 불가
    const d = new Date(selectedDateISO + "T00:00:00");
    d.setDate(d.getDate() - 1);
    setSelectedDateISO(d.toISOString().split("T")[0]);
  };

  const goNextDay = () => {
    if (isToday) return; // 오늘이면 더 이상 다음으로 이동 불가
    const d = new Date(selectedDateISO + "T00:00:00");
    d.setDate(d.getDate() + 1);
    setSelectedDateISO(d.toISOString().split("T")[0]);
  };

  return (
    <View style={styles.container}>
      {/* 기본 헤더 사용 (tabs/_layout.tsx) */}

      {/* 날짜 헤더 (좌/우 화살표) */}
      <View style={[styles.dateHeader, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.dateArrow}
          onPress={goPrevDay}
          disabled={isOneWeekAgo}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={isOneWeekAgo ? "#CCC" : "#666"}
          />
        </TouchableOpacity>
        <Text style={styles.date}>{selectedDateLabel}</Text>
        <TouchableOpacity
          style={styles.dateArrow}
          onPress={goNextDay}
          disabled={isToday}
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={isToday ? "#CCC" : "#666"}
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
          onPress={() => router.push("/_pages/RegisterMeal" as any)}
        >
          <Text style={styles.addMealButtonText}>+ 식사 추가</Text>
        </TouchableOpacity>

        {/* 리스트 분리 컴포넌트 */}
        <MealCardList dateISO={selectedDateISO} />
        {/* 오늘의 총계 */}
        <TodayTotal />
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
    paddingVertical: 8,
    borderBottomWidth: 1,
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
    padding: 8,
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
