import { create } from "zustand";
import dashboardService, {
  BMIRequest,
  BMIResponse,
  BMRRequest,
  BMRResponse,
  TDEERequest,
  TDEEResponse,
} from "../services/dashboardService";
import { getErrorMessage } from "../utils/storeErrorHandler";

type TodayDashboardData = any; // 실제 타입을 알게 되면 교체

interface DashboardState {
  todayData: TodayDashboardData | null;
  bmi: BMIResponse | null;
  bmr: number | null;
  tdee: number | null;
  isLoading: boolean;
  error: string | null;
  loadToday: () => Promise<void>;
  fetchMyBMR: () => Promise<void>;
  fetchMyTDEE: () => Promise<void>;
  calculateBMI: (payload: BMIRequest) => Promise<BMIResponse | null>;
  calculateBMR: (payload: BMRRequest) => Promise<BMRResponse | null>;
  calculateTDEE: (payload: TDEERequest) => Promise<TDEEResponse | null>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  todayData: null,
  bmi: null,
  bmr: null,
  tdee: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadToday: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await dashboardService.getTodayDashboard();
      if (response.success && response.data) {
        set({ todayData: response.data, error: null });
      } else {
        set({
          error: response.message ?? "대시보드 정보를 불러오는데 실패했습니다.",
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "대시보드 정보를 불러오는 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyBMR: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await dashboardService.getMyBMR();
      if (response.success && response.data) {
        set({ bmr: response.data.bmr, error: null });
      } else {
        set({
          error: response.message ?? "BMR 정보를 불러오는데 실패했습니다.",
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "BMR 정보를 불러오는 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyTDEE: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await dashboardService.getMyTDEE();
      if (response.success && response.data) {
        set({ tdee: response.data.tdee, error: null });
      } else {
        set({
          error: response.message ?? "TDEE 정보를 불러오는데 실패했습니다.",
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "TDEE 정보를 불러오는 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  calculateBMI: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await dashboardService.calculateBMI(payload);
      if (response.success && response.data) {
        set({ bmi: response.data, error: null });
        return response.data;
      }
      set({
        error: response.message ?? "BMI 계산에 실패했습니다.",
      });
      return null;
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "BMI 계산 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  calculateBMR: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await dashboardService.calculateBMR(payload);
      if (response.success && response.data) {
        set({ bmr: response.data.bmr, error: null });
        return response.data;
      }
      set({
        error: response.message ?? "BMR 계산에 실패했습니다.",
      });
      return null;
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "BMR 계산 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  calculateTDEE: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await dashboardService.calculateTDEE(payload);
      if (response.success && response.data) {
        set({ tdee: response.data.tdee, error: null });
        return response.data;
      }
      set({
        error: response.message ?? "TDEE 계산에 실패했습니다.",
      });
      return null;
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "TDEE 계산 중 오류가 발생했습니다."
      );
      set({ error: errorMessage });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));
