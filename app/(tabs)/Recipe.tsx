import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import RecipeCard from "../../src/components/RecipeCard";
import RecipeFilterModal from "../../src/components/tabs/recipe/RecipeFilterModal";
import { useAutoLoadData } from "../../src/hooks/useAutoLoadData";
import { useModalAnimation } from "../../src/hooks/useModalAnimation";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useToggleArray } from "../../src/hooks/useToggleArray";
import { useFavoriteRecipeStore } from "../../src/stores/useFavoriteRecipeStore";
import { useRecipeStore } from "../../src/stores/useRecipeStore";
import { Colors } from "../../src/styles/common";
import { filterRecipes } from "../../src/utils/recipeFilter";

export default function RecipeScreen() {
  const recipes = useRecipeStore((s) => s.recipes);
  const loadRecipes = useRecipeStore((s) => s.loadRecipes);
  const isLoading = useRecipeStore((s) => s.isLoading);
  const favoriteRecipes = useFavoriteRecipeStore((s) => s.favoriteRecipes);
  const loadFavorites = useFavoriteRecipeStore((s) => s.loadFavorites);
  const isLoadingFavorites = useFavoriteRecipeStore((s) => s.isLoading);
  const lastSyncedAtFavorites = useFavoriteRecipeStore((s) => s.lastSyncedAt);
  const [refreshing, setRefreshing] = useState(false);
  const toggleFavorite = useFavoriteRecipeStore((s) => s.toggleFavorite);

  useStoreWithError(useRecipeStore);
  useStoreWithError(useFavoriteRecipeStore);
  useAutoLoadData(recipes, isLoading, loadRecipes);
  useAutoLoadData(favoriteRecipes, isLoadingFavorites, loadFavorites, {
    checkLastSynced: true,
    lastSyncedAt: lastSyncedAtFavorites,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([loadRecipes(true), loadFavorites(true)]);
    } finally {
      setRefreshing(false);
    }
  }, [loadRecipes, loadFavorites]);

  const params = useLocalSearchParams<{ q?: string; ingredients?: string }>();
  const [searchQuery, setSearchQuery] = useState<string>(
    (params.q as string) || ""
  );

  // 모달 애니메이션
  const { visible, slideAnim, showModal, hideModal } = useModalAnimation();

  // 상세 필터 상태
  // URL 파라미터에서 재료 목록을 받아서 초기화
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    () => {
      if (params.ingredients) {
        try {
          const parsed = JSON.parse(params.ingredients as string);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    }
  );
  const [includeExpiring, setIncludeExpiring] = useState<boolean>(false);
  const [selectedCookingTimes, setSelectedCookingTimes] = useState<string[]>(
    []
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    []
  );
  // 초기 열량 범위를 넓게 설정하여 모든 레시피가 포함되도록 함
  const [calorieRange, setCalorieRange] = useState<[number, number]>([
    0, 10000,
  ]);

  // 토글 함수들
  const toggleIngredient = useToggleArray(setSelectedIngredients);
  const toggleCookingTime = useToggleArray(setSelectedCookingTimes);
  const toggleDifficulty = useToggleArray(setSelectedDifficulties);

  // 필터 초기화
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedIngredients([]);
    setIncludeExpiring(false);
    setSelectedCookingTimes([]);
    setSelectedDifficulties([]);
    setCalorieRange([0, 10000]);
  };

  // 필터 옵션 객체 (useMemo로 최적화)
  const filterOptions = useMemo(
    () => ({
      searchQuery,
      selectedIngredients,
      includeExpiring,
      selectedCookingTimes,
      selectedDifficulties,
      calorieRange,
    }),
    [
      searchQuery,
      selectedIngredients,
      includeExpiring,
      selectedCookingTimes,
      selectedDifficulties,
      calorieRange,
    ]
  );

  // 필터링된 레시피 목록 (필터 옵션이 변경될 때만 재계산)
  const filteredRecipes = useMemo(() => {
    return filterRecipes(recipes, filterOptions);
  }, [recipes, filterOptions]);

  return (
    <View style={styles.container}>
      {/* 기본 헤더 사용 (tabs/_layout.tsx) */}

      {/* 검색 및 필터 섹션 */}
      <View style={styles.filterSection}>
        {/* 검색창 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="레시피 이름으로 검색..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* 선택된 필터 조건 캐러셀 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsContainer}
          contentContainerStyle={styles.filterChipsContent}
        >
          {/* 재료 필터 칩 */}
          {selectedIngredients.length > 0 && (
            <TouchableOpacity style={styles.filterChip} onPress={showModal}>
              <Text style={styles.filterChipText}>
                🥬 재료 {selectedIngredients.length}개
              </Text>
            </TouchableOpacity>
          )}

          {/* 요리 시간 필터 칩 */}
          {selectedCookingTimes.length > 0 && (
            <TouchableOpacity style={styles.filterChip} onPress={showModal}>
              <Text style={styles.filterChipText}>
                ⏰{" "}
                {selectedCookingTimes
                  .map((time) => time.split(" ")[0])
                  .join(", ")}
              </Text>
            </TouchableOpacity>
          )}

          {/* 난이도 필터 칩 */}
          {selectedDifficulties.length > 0 && (
            <TouchableOpacity style={styles.filterChip} onPress={showModal}>
              <Text style={styles.filterChipText}>
                🎯 {selectedDifficulties.join(", ")}
              </Text>
            </TouchableOpacity>
          )}

          {/* 열량 필터 칩 */}
          {(calorieRange[0] > 0 || calorieRange[1] < 1000) && (
            <TouchableOpacity style={styles.filterChip} onPress={showModal}>
              <Text style={styles.filterChipText}>
                🔥 {calorieRange[0]}-{calorieRange[1]}kcal
              </Text>
            </TouchableOpacity>
          )}

          {/* 임박재료 필터 칩 */}
          {includeExpiring && (
            <TouchableOpacity style={styles.filterChip} onPress={showModal}>
              <Text style={styles.filterChipText}>⚠️ 임박재료</Text>
            </TouchableOpacity>
          )}

          {/* 상세 필터 설정 버튼 */}
          <TouchableOpacity style={styles.addFilterButton} onPress={showModal}>
            <Text style={styles.addFilterButtonText}>+ 필터 추가</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 레시피 목록 */}
      {isLoading && recipes.length === 0 ? (
        <LoadingSpinner message="레시피를 불러오는 중..." fullScreen />
      ) : filteredRecipes.length === 0 && !isLoading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            선택한 조건에 맞는 레시피가 없습니다.
          </Text>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={clearAllFilters}
          >
            <Text style={styles.clearFiltersText}>필터 초기화</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.recipesList}
          contentContainerStyle={styles.recipesListContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.resultsCount}>
            {filteredRecipes.length}개의 레시피를 찾았습니다
          </Text>

          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => {
                router.push({
                  pathname: "/_pages/RecipeDetail",
                  params: { id: recipe.id, name: recipe.recipeName },
                });
              }}
              onFavoriteToggle={async () => {
                await toggleFavorite(recipe);
                // 즐겨찾기 상태 변경 후 목록 새로고침
                await loadFavorites(true);
              }}
            />
          ))}
        </ScrollView>
      )}

      {/* 상세 필터 모달 */}
      <RecipeFilterModal
        visible={visible}
        onClose={hideModal}
        slideAnim={slideAnim}
        selectedIngredients={selectedIngredients}
        onToggleIngredient={toggleIngredient}
        includeExpiring={includeExpiring}
        onToggleExpiring={() => setIncludeExpiring(!includeExpiring)}
        selectedCookingTimes={selectedCookingTimes}
        onToggleCookingTime={toggleCookingTime}
        selectedDifficulties={selectedDifficulties}
        onToggleDifficulty={toggleDifficulty}
        calorieRange={calorieRange}
        onSetCalorieRange={setCalorieRange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterSection: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: Colors.background,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipsContainer: {
    marginBottom: 12,
  },
  filterChipsContent: {
    paddingHorizontal: 4,
    alignItems: "center",
  },
  filterChip: {
    backgroundColor: Colors.fridge,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.secondaryLight,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.secondaryDark,
    fontWeight: "500",
  },
  addFilterButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  addFilterButtonText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: "600",
  },
  recipesList: {
    flex: 1,
    paddingTop: 8,
  },
  recipesListContent: {
    paddingBottom: 20, // 하단 여백
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textTertiary,
    textAlign: "center",
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: "600",
  },
});
