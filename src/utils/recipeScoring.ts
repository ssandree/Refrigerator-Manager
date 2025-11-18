import { Ingredient } from "../data/mockFood";
import { Recipe } from "../data/mockRecipes";

/**
 * 유통기한까지 남은 일수 계산 (디데이)
 */
export function calculateDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 디데이별 점수 반환
 * D-1: 2.4, D-2: 2.2, D-3: 2.0
 * D-4: 1.2, D-5: 1.1
 * D-6: 1.0, D-7: 0.8
 * D-7 이상: 0.5
 * 만료됨: 0
 */
export function getExpiryScore(daysUntilExpiry: number): number {
  if (daysUntilExpiry < 0) {
    return 0; // 만료된 재료
  }

  switch (daysUntilExpiry) {
    case 1:
      return 2.4;
    case 2:
      return 2.2;
    case 3:
      return 2.0;
    case 4:
      return 1.2;
    case 5:
      return 1.1;
    case 6:
      return 1.0;
    case 7:
      return 0.8;
    default:
      // D-7 이상
      return 0.5;
  }
}

/**
 * 재료 이름 매칭 (유사도 고려)
 * 정확히 일치하거나 부분 일치하는지 확인
 */
export function isIngredientMatch(
  recipeIngredient: string,
  fridgeIngredientName: string
): boolean {
  const normalize = (str: string) => str.trim().toLowerCase();
  const recipe = normalize(recipeIngredient);
  const fridge = normalize(fridgeIngredientName);

  // 정확히 일치
  if (recipe === fridge) {
    return true;
  }

  // 부분 일치 (레시피 재료가 냉장고 재료에 포함되거나 그 반대)
  if (recipe.includes(fridge) || fridge.includes(recipe)) {
    return true;
  }

  return false;
}

/**
 * 레시피에 필요한 재료 중 냉장고에 있는 재료 찾기
 */
export function findMatchingIngredients(
  recipe: Recipe,
  fridgeIngredients: Ingredient[]
): { ingredient: Ingredient; expiryScore: number }[] {
  if (!recipe.requiredIngredients || recipe.requiredIngredients.length === 0) {
    return [];
  }

  const matches: { ingredient: Ingredient; expiryScore: number }[] = [];

  for (const requiredIngredient of recipe.requiredIngredients) {
    for (const fridgeIngredient of fridgeIngredients) {
      if (isIngredientMatch(requiredIngredient, fridgeIngredient.name)) {
        const daysUntilExpiry = calculateDaysUntilExpiry(
          fridgeIngredient.expiryDate
        );
        const expiryScore = getExpiryScore(daysUntilExpiry);

        matches.push({
          ingredient: fridgeIngredient,
          expiryScore,
        });

        // 한 재료는 한 번만 매칭 (첫 번째 매칭만 사용)
        break;
      }
    }
  }

  return matches;
}

/**
 * 레시피 점수 계산
 * - 유통기한 점수: 매칭된 재료들의 유통기한 점수 합계
 * - 재료 매칭 점수: 매칭된 재료 개수 / 필요한 재료 개수
 * - 최종 점수: 유통기한 점수 + (재료 매칭 점수 * 10)
 */
export function calculateRecipeScore(
  recipe: Recipe,
  fridgeIngredients: Ingredient[]
): {
  score: number;
  expiryScore: number;
  matchScore: number;
  matchedCount: number;
  totalRequired: number;
  matchedIngredients: { ingredient: Ingredient; expiryScore: number }[];
} {
  const matchedIngredients = findMatchingIngredients(recipe, fridgeIngredients);

  // 유통기한 점수 합계
  const expiryScore = matchedIngredients.reduce(
    (sum, match) => sum + match.expiryScore,
    0
  );

  // 재료 매칭 점수
  const totalRequired =
    recipe.requiredIngredients?.length || recipe.totalIngredients;
  const matchedCount = matchedIngredients.length;
  const matchScore = totalRequired > 0 ? matchedCount / totalRequired : 0;

  // 최종 점수: 유통기한 점수 + (재료 매칭 점수 * 10)
  // 재료 매칭 점수에 10을 곱하여 비중을 높임
  const finalScore = expiryScore + matchScore * 10;

  return {
    score: finalScore,
    expiryScore,
    matchScore,
    matchedCount,
    totalRequired,
    matchedIngredients,
  };
}

/**
 * 레시피 목록에 점수를 부여하고 정렬
 */
export function scoreAndSortRecipes(
  recipes: Recipe[],
  fridgeIngredients: Ingredient[]
): (Recipe & {
  score: number;
  scoreDetails: ReturnType<typeof calculateRecipeScore>;
})[] {
  return recipes
    .map((recipe) => {
      const scoreDetails = calculateRecipeScore(recipe, fridgeIngredients);
      return {
        ...recipe,
        score: scoreDetails.score,
        scoreDetails,
      };
    })
    .sort((a, b) => b.score - a.score); // 점수 높은 순으로 정렬
}
