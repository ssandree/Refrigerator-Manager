// Statistics service for health and meal-related analytics
import apiClient, { ApiResponse } from "./apiClient";

// -----------------------------
// 타입 정의 (BE statistics_schemas.py / API_SPEC 기준)
// -----------------------------

// GET /statistics/meals
export interface MealStatisticsSummary {
  totalMeals: number;
  mealsByType: Record<string, number>;
  averageCalories: number;
  totalCalories: number;
}

// GET /statistics/daily
export interface DailyHealthStats {
  date: string;
  calories: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    vitamin_c: number;
    vitamin_d: number;
    zinc: number;
  };
  mealCount: number;
  mealHistory: Array<{
    id: string;
    consumedAt: string;
    mealType: string | null;
    notes: string | null;
    recipeId: string | null;
  }>;
}

// GET /statistics/weekly
export interface WeeklyDailyStat {
  date: string;
  calories: number;
  meals: number;
  goalsAchieved: boolean;
}

export interface WeeklyHealthStats {
  startDate: string;
  endDate: string;
  dailyStats: WeeklyDailyStat[];
  weeklyTotal: {
    totalCalories: number;
    totalMeals: number;
    averageCalories: number;
    goalsAchievedDays: number;
  };
}

// GET /statistics/nutrition
export interface NutritionStats {
  period: {
    startDate: string;
    endDate: string;
  };
  total: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    vitamin_c: number;
    vitamin_d: number;
    zinc: number;
  };
  average: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    vitamin_c: number;
    vitamin_d: number;
    zinc: number;
  };
  dailyBreakdown: Array<{
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    vitamin_c: number;
    vitamin_d: number;
    zinc: number;
  }>;
}

// GET /statistics/combined-targets
// 건강 목표별 영양소 목표량 (BE에서 계산된 값)
export interface CombinedNutritionTargets {
  goalCount: number;
  goals: number[];
  targets: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    vitamin_c: number;
    vitamin_d: number;
    zinc: number;
    sodium: number;
  };
}

class StatisticsService {
  private readonly basePath = "/statistics";

  /**
   * 식사 통계 조회
   * GET /statistics/meals
   */
  async getMealStatistics(): Promise<ApiResponse<MealStatisticsSummary>> {
    return await apiClient.get<MealStatisticsSummary>(`${this.basePath}/meals`);
  }

  /**
   * 일일 건강 통계
   * GET /statistics/daily
   * @param date ISO 포맷 날짜 (없으면 오늘)
   */
  async getDailyStats(date?: string): Promise<ApiResponse<DailyHealthStats>> {
    const query = date ? `?date=${encodeURIComponent(date)}` : "";
    return await apiClient.get<DailyHealthStats>(
      `${this.basePath}/daily${query}`
    );
  }

  /**
   * 주간 건강 통계
   * GET /statistics/weekly
   * @param startDate ISO 포맷 시작 날짜 (필수)
   */
  async getWeeklyStats(
    startDate: string
  ): Promise<ApiResponse<WeeklyHealthStats>> {
    const query = `?startDate=${encodeURIComponent(startDate)}`;
    return await apiClient.get<WeeklyHealthStats>(
      `${this.basePath}/weekly${query}`
    );
  }

  /**
   * 기간별 영양소 통계
   * GET /statistics/nutrition
   */
  async getNutritionStats(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<NutritionStats>> {
    const query = `?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`;
    return await apiClient.get<NutritionStats>(
      `${this.basePath}/nutrition${query}`
    );
  }

  /**
   * 건강 목표별 통합 영양소 목표량
   * GET /statistics/combined-targets
   */
  async getCombinedTargets(): Promise<ApiResponse<CombinedNutritionTargets>> {
    return await apiClient.get<CombinedNutritionTargets>(
      `${this.basePath}/combined-targets`
    );
  }
}

export const statisticsService = new StatisticsService();
export default statisticsService;
