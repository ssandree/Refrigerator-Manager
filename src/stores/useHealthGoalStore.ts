// 건강 목표 선택 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockHealthGoals } from "../data/HealthGoalConstants";
import healthGoalService, {
  HealthGoalDTO,
} from "../services/healthGoalService";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import {
  validateArray,
  validateArrayLength,
  validateSyncTimestamp,
} from "./storeUtils";

// 건강 목표 도메인 모델
// HealthGoalConstants.ts의 mockHealthGoals와 일치하도록 확장
export interface HealthGoal {
  id: number;
  title: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
}

// 초기값: 빈 배열 (서버에서 로드)
const initialSelectedGoals: HealthGoal[] = [];
const initialAllGoals: HealthGoal[] = [];

// 서버에서 내려오는 HealthGoalDTO(id, title) 배열을
// FE 도메인 모델 HealthGoal로 매핑 (mockHealthGoals 기준으로 보강)
const mapServerGoalsToDomain = (serverGoals: HealthGoalDTO[]): HealthGoal[] => {
  return serverGoals.map((g) => {
    const full = mockHealthGoals.find((mg) => mg.id === g.id);
    if (full) {
      return full;
    }
    // mock에 없으면 서버에서 내려온 최소 정보만 사용
    return {
      id: g.id,
      title: g.title,
    };
  });
};

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

export const useHealthGoalStore = create<HealthGoalState>()(
  persist(
    (set, get) => {
      const syncSelectedGoals = async (goalIds: number[]) => {
        try {
          set({ isLoading: true, error: null });
          const response = await healthGoalService.setSelectedGoals(goalIds);

          if (response.success && response.data) {
            const mappedGoals = mapServerGoalsToDomain(response.data);
            set({
              selectedGoals: mappedGoals,
              error: null,
              lastSyncedAt: Date.now(),
            });
            return true;
          } else {
            const errorMessage =
              response.message ?? "선택한 목표를 저장하는데 실패했습니다.";
            set({ error: errorMessage });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "선택한 목표를 저장하는 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      };

      return {
        allGoals: initialAllGoals,
        selectedGoals: initialSelectedGoals,
        error: null,
        isLoading: false,
        lastSyncedAt: null,

        // 전체 목표 일괄 설정 (서버에 저장)
        setSelectedGoals: async (goals) => {
          const goalIds = goals.map((goal) => goal.id);
          return await syncSelectedGoals(goalIds);
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

          const goalIds = [
            ...state.selectedGoals.map((goal) => goal.id),
            goalId,
          ];
          return await syncSelectedGoals(goalIds);
        },

        // 목표 제거 (서버에서 삭제)
        removeSelectedGoal: async (goalId) => {
          const state = get();
          if (!state.selectedGoals.some((goal) => goal.id === goalId)) {
            return true;
          }
          const remainingIds = state.selectedGoals
            .filter((goal) => goal.id !== goalId)
            .map((goal) => goal.id);
          return await syncSelectedGoals(remainingIds);
        },

        // 전체 초기화
        clearAllGoals: () => {
          set({ allGoals: [], selectedGoals: [], error: null });
        },

        clearError: () => {
          set({ error: null });
        },

        // 상수 데이터에서 전체 목표 목록 로드
        loadGoals: async (force: boolean = false) => {
          const state = get();
          // persist로 복원된 데이터가 있고 강제 로드가 아니면 생략
          if (!force && state.allGoals.length > 0) {
            return;
          }

          set({ isLoading: true, error: null });
          set({
            allGoals: mockHealthGoals,
            error: null,
            lastSyncedAt: Date.now(),
          });
          set({ isLoading: false });
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
              const mappedGoals = mapServerGoalsToDomain(response.data);
              set({
                selectedGoals: mappedGoals,
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
      };
    },
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
