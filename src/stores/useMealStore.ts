// 식단(Meal) 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mealService } from "../services/mealService";
import {
  Meal,
  MealCreatePayload,
  MealStatistics,
  MealUpdatePayload,
} from "../types/meal";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import { createGetEntityById } from "./storeCrudHelpers";
import { validateArray, validateSyncTimestamp } from "./storeUtils";

// 초기값: 빈 배열 (서버에서 로드)
const initialMeals: Meal[] = [];

const mergeMeals = (currentMeals: Meal[], incomingMeals: Meal[]): Meal[] => {
  const mealMap = new Map(currentMeals.map((meal) => [meal.id, meal]));
  incomingMeals.forEach((meal) => {
    mealMap.set(meal.id, meal);
  });
  return Array.from(mealMap.values());
};

// 스토어 상태와 액션 정의
interface MealState {
  meals: Meal[];
  error: string | null;
  isLoading: boolean;
  lastSyncedAt: number | null; // 마지막 서버 동기화 시간
  // 식단 추가 (중복 ID 방지)
  addMeal: (payload: MealCreatePayload) => Promise<boolean>;
  // 식단 일부 필드 업데이트 (API 호출)
  updateMeal: (id: string, payload: MealUpdatePayload) => Promise<boolean>;
  // 식단 삭제 (API 호출)
  removeMeal: (id: string) => Promise<boolean>;
  // 단건 조회
  getMealById: (id: string) => Meal | undefined;
  fetchMealById: (id: string) => Promise<Meal | null>;
  // 날짜별 조회 (consumedAt 기준)
  getMealsByDate: (date: string) => Promise<Meal[]>;
  getMealsByDateRange: (startDate: string, endDate: string) => Promise<Meal[]>;
  // 레시피별 조회
  getMealsByRecipe: (recipeId: string) => Promise<Meal[]>;
  // 식사 유형별 조회
  getMealsByMealType: (mealType: Meal["mealType"]) => Promise<Meal[]>;
  // 사용자 통계
  getMealStatistics: () => Promise<MealStatistics | null>;
  // Service를 통해 데이터 로드
  loadMeals: (force?: boolean) => Promise<void>;
  // 전체 초기화
  clearAllMeals: () => void;
  clearError: () => void;
}

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      meals: initialMeals,
      error: null,
      isLoading: false,
      lastSyncedAt: null,

      // 식단 추가 (API 호출)
      addMeal: async (payload: MealCreatePayload) => {
        try {
          set({ error: null });
          const response = await mealService.createMeal({
            foodIds: payload.foodIds ?? [],
            recipeId: payload.recipeId ?? null,
            quantity: payload.quantity ?? null,
            consumedAt: payload.consumedAt,
            notes: payload.notes ?? null,
            mealType: payload.mealType ?? null,
          });
          if (response.success && response.data) {
            const normalized = response.data;
            set({
              meals: [...get().meals, normalized],
              error: null,
              lastSyncedAt: Date.now(),
            });
            return true;
          } else {
            set({
              error: response.message ?? "식단 등록에 실패했습니다.",
            });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "식단 등록 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        }
      },

      // 식단 업데이트 (API 호출)
      updateMeal: async (id: string, payload: MealUpdatePayload) => {
        try {
          set({ error: null });
          const response = await mealService.updateMeal(id, {
            quantity: payload.quantity ?? null,
            notes: payload.notes ?? null,
            mealType: payload.mealType ?? null,
            consumedAt: payload.consumedAt ?? null,
          });
          if (response.success && response.data) {
            const updated = response.data;
            const entities = get().meals;
            set({
              meals: entities.map((e) => (e.id === id ? updated : e)),
              error: null,
              lastSyncedAt: Date.now(),
            });
            return true;
          } else {
            set({
              error: response.message ?? "식단 수정에 실패했습니다.",
            });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "식단 수정 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        }
      },

      // 식단 삭제 (API 호출)
      removeMeal: async (id: string) => {
        try {
          set({ error: null });
          const response = await mealService.deleteMeal(id);
          if (response.success) {
            const entities = get().meals;
            set({
              meals: entities.filter((e) => e.id !== id),
              error: null,
              lastSyncedAt: Date.now(),
            });
            return true;
          } else {
            set({
              error: response.message ?? "식단 삭제에 실패했습니다.",
            });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "식단 삭제 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        }
      },

      // ID로 단건 조회
      getMealById: createGetEntityById<Meal>(() => get().meals),

      fetchMealById: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mealService.getMealById(id);
          if (response.success && response.data) {
            const updatedMeal = response.data;
            const nextMeals = mergeMeals(get().meals, [updatedMeal]);
            set({
              meals: nextMeals,
              lastSyncedAt: Date.now(),
            });
            return updatedMeal;
          }
          set({
            error: response.message ?? "식단 정보를 불러오지 못했습니다.",
          });
          return null;
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "식단 정보를 불러오는 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      // 날짜별 조회
      getMealsByDate: async (date) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mealService.getMeals({ date });
          if (response.success && response.data) {
            const normalized = response.data;
            set({
              meals: mergeMeals(get().meals, normalized),
              lastSyncedAt: Date.now(),
            });
            return normalized;
          }
          set({
            error:
              response.message ?? "해당 날짜의 식단을 불러오지 못했습니다.",
          });
          return [];
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "해당 날짜의 식단을 불러오는 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return [];
        } finally {
          set({ isLoading: false });
        }
      },

      getMealsByDateRange: async (startDate, endDate) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mealService.getMeals({
            startDate,
            endDate,
          });
          if (response.success && response.data) {
            const normalized = response.data;
            set({
              meals: mergeMeals(get().meals, normalized),
              lastSyncedAt: Date.now(),
            });
            return normalized;
          }
          set({
            error: response.message ?? "기간별 식단을 불러오지 못했습니다.",
          });
          return [];
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "기간별 식단을 불러오는 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return [];
        } finally {
          set({ isLoading: false });
        }
      },

      // 레시피별 조회
      getMealsByRecipe: async (recipeId) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mealService.getMeals({ recipeId });
          if (response.success && response.data) {
            const normalized = response.data;
            set({
              meals: mergeMeals(get().meals, normalized),
              lastSyncedAt: Date.now(),
            });
            return normalized;
          }
          set({
            error: response.message ?? "레시피별 식단을 불러오지 못했습니다.",
          });
          return [];
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "레시피별 식단을 불러오는 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return [];
        } finally {
          set({ isLoading: false });
        }
      },

      // 식사 유형별 조회
      getMealsByMealType: async (mealType) => {
        try {
          set({ isLoading: true, error: null });
          // FE에서는 mealType으로 넘기고,
          // service에서 실제 쿼리 키 "type"으로 변환하여 호출
          const response = await mealService.getMeals({ mealType });
          if (response.success && response.data) {
            const normalized = response.data;
            set({
              meals: mergeMeals(get().meals, normalized),
              lastSyncedAt: Date.now(),
            });
            return normalized;
          }
          set({
            error:
              response.message ?? "식사 유형별 식단을 불러오지 못했습니다.",
          });
          return [];
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "식사 유형별 식단을 불러오는 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return [];
        } finally {
          set({ isLoading: false });
        }
      },

      getMealStatistics: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await mealService.getMealStatistics();
          if (response.success && response.data) {
            return response.data;
          }
          set({
            error: response.message ?? "식단 통계를 불러오지 못했습니다.",
          });
          return null;
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "식단 통계를 불러오는 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      // Service를 통해 데이터 로드
      // force: true면 persist 데이터가 있어도 서버에서 다시 로드
      loadMeals: async (force: boolean = false) => {
        const state = get();
        // persist로 복원된 데이터가 있고 강제 로드가 아니면 서버 요청 생략
        if (!force && state.meals.length > 0 && state.lastSyncedAt) {
          const timeSinceSync = Date.now() - state.lastSyncedAt;
          // 5분 이내에 동기화했으면 서버 요청 생략
          if (timeSinceSync < 5 * 60 * 1000) {
            return;
          }
        }

        try {
          set({ isLoading: true, error: null });
          const response = await mealService.getMeals();
          if (response.success && response.data) {
            const transformedMeals = response.data;
            set({
              meals: transformedMeals,
              error: null,
              lastSyncedAt: Date.now(),
            });
          } else {
            // 개발 환경: API 실패 시 mock 데이터 사용 (BE 연결 전까지)
            // 식단은 사용자별 데이터이므로 mock 데이터 없이 빈 배열 유지
            set({
              error: response.message ?? "식단 목록을 불러오는데 실패했습니다.",
              lastSyncedAt: Date.now(), // 실패해도 lastSyncedAt 설정하여 재시도 방지
            });
          }
        } catch (error: unknown) {
          // 개발 환경: 네트워크 에러 시에도 빈 배열 유지 (식단은 사용자별 데이터)
          const errorMessage = getErrorMessage(
            error,
            "식단 목록을 불러오는 중 오류가 발생했습니다."
          );
          set({
            error: errorMessage,
            lastSyncedAt: Date.now(), // 실패해도 lastSyncedAt 설정하여 재시도 방지
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // 전체 초기화
      clearAllMeals: () => {
        set({ meals: [], error: null });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "meal-storage",
      storage: createSecureStorage<Pick<MealState, "meals" | "lastSyncedAt">>(),
      // error와 isLoading은 임시 상태이므로 persist에서 제외
      partialize: (state) => ({
        meals: state.meals,
        lastSyncedAt: state.lastSyncedAt,
      }),
      // 하이드레이션 완료 후 검증 및 정리
      onRehydrateStorage: () => (state) => {
        if (state) {
          const validatedMeals = validateArray<Meal>(state.meals, "MealStore");
          state.meals = validatedMeals;
          state.lastSyncedAt = validateSyncTimestamp(
            state.lastSyncedAt,
            "MealStore"
          );
        } else {
          // state가 없으면 초기값으로 설정
          return {
            meals: initialMeals,
            lastSyncedAt: null,
          };
        }
      },
    }
  )
);

export type { Meal } from "../types/meal";
