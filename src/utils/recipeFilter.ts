import { Recipe } from "../data/mockRecipes";

interface RecipeFilterOptions {
  searchQuery: string;
  selectedIngredients: string[];
  includeExpiring: boolean;
  selectedCookingTimes: string[];
  selectedDifficulties: string[];
  calorieRange: [number, number];
}

/**
 * 레시피 필터링 함수
 * 여러 필터 조건을 적용하여 레시피를 필터링합니다.
 */
export function filterRecipes(
  recipes: Recipe[],
  options: RecipeFilterOptions
): Recipe[] {
  const {
    searchQuery,
    selectedIngredients,
    includeExpiring,
    selectedCookingTimes,
    selectedDifficulties,
    calorieRange,
  } = options;

  return recipes.filter((recipe) => {
    // 검색어 필터
    if (
      searchQuery &&
      !recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 재료 필터 (tags를 통해 간접적으로 필터링)
    if (selectedIngredients.length > 0) {
      const hasRequiredIngredient = selectedIngredients.some((ingredient) =>
        recipe.tags.some((tag) =>
          tag.toLowerCase().includes(ingredient.toLowerCase())
        )
      );
      if (!hasRequiredIngredient) return false;
    }

    // 마감기한 임박 재료 포함 여부
    if (includeExpiring) {
      // 냉장고 데이터와 연동하여 임박 재료를 사용하는 레시피만 필터링 필요
    }

    // 요리 시간 필터
    if (selectedCookingTimes.length > 0) {
      const matchesTime = selectedCookingTimes.some((time) => {
        const timeCategory = time.split(" ")[0];
        if (timeCategory === "짧음" && recipe.time <= 30) return true;
        if (timeCategory === "중간" && recipe.time > 30 && recipe.time <= 60)
          return true;
        if (timeCategory === "긴" && recipe.time > 60) return true;
        return false;
      });
      if (!matchesTime) return false;
    }

    // 난이도 필터
    if (
      selectedDifficulties.length > 0 &&
      !selectedDifficulties.includes(recipe.difficulty)
    ) {
      return false;
    }

    // 열량 필터
    if (
      recipe.calories < calorieRange[0] ||
      recipe.calories > calorieRange[1]
    ) {
      return false;
    }

    return true;
  });
}

/**
 * 필터가 활성화되어 있는지 확인
 */
export function hasActiveFilters(options: RecipeFilterOptions): boolean {
  const {
    searchQuery,
    selectedIngredients,
    includeExpiring,
    selectedCookingTimes,
    selectedDifficulties,
    calorieRange,
  } = options;

  return (
    searchQuery.trim() !== "" ||
    selectedIngredients.length > 0 ||
    includeExpiring ||
    selectedCookingTimes.length > 0 ||
    selectedDifficulties.length > 0 ||
    calorieRange[0] > 0 ||
    calorieRange[1] < 10000 // 초기값이 [0, 10000]이므로 10000보다 작을 때만 활성화된 것으로 간주
  );
}
