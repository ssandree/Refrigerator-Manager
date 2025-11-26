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
  protein: number;
  carbohydrates: number;
  fat: number;
  sodium: number;
  vitamin_c: number;
  vitamin_d: number;
  zinc: number;
}

// GET /statistics/weekly
export interface WeeklyDailyStat {
  date: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface WeeklyHealthStats {
  startDate: string;
  endDate: string;
  averageDailyCalories: number;
  averageDailyProtein: number;
  averageDailyCarbs: number;
  averageDailyFat: number;
  dailyStats: WeeklyDailyStat[];
}

// GET /statistics/nutrition
export interface NutritionBreakdown {
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface NutritionStats {
  startDate: string;
  endDate: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbohydrates: number;
  totalFat: number;
  averageDailyCalories: number;
  averageDailyProtein: number;
  averageDailyCarbs: number;
  averageDailyFat: number;
  nutritionBreakdown: NutritionBreakdown;
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
}

export const statisticsService = new StatisticsService();
export default statisticsService;
