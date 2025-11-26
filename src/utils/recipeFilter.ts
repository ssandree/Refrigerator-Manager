import { Recipe } from "../types/recipe";

interface RecipeFilterOptions {
  searchQuery: string;
  selectedIngredients: string[];
  includeExpiring: boolean;
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
  const { searchQuery, selectedIngredients, includeExpiring, calorieRange } =
    options;

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
  const { searchQuery, selectedIngredients, includeExpiring, calorieRange } =
    options;

  return (
    searchQuery.trim() !== "" ||
    selectedIngredients.length > 0 ||
    includeExpiring ||
    calorieRange[0] > 0 ||
    calorieRange[1] < 15000 // 초기값이 [0, 15000]이므로 15000보다 작을 때만 활성화된 것으로 간주
  );
}
