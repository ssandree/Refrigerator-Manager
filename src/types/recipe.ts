/**
 * Database column shape for recipes table.
 */
export interface RecipeRecord {
  id: string;
  recipeName: string;
  calories: number;
  healthGoal: number | null;
  imageUrl: string | null;
  requiredfoods: string[] | null;
  carbohydrates: number | null;
  protein: number | null;
  fat: number | null;
  sodium: number | null;
  vitamin_c: number | null;
  vitamin_d: number | null;
  zinc: number | null;
}

/**
 * Client-side recipe model that extends the DB columns with
 * additional optional fields computed on the frontend or provided
 * by other services (e.g. favorite flag, owned ingredient counts).
 */
export interface Recipe extends RecipeRecord {
  description?: string | null;
  time?: number | null;
  timeCategory?: string | null;
  difficulty?: "쉬움" | "보통" | "어려움" | "매우 쉬움" | null;
  tags?: string[];
  ingredientsOwned?: number;
  totalIngredients?: number;
  isFavorite?: boolean;
}

// 백엔드 /recipes/filter 엔드포인트용 필터 파라미터
export interface RecipeFilterParams {
  // 이 재료들을 모두 포함하는 레시피만 조회
  ingredients?: string[];
  // 임박 재료(3일 이내 만료) 포함 레시피만 조회
  expiringOnly?: boolean;
  // 최소 / 최대 칼로리
  minCalories?: number;
  maxCalories?: number;
}
