// 건강 목표 선택 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockHealthGoals } from "../data/mockHealthGoals";
import healthGoalService from "../services/healthGoalService";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import {
  validateArray,
  validateArrayLength,
  validateSyncTimestamp,
} from "./storeUtils";

// 건강 목표 도메인 모델
export interface HealthGoal {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

// 초기값: 빈 배열 (서버에서 로드)
const initialSelectedGoals: HealthGoal[] = [];
const initialAllGoals: HealthGoal[] = [];

// 스토어 상태와 액션 정의
interface HealthGoalState {
  allGoals: HealthGoal[]; // 전체 사용 가능한 목표 목록
  selectedGoals: HealthGoal[]; // 사용자가 선택한 목표 목록
  error: string | null;
  isLoading: boolean;
  lastSyncedAt: number | null; // 마지막 서버 동기화 시간
  // 전체 목표를 일괄 세팅 (서버에 저장)
  setSelectedGoals: (goals: HealthGoal[]) => Promise<boolean>;
  // 목표 추가 (최대 3개, 중복 방지, 서버에 저장)
  addSelectedGoal: (goalId: number) => Promise<boolean>;
  // 목표 제거 (서버에서 삭제)
  removeSelectedGoal: (goalId: number) => Promise<boolean>;
  // 전체 초기화
  clearAllGoals: () => void;
  clearError: () => void;
  // Service를 통해 데이터 로드
  loadGoals: (force?: boolean) => Promise<void>; // 전체 목표 목록 로드
  loadUserSelectedGoals: (force?: boolean) => Promise<void>; // 사용자 선택 목표 로드
}

export const useHealthGoalStore = create<HealthGoalState>(
  persist(
    (set, get) => ({
      allGoals: initialAllGoals,
      selectedGoals: initialSelectedGoals,
      error: null,
      isLoading: false,
      lastSyncedAt: null,

      // 전체 목표 일괄 설정 (서버에 저장)
      setSelectedGoals: async (goals) => {
        const goalIds = goals.map((goal) => goal.id);

        try {
          set({ isLoading: true, error: null });
          const response = await healthGoalService.setSelectedGoals(goalIds);

          if (response.success && response.data) {
            set({
              selectedGoals: response.data,
              error: null,
              lastSyncedAt: Date.now(),
            });
            return true;
          } else {
            const errorMessage =
              response.message ?? "목표 설정에 실패했습니다.";
            set({ error: errorMessage });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "목표 설정 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // 목표 추가 (3개 초과, 중복 추가 방지, 서버에 저장)
      addSelectedGoal: async (goalId) => {
        const state = get();
        // 3개 초과 방지
        if (state.selectedGoals.length >= 3) {
          set({ error: "최대 3개까지 선택할 수 있습니다." });
          return false;
        }
        // 중복 방지
        if (state.selectedGoals.some((g) => g.id === goalId)) {
          return true; // 이미 있으면 성공으로 처리
        }

        try {
          set({ isLoading: true, error: null });
          const response = await healthGoalService.addSelectedGoal(goalId);

          if (response.success && response.data) {
            set((currentState) => ({
              selectedGoals: [...currentState.selectedGoals, response.data],
              error: null,
              lastSyncedAt: Date.now(),
            }));
            return true;
          } else {
            const errorMessage =
              response.message ?? "목표 추가에 실패했습니다.";
            set({ error: errorMessage });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "목표 추가 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // 목표 제거 (서버에서 삭제)
      removeSelectedGoal: async (goalId) => {
        try {
          set({ isLoading: true, error: null });
          const response = await healthGoalService.removeSelectedGoal(goalId);

          if (response.success) {
        set((state) => ({
          selectedGoals: state.selectedGoals.filter(
            (goal) => goal.id !== goalId
          ),
              error: null,
              lastSyncedAt: Date.now(),
            }));
            return true;
          } else {
            const errorMessage =
              response.message ?? "목표 제거에 실패했습니다.";
            set({ error: errorMessage });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "목표 제거 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // 전체 초기화
      clearAllGoals: () => {
        set({ allGoals: [], selectedGoals: [], error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      // 상수 데이터에서 전체 목표 목록 로드 (네트워크 요청 없음)
      loadGoals: async (force: boolean = false) => {
        const state = get();
        // persist로 복원된 데이터가 있고 강제 로드가 아니면 생략
        if (!force && state.allGoals.length > 0) {
          return;
        }

        try {
          set({ isLoading: true, error: null });
          // 상수 데이터 사용
          set({
            allGoals: mockHealthGoals,
            error: null,
            lastSyncedAt: Date.now(),
          });
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "목표 목록을 불러오는 중 오류가 발생했습니다."
          );
          set({
            error: errorMessage,
            lastSyncedAt: Date.now(),
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Service를 통해 사용자 선택 목표 로드
      loadUserSelectedGoals: async (force: boolean = false) => {
        const state = get();
        // persist로 복원된 데이터가 있고 강제 로드가 아니면 서버 요청 생략
        if (!force && state.selectedGoals.length > 0 && state.lastSyncedAt) {
          const timeSinceSync = Date.now() - state.lastSyncedAt;
          // 5분 이내에 동기화했으면 서버 요청 생략
          if (timeSinceSync < 5 * 60 * 1000) {
            return;
          }
        }

        try {
          set({ isLoading: true, error: null });
          const response = await healthGoalService.getUserSelectedGoals();

          if (response.success && response.data) {
            set({
              selectedGoals: response.data,
              error: null,
              lastSyncedAt: Date.now(),
            });
          } else {
            set({
              error:
                response.message ?? "선택한 목표를 불러오는데 실패했습니다.",
              lastSyncedAt: Date.now(),
            });
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "선택한 목표를 불러오는 중 오류가 발생했습니다."
          );
          set({
            error: errorMessage,
            lastSyncedAt: Date.now(),
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "health-goal-storage",
      storage:
        createSecureStorage<
          Pick<HealthGoalState, "allGoals" | "selectedGoals" | "lastSyncedAt">
        >(),
      partialize: (state) => ({
        allGoals: state.allGoals,
        selectedGoals: state.selectedGoals,
        lastSyncedAt: state.lastSyncedAt,
      }),
      // 하이드레이션 완료 후 검증
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.allGoals = validateArray<HealthGoal>(
            state.allGoals,
            "HealthGoalStore"
          );
          state.selectedGoals = validateArray<HealthGoal>(
            state.selectedGoals,
            "HealthGoalStore"
          );
          state.selectedGoals = validateArrayLength(
            state.selectedGoals,
            3,
            "HealthGoalStore"
          );
          state.lastSyncedAt = validateSyncTimestamp(
            state.lastSyncedAt,
            "HealthGoalStore"
          );
        } else {
          return {
            allGoals: initialAllGoals,
            selectedGoals: initialSelectedGoals,
            lastSyncedAt: null,
          };
        }
      },
    }
  )
);
