import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
import RecipeCard from "../../src/components/tabs/recipe/RecipeCard";
import RecipeFilterModal from "../../src/components/tabs/recipe/RecipeFilterModal";
import { useAutoLoadData } from "../../src/hooks/useAutoLoadData";
import { useModalAnimation } from "../../src/hooks/useModalAnimation";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useToggleArray } from "../../src/hooks/useToggleArray";
import { useFavoriteRecipeStore } from "../../src/stores/useFavoriteRecipeStore";
import { useRecipeStore } from "../../src/stores/useRecipeStore";
import { Colors } from "../../src/styles/common";
import { Recipe, RecipeFilterParams } from "../../src/types/recipe";
import { logger } from "../../src/utils/logger";

export default function RecipeScreen() {
  const loadDashboardRecommendations = useRecipeStore(
    (s) => s.loadDashboardRecommendations
  );
  const searchRecipes = useRecipeStore((s) => s.searchRecipes);
  const filterRecipes = useRecipeStore((s) => s.filterRecipes);
  const isLoading = useRecipeStore((s) => s.isLoading);
  const favoriteRecipes = useFavoriteRecipeStore((s) => s.favoriteRecipes);
  const loadFavorites = useFavoriteRecipeStore((s) => s.loadFavorites);
  const isLoadingFavorites = useFavoriteRecipeStore((s) => s.isLoading);
  const lastSyncedAtFavorites = useFavoriteRecipeStore((s) => s.lastSyncedAt);
  const [refreshing, setRefreshing] = useState(false);
  const toggleFavorite = useFavoriteRecipeStore((s) => s.toggleFavorite);
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);
  const [skip, setSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);

  // 중복 제거 헬퍼 함수
  const removeDuplicateRecipes = useCallback((recipes: Recipe[]): Recipe[] => {
    const seen = new Set<string>();
    return recipes.filter((recipe) => {
      if (seen.has(recipe.id)) {
        return false;
      }
      seen.add(recipe.id);
      return true;
    });
  }, []);

  useStoreWithError(useRecipeStore);
  useStoreWithError(useFavoriteRecipeStore);

  // loadDashboardRecommendations 함수 참조를 useRef로 저장하여 안정적인 참조 유지
  const loadRecommendationsRef = useRef(loadDashboardRecommendations);
  loadRecommendationsRef.current = loadDashboardRecommendations;

  // 초기 마운트 시 GET /recipes/recommend?limit=30&skip=0 호출
  useEffect(() => {
    logger.log(
      "[Recipe] 컴포넌트 마운트, loadDashboardRecommendations 호출 시작"
    );
    const loadInitialRecipes = async () => {
      try {
        logger.log("[Recipe] loadDashboardRecommendations 호출 전");
        const loadedRecipes = await loadRecommendationsRef.current(30, 0);
        logger.log("[Recipe] loadDashboardRecommendations 완료:", {
          count: loadedRecipes.length,
        });
        setDisplayedRecipes(removeDuplicateRecipes(loadedRecipes));
        setSkip(30);
      } catch (error) {
        logger.error("[Recipe] loadDashboardRecommendations 에러:", error);
        logger.error("[Recipe] 에러 상세:", JSON.stringify(error, null, 2));
      }
    };
    loadInitialRecipes();
  }, [removeDuplicateRecipes]);

  useAutoLoadData(favoriteRecipes, isLoadingFavorites, loadFavorites, {
    checkLastSynced: true,
    lastSyncedAt: lastSyncedAtFavorites,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSkip(0);
    try {
      const loadedRecipes = await loadDashboardRecommendations(30, 0);
      setDisplayedRecipes(removeDuplicateRecipes(loadedRecipes));
      setSkip(30);
      await loadFavorites(true);
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboardRecommendations, loadFavorites, removeDuplicateRecipes]);

  // 레시피 더보기 버튼 핸들러
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const loadedRecipes = await loadDashboardRecommendations(30, skip);
      setDisplayedRecipes((prev) =>
        removeDuplicateRecipes([...prev, ...loadedRecipes])
      );
      setSkip((prev) => prev + 30);
    } catch (error) {
      logger.error("[Recipe] 레시피 더보기 에러:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    loadDashboardRecommendations,
    skip,
    isLoadingMore,
    removeDuplicateRecipes,
  ]);

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
  // 초기 열량 범위를 넓게 설정하여 모든 레시피가 포함되도록 함
  const [calorieRange, setCalorieRange] = useState<[number, number]>([
    0, 15000,
  ]);

  // 토글 함수들
  const toggleIngredient = useToggleArray(setSelectedIngredients);

  // 필터 초기화
  const clearAllFilters = useCallback(async () => {
    setSearchQuery("");
    setSelectedIngredients([]);
    setIncludeExpiring(false);
    setCalorieRange([0, 15000]);
    // 필터 초기화 시 추천 레시피 다시 로드
    setSkip(0);
    const loadedRecipes = await loadDashboardRecommendations(30, 0);
    setDisplayedRecipes(removeDuplicateRecipes(loadedRecipes));
    setSkip(30);
  }, [loadDashboardRecommendations, removeDuplicateRecipes]);

  // 검색 실행 (버튼 클릭 시 호출)
  const handleSearch = useCallback(async () => {
    if (searchQuery.trim() === "") {
      // 검색어가 없으면 추천 레시피 다시 로드
      setSkip(0);
      const loadedRecipes = await loadDashboardRecommendations(30, 0);
      setDisplayedRecipes(removeDuplicateRecipes(loadedRecipes));
      setSkip(30);
      return;
    }

    const results = await searchRecipes(searchQuery.trim());
    setDisplayedRecipes(removeDuplicateRecipes(results));
  }, [
    searchQuery,
    searchRecipes,
    loadDashboardRecommendations,
    removeDuplicateRecipes,
  ]);

  // 필터 적용 (버튼 클릭 시 호출)
  const handleApplyFilters = useCallback(async () => {
    const filterParams: RecipeFilterParams = {};

    if (selectedIngredients.length > 0) {
      filterParams.ingredients = selectedIngredients;
    }
    if (includeExpiring) {
      filterParams.expiringOnly = true;
    }
    if (calorieRange[0] > 0) {
      filterParams.minCalories = calorieRange[0];
    }
    if (calorieRange[1] < 15000) {
      filterParams.maxCalories = calorieRange[1];
    }

    // 필터 조건이 하나라도 있으면 필터 API 호출
    const hasFilters =
      selectedIngredients.length > 0 ||
      includeExpiring ||
      calorieRange[0] > 0 ||
      calorieRange[1] < 15000;

    if (hasFilters) {
      const results = await filterRecipes(filterParams);
      // 검색어도 함께 있는 경우: 필터 후 클라이언트에서 검색어 필터링
      if (searchQuery.trim() !== "") {
        const lowerQuery = searchQuery.trim().toLowerCase();
        const filtered = results.filter((recipe) =>
          recipe.recipeName.toLowerCase().includes(lowerQuery)
        );
        setDisplayedRecipes(removeDuplicateRecipes(filtered));
      } else {
        setDisplayedRecipes(removeDuplicateRecipes(results));
      }
    } else {
      // 필터 조건이 없으면 검색어만 적용하거나 추천 레시피 표시
      if (searchQuery.trim() !== "") {
        await handleSearch();
      } else {
        // 검색어도 없고 필터도 없으면 추천 레시피 다시 로드
        setSkip(0);
        const loadedRecipes = await loadDashboardRecommendations(30, 0);
        setDisplayedRecipes(removeDuplicateRecipes(loadedRecipes));
        setSkip(30);
      }
    }
  }, [
    selectedIngredients,
    includeExpiring,
    calorieRange,
    searchQuery,
    filterRecipes,
    handleSearch,
    loadDashboardRecommendations,
    removeDuplicateRecipes,
  ]);

  // URL 파라미터로 받은 ingredients가 있으면 자동으로 필터 적용 (마운트 시 한 번만)
  // 단, 초기 추천 레시피 로드가 완료된 후에만 실행
  useEffect(() => {
    // displayedRecipes가 이미 로드된 경우에만 필터 적용
    if (params.ingredients && displayedRecipes.length > 0) {
      try {
        const parsed = JSON.parse(params.ingredients as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // 상태 업데이트와 필터 적용을 한 번에 처리
          setSelectedIngredients(parsed);

          // 파라미터로 받은 재료로 직접 필터 API 호출 (상태 업데이트와 분리)
          const filterParams: RecipeFilterParams = { ingredients: parsed };
          filterRecipes(filterParams).then((results) => {
            setDisplayedRecipes(removeDuplicateRecipes(results));
            setSkip(0); // 필터 적용 시 skip 초기화
          });
        }
      } catch {
        // 파싱 실패 시 무시
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.ingredients, displayedRecipes.length]); // displayedRecipes가 로드된 후에만 실행

  // 검색어나 필터가 모두 없을 때 자동으로 추천 레시피 로드
  useEffect(() => {
    const hasNoFilters =
      searchQuery.trim() === "" &&
      selectedIngredients.length === 0 &&
      !includeExpiring &&
      calorieRange[0] === 0 &&
      calorieRange[1] === 15000;

    // 필터가 없고, displayedRecipes가 비어있거나 초기 로드가 완료된 경우에만 실행
    // (초기 마운트 시 중복 호출 방지)
    if (hasNoFilters && displayedRecipes.length > 0) {
      // 이미 추천 레시피가 표시되고 있는지 확인
      // 검색어나 필터가 모두 제거되었을 때만 추천 레시피 다시 로드
      const loadRecommendations = async () => {
        setSkip(0);
        const loadedRecipes = await loadDashboardRecommendations(30, 0);
        setDisplayedRecipes(removeDuplicateRecipes(loadedRecipes));
        setSkip(30);
      };
      loadRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    selectedIngredients,
    includeExpiring,
    calorieRange,
    removeDuplicateRecipes,
  ]);

  // 필터/검색 조건이 활성화되어 있는지 확인 (UI 표시용)
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      selectedIngredients.length > 0 ||
      includeExpiring ||
      calorieRange[0] > 0 ||
      calorieRange[1] < 15000
    );
  }, [searchQuery, selectedIngredients, includeExpiring, calorieRange]);

  // 빈 상태 메시지에 2초 딜레이 적용
  useEffect(() => {
    if (displayedRecipes.length === 0 && !isLoading && hasActiveFilters) {
      // 2초 후에 빈 상태 메시지 표시
      const timer = setTimeout(() => {
        setShowEmptyState(true);
      }, 2000);

      return () => {
        clearTimeout(timer);
        setShowEmptyState(false);
      };
    } else {
      // 레시피가 있거나 로딩 중이면 빈 상태 메시지 숨김
      setShowEmptyState(false);
    }
  }, [displayedRecipes.length, isLoading, hasActiveFilters]);

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
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={isLoading}
          >
            <Text style={styles.searchButtonText}>검색</Text>
          </TouchableOpacity>
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

          {/* 열량 필터 칩 */}
          {(calorieRange[0] > 0 || calorieRange[1] < 15000) && (
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
      {isLoading && displayedRecipes.length === 0 ? (
        <LoadingSpinner message="레시피를 불러오는 중..." fullScreen />
      ) : displayedRecipes.length === 0 &&
        !isLoading &&
        hasActiveFilters &&
        showEmptyState ? (
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
      ) : displayedRecipes.length === 0 &&
        !isLoading &&
        hasActiveFilters &&
        !showEmptyState ? (
        <LoadingSpinner message="레시피를 불러오는 중..." fullScreen />
      ) : (
        <ScrollView
          style={styles.recipesList}
          contentContainerStyle={styles.recipesListContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.resultsCount}>
            {displayedRecipes.length}개의 레시피를 찾았습니다
          </Text>

          {displayedRecipes.map((recipe) => (
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
                await loadFavorites(true);
              }}
            />
          ))}

          {/* 레시피 더보기 버튼 */}
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={handleLoadMore}
            disabled={isLoadingMore || isLoading}
          >
            <Text style={styles.loadMoreButtonText}>
              {isLoadingMore ? "로딩 중..." : "레시피 더보기"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* 상세 필터 모달 */}
      <RecipeFilterModal
        visible={visible}
        onClose={hideModal}
        onApply={handleApplyFilters}
        slideAnim={slideAnim}
        selectedIngredients={selectedIngredients}
        onToggleIngredient={toggleIngredient}
        includeExpiring={includeExpiring}
        onToggleExpiring={() => setIncludeExpiring(!includeExpiring)}
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
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  searchButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
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
  loadMoreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loadMoreButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
});
