// Dashboard 관련 API 서비스
import type { Food } from "../types/food";
import type { Meal } from "../types/meal";
import type { Recipe } from "../types/recipe";
import apiClient, { ApiResponse } from "./apiClient";

/**
 * 활동 레벨 문자열을 숫자로 변환
 * @param activityLevel - 활동 레벨 문자열 ("veryLow", "low", "medium", "high", "veryHigh" 등)
 * @returns 활동 계수 (1.2, 1.375, 1.55, 1.725, 1.9)
 */
export function convertActivityLevelToNumber(
  activityLevel?: string | null
): number {
  if (!activityLevel) return 1.2; // 기본값: 거의 활동 없음

  const normalized = activityLevel.toLowerCase();
  if (normalized === "verylow" || normalized === "sedentary") return 1.2;
  if (normalized === "low" || normalized === "light") return 1.375;
  if (normalized === "medium" || normalized === "moderate") return 1.55;
  if (normalized === "high" || normalized === "active") return 1.725;
  if (normalized === "veryhigh" || normalized === "veryactive") return 1.9;

  return 1.2; // 기본값
}

// -----------------------------
// Home Dashboard (FE 타입)
// -----------------------------
export interface TodayNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface HomeDashboard {
  // 유통기한 임박 재료 목록
  expiringIngredients: Food[];
  // 추천 레시피 목록
  recipeRecommendations: Recipe[];
  // 오늘 등록된 식단 목록
  todayMeals: Meal[];
  todayNutrition: TodayNutrition;
}

class DashboardService {
  private readonly basePath = "/dashboard";

  /**
   * 홈 화면 대시보드 조회
   * GET /dashboard/home
   */
  async getTodayDashboard(): Promise<ApiResponse<HomeDashboard>> {
    return await apiClient.get<HomeDashboard>(`${this.basePath}/home`);
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
