import React, { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFavoriteRecipeStore } from "../../../stores/useFavoriteRecipeStore";
import { useFridgeStore } from "../../../stores/useFoodStore";
import { useStatisticsStore } from "../../../stores/useStatisticsStore";
import { Colors, createShadowStyle } from "../../../styles/common";
import { tabsStyles } from "../../../styles/tabs";

const statsCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

interface StatsSectionProps {
  onWeeklyAchievePress?: () => void;
}

export default function StatsSection({
  onWeeklyAchievePress,
}: StatsSectionProps) {
  const foods = useFridgeStore((state) => state.foods);
  const favoriteRecipes = useFavoriteRecipeStore(
    (state) => state.favoriteRecipes
  );
  const mealStats = useStatisticsStore((state) => state.mealStats);
  const fetchMealStats = useStatisticsStore((state) => state.fetchMealStats);
  const statisticsLoading = useStatisticsStore((state) => state.isLoading);

  // 등록된 재료 개수
  const registeredFoodsCount = foods.length;

  // 즐겨찾기 레시피 개수
  const favoriteRecipesCount = favoriteRecipes.length;

  // 식사 통계 로드
  useEffect(() => {
    fetchMealStats();
  }, [fetchMealStats]);

  // 전체 식사 개수: 통계 API에서 가져오기
  const totalMealCount = useMemo(() => {
    // 통계 API에서 전체 식사 개수를 가져올 수 있으면 사용
    if (mealStats?.totalMeals !== undefined) {
      return mealStats.totalMeals;
    }
    // 로딩 중이거나 데이터가 없으면 0 표시
    return 0;
  }, [mealStats]);

  return (
    <View style={[tabsStyles.section, { marginTop: 24 }]}>
      <View style={styles.sectionHeader}>
        <Text style={tabsStyles.sectionTitle}>📊 나의 통계</Text>
      </View>
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{registeredFoodsCount}</Text>
          <Text style={styles.statLabel}>등록된 재료</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{favoriteRecipesCount}</Text>
          <Text style={styles.statLabel}>즐겨찾기 레시피</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {statisticsLoading ? "-" : totalMealCount}
          </Text>
          <Text style={styles.statLabel}>전체 식사</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weeklyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  weeklyButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    ...statsCardShadow,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
