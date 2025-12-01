import { create } from "zustand";
import statisticsService, {
  type CombinedNutritionTargets,
  type DailyHealthStats,
  type MealStatisticsSummary,
  type NutritionStats,
  type WeeklyHealthStats,
} from "../services/statisticsService";
import { getErrorMessage } from "../utils/storeErrorHandler";

/**
 * useStatisticsStore: API에서 받아온 통계 데이터를 저장하는 스토어
 *
 * 역할:
 * - API 호출 및 원시 데이터 저장
 * - dailyStats: 일일 섭취량 통계 (GET /statistics/daily)
 * - combinedTargets: 건강 목표별 영양소 목표량 (GET /statistics/combined-targets)
 *
 * useNutritionStore와의 관계:
 * - useStatisticsStore: API에서 원시 데이터를 가져와 저장
 * - useNutritionStore: UI 컴포넌트에서 사용하기 편한 형태로 변환하여 저장
 *
 * 데이터 흐름:
 * 1. fetchDailyStats() → dailyStats 저장 → 컴포넌트에서 useNutritionStore.setTotals()로 변환
 * 2. fetchCombinedTargets() → combinedTargets 저장 → 컴포넌트에서 useNutritionStore.setTargets()로 변환
 */

interface StatisticsState {
  mealStats: MealStatisticsSummary | null;
  dailyStats: DailyHealthStats | null;
  weeklyStats: WeeklyHealthStats | null;
  nutritionStats: NutritionStats | null;
  combinedTargets: CombinedNutritionTargets | null;
  isLoading: boolean;
  error: string | null;
  // 액션
  fetchMealStats: () => Promise<void>;
  fetchDailyStats: (date?: string) => Promise<void>;
  fetchWeeklyStats: (startDate: string) => Promise<void>;
  fetchNutritionStats: (startDate: string, endDate: string) => Promise<void>;
  fetchCombinedTargets: () => Promise<void>;
  clearError: () => void;
}

export const useStatisticsStore = create<StatisticsState>((set) => ({
  mealStats: null,
  dailyStats: null,
  weeklyStats: null,
  nutritionStats: null,
  combinedTargets: null,
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

  fetchCombinedTargets: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await statisticsService.getCombinedTargets();
      if (response.success && response.data) {
        set({ combinedTargets: response.data, error: null });
      } else {
        set({
          error:
            response.message ??
            "건강 목표별 영양소 목표량을 불러오는데 실패했습니다.",
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "건강 목표별 영양소 목표량을 불러오는 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
}));
