// 식단(Meal) 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Ingredient } from "../data/mockFood";
import { Recipe } from "../data/mockRecipes";
import { mealService } from "../services/mealService";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import {
  createAddEntity,
  createGetEntityById,
  createRemoveEntity,
  createUpdateEntity,
} from "./storeCrudHelpers";
import { validateArray, validateSyncTimestamp } from "./storeUtils";

// 식단 도메인 모델 (레시피/재료, 섭취일/등록일, 메모/식사유형 포함)
export interface Meal {
  id: string;
  recipe: Recipe | null;
  ingredients: Ingredient[];
  quantity: string;
  consumedAt: string;
  registeredAt: string;
  notes?: string;
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
}

// 스토어 상태와 액션 정의
interface MealState {
  meals: Meal[];
  error: string | null;
  isLoading: boolean;
  lastSyncedAt: number | null; // 마지막 서버 동기화 시간
  // 식단 추가 (중복 ID 방지)
  addMeal: (meal: Meal) => boolean;
  // 식단 일부 필드 업데이트
  updateMeal: (id: string, updatedMeal: Partial<Meal>) => boolean;
  // 식단 삭제
  removeMeal: (id: string) => boolean;
  // 단건 조회
  getMealById: (id: string) => Meal | undefined;
  // 날짜별 조회 (consumedAt 기준)
  getMealsByDate: (date: string) => Meal[];
  // 레시피별 조회
  getMealsByRecipe: (recipeId: string) => Meal[];
  // 식사 유형별 조회
  getMealsByMealType: (mealType: Meal["mealType"]) => Meal[];
  // Service를 통해 데이터 로드
  loadMeals: (force?: boolean) => Promise<void>;
  // 전체 초기화
  clearAllMeals: () => void;
  clearError: () => void;
}

export const useMealStore = create<MealState>(
  persist(
    (set, get) => ({
      meals: [],
      error: null,
      isLoading: false,
      lastSyncedAt: null,

      // 식단 추가 (이미 존재하면 무시)
      addMeal: createAddEntity<Meal>(
        "식단",
        () => get().meals,
        (meals) => set({ meals, error: null }),
        (error) => set({ error })
      ),

      // 식단 업데이트
      updateMeal: createUpdateEntity<Meal>(
        "식단",
        () => get().meals,
        (meals) => set({ meals, error: null }),
        (error) => set({ error })
      ),

      // 식단 삭제
      removeMeal: createRemoveEntity<Meal>(
        "식단",
        () => get().meals,
        (meals) => set({ meals, error: null }),
        (error) => set({ error })
      ),

      // ID로 단건 조회
      getMealById: createGetEntityById<Meal>(() => get().meals),

      // 날짜별 조회
      getMealsByDate: (date) => {
        return get().meals.filter((meal) => meal.consumedAt === date);
      },

      // 레시피별 조회
      getMealsByRecipe: (recipeId) => {
        return get().meals.filter((meal) => meal.recipe?.id === recipeId);
      },

      // 식사 유형별 조회
      getMealsByMealType: (mealType) => {
        return get().meals.filter((meal) => meal.mealType === mealType);
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
          const response = await mealService.getAllMeals();
          if (response.success && response.data) {
            set({
              meals: response.data,
              error: null,
              lastSyncedAt: Date.now(),
            });
          } else {
            set({
              error: response.message ?? "식단 목록을 불러오는데 실패했습니다.",
            });
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "식단 목록을 불러오는 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
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
          state.meals = validateArray<Meal>(state.meals, "MealStore");
          state.lastSyncedAt = validateSyncTimestamp(
            state.lastSyncedAt,
            "MealStore"
          );
        }
      },
    }
  )
);
