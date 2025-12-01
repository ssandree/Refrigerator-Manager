import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DailyDietCard from "../../src/components/tabs/meal/MealCard";
import TodayTotal from "../../src/components/tabs/meal/todaytotal";
import { useDateStore } from "../../src/stores/useDateStore";
import { useFridgeStore } from "../../src/stores/useFoodStore";
import { useMealStore } from "../../src/stores/useMealStore";
import { useRecipeStore } from "../../src/stores/useRecipeStore";
import { Colors, FontSizes } from "../../src/styles/common";
import { Food } from "../../src/types/food";
import { addDaysInKorea } from "../../src/utils/dateUtils";

export default function Meal() {
  // 한국 시간 기준 오늘 날짜를 전역 스토어에서 가져옴
  const todayISO = useDateStore((s) => s.todayISO);

  const [selectedDateISO, setSelectedDateISO] = useState(() => todayISO);

  // todayISO가 변경되면 selectedDateISO도 업데이트 (자정 지나면)
  useEffect(() => {
    if (selectedDateISO === todayISO) return;
    // 선택된 날짜가 오늘이었으면 오늘로 업데이트
    const prevToday = addDaysInKorea(todayISO, -1);
    if (selectedDateISO === prevToday) {
      setSelectedDateISO(todayISO);
    }
  }, [todayISO, selectedDateISO]);

  const selectedDateLabel = useMemo(() => {
    // selectedDateISO를 직접 파싱하여 한국 시간 기준으로 포맷팅
    const [year, month, day] = selectedDateISO.split("-").map(Number);
    // 한국 시간대(UTC+9) 기준으로 Date 객체 생성
    const date = new Date(Date.UTC(year, month - 1, day, 9, 0, 0));
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      timeZone: "UTC",
    });
  }, [selectedDateISO]);

  const isOneWeekAgo = useMemo(() => {
    const oneWeekAgoIso = addDaysInKorea(todayISO, -7);
    return selectedDateISO === oneWeekAgoIso;
  }, [selectedDateISO, todayISO]);

  const isTodayOrAfter = useMemo(() => {
    return selectedDateISO >= todayISO;
  }, [selectedDateISO, todayISO]);

  // MealStore와 연결: 선택된 날짜의 식단을 서버에서 로드
  const meals = useMealStore((s) => s.meals);
  const removeMeal = useMealStore((s) => s.removeMeal);
  const loadMealsByDate = useMealStore((s) => s.getMealsByDate);
  const mealsLoading = useMealStore((s) => s.isLoading);
  const mealsError = useMealStore((s) => s.error);

  const foods = useFridgeStore((s) => s.foods);
  const recipes = useRecipeStore((s) => s.recipes);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);

  useEffect(() => {
    loadMealsByDate(selectedDateISO);
  }, [selectedDateISO, loadMealsByDate]);

  // 해당 날짜의 식사만 필터링
  const todayMeals = useMemo(() => {
    return meals.filter((m) => {
      const mealDate = m.consumedAt.split("T")[0];
      return mealDate === selectedDateISO;
    });
  }, [meals, selectedDateISO]);

  const sections = [
    { key: "breakfast", title: "🌅 아침" },
    { key: "lunch", title: "☀️ 점심" },
    { key: "dinner", title: "🌙 저녁" },
    { key: "snack", title: "🍎 간식" },
  ] as const;

  const openEditScreen = (mealId: string) => {
    router.push({
      pathname: "/_pages/RegisterMeal",
      params: { mealId },
    });
  };

  const confirmDeleteMeal = (mealId: string) => {
    Alert.alert("식사 삭제", "정말로 이 식사를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await removeMeal(mealId);
        },
      },
    ]);
  };

  const handleLongPress = (mealId: string) => {
    setSelectedMealId(mealId);
    setActionModalVisible(true);
  };

  const handleEdit = () => {
    if (selectedMealId) {
      setActionModalVisible(false);
      openEditScreen(selectedMealId);
    }
  };

  const handleDelete = () => {
    if (!selectedMealId) return;
    setActionModalVisible(false);
    confirmDeleteMeal(selectedMealId);
  };

  const getRecipeForMeal = (recipeId: string | null | undefined) => {
    if (!recipeId) return undefined;
    return recipes.find((recipe) => recipe.id === recipeId);
  };

  const getFoodsForMeal = (meal: { foodIds: string[] }): Food[] =>
    meal.foodIds
      .map((id) => foods.find((food) => food.id === id))
      .filter((food): food is Food => Boolean(food));

  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const goPrevDay = () => {
    if (isOneWeekAgo) return; // 일주일 전이면 더 이상 이전으로 이동 불가

    // 한국 시간 기준으로 하루 전 날짜 계산
    const prevDateISO = addDaysInKorea(selectedDateISO, -1);
    setSelectedDateISO(prevDateISO);
  };

  const goNextDay = () => {
    // 한국 시간 기준으로 하루 후 날짜 계산
    const nextDateISO = addDaysInKorea(selectedDateISO, 1);

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

        {/* 식사 카드 리스트 */}
        {sections.map((sec) => {
          const items = todayMeals.filter((m) => m.mealType === sec.key);
          if (items.length === 0) return null;

          return (
            <View key={sec.key} style={styles.mealSection}>
              <Text style={styles.mealTitle}>{sec.title}</Text>
              {items.map((meal) => {
                const recipe = getRecipeForMeal(meal.recipeId);

                return (
                  <DailyDietCard
                    key={meal.id}
                    recipeName={recipe?.recipeName || meal.notes || "자유식"}
                    calories={recipe?.calories ?? 0}
                    protein={recipe?.protein ?? 0}
                    carbs={recipe?.carbohydrates ?? 0}
                    fat={recipe?.fat ?? 0}
                    time={formatTime(meal.consumedAt)}
                    onLongPress={() => handleLongPress(meal.id)}
                    onEdit={() => openEditScreen(meal.id)}
                    onDelete={() => confirmDeleteMeal(meal.id)}
                  />
                );
              })}
            </View>
          );
        })}

        {/* 선택된 날짜의 총계 */}
        <TodayTotal dateISO={selectedDateISO} />

        {/* 액션 모달 */}
        <Modal
          visible={actionModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setActionModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setActionModalVisible(false)}
          >
            <View style={styles.actionModal}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleEdit}
              >
                <Text style={styles.actionButtonText}>수정</Text>
              </TouchableOpacity>
              <View style={styles.actionDivider} />
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDelete}
              >
                <Text
                  style={[styles.actionButtonText, styles.deleteButtonText]}
                >
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionModal: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  deleteButtonText: {
    color: Colors.error,
  },
  actionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
});
