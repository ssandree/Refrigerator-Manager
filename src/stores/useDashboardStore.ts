import { create } from "zustand";
import dashboardService, { HomeDashboard } from "../services/dashboardService";
import { getErrorMessage } from "../utils/storeErrorHandler";

interface DashboardState {
  todayData: HomeDashboard | null;
  isLoading: boolean;
  error: string | null;
  loadToday: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  todayData: null,
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
}));
