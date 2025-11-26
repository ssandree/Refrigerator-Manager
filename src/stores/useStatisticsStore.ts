import { create } from "zustand";
import statisticsService, {
  type DailyHealthStats,
  type MealStatisticsSummary,
  type NutritionStats,
  type WeeklyHealthStats,
} from "../services/statisticsService";
import { getErrorMessage } from "../utils/storeErrorHandler";

interface StatisticsState {
  mealStats: MealStatisticsSummary | null;
  dailyStats: DailyHealthStats | null;
  weeklyStats: WeeklyHealthStats | null;
  nutritionStats: NutritionStats | null;
  isLoading: boolean;
  error: string | null;
  // 액션
  fetchMealStats: () => Promise<void>;
  fetchDailyStats: (date?: string) => Promise<void>;
  fetchWeeklyStats: (startDate: string) => Promise<void>;
  fetchNutritionStats: (startDate: string, endDate: string) => Promise<void>;
  clearError: () => void;
}

export const useStatisticsStore = create<StatisticsState>((set) => ({
  mealStats: null,
  dailyStats: null,
  weeklyStats: null,
  nutritionStats: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchMealStats: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await statisticsService.getMealStatistics();
      if (response.success && response.data) {
        set({ mealStats: response.data, error: null });
      } else {
        set({
          error: response.message ?? "식사 통계를 불러오는데 실패했습니다.",
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "식사 통계를 불러오는 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDailyStats: async (date?: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await statisticsService.getDailyStats(date);
      if (response.success && response.data) {
        set({ dailyStats: response.data, error: null });
      } else {
        set({
          error:
            response.message ?? "일일 건강 통계를 불러오는데 실패했습니다.",
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "일일 건강 통계를 불러오는 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchWeeklyStats: async (startDate: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await statisticsService.getWeeklyStats(startDate);
      if (response.success && response.data) {
        set({ weeklyStats: response.data, error: null });
      } else {
        set({
          error:
            response.message ?? "주간 건강 통계를 불러오는데 실패했습니다.",
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "주간 건강 통계를 불러오는 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNutritionStats: async (startDate: string, endDate: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await statisticsService.getNutritionStats(
        startDate,
        endDate
      );
      if (response.success && response.data) {
        set({ nutritionStats: response.data, error: null });
      } else {
        set({
          error: response.message ?? "영양소 통계를 불러오는데 실패했습니다.",
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "영양소 통계를 불러오는 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
}));
