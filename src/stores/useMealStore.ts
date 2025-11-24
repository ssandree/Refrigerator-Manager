// 식단(Meal) 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Food } from "../data/mockFood";
import { mealService } from "../services/mealService";
import { Recipe } from "../types/recipe";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import { createGetEntityById } from "./storeCrudHelpers";
import { validateArray, validateSyncTimestamp } from "./storeUtils";

// 식단 도메인 모델 (레시피/재료, 섭취일/등록일, 메모/식사유형 포함)
export interface Meal {
  id: string;
  recipe: Recipe | null;
  foods: Food[];
  quantity: string;
  consumedAt: string;
  registeredAt: string;
  notes?: string;
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
}

// 초기값: 빈 배열 (서버에서 로드)
const initialMeals: Meal[] = [];

// 스토어 상태와 액션 정의
interface MealState {
  meals: Meal[];
  error: string | null;
  isLoading: boolean;
  lastSyncedAt: number | null; // 마지막 서버 동기화 시간
  // 식단 추가 (중복 ID 방지)
  addMeal: (meal: Omit<Meal, "id">) => Promise<boolean>;
  // 식단 일부 필드 업데이트 (API 호출)
  updateMeal: (id: string, updatedMeal: Partial<Meal>) => Promise<boolean>;
  // 식단 삭제 (API 호출)
  removeMeal: (id: string) => Promise<boolean>;
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

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      meals: initialMeals,
      error: null,
      isLoading: false,
      lastSyncedAt: null,

      // 식단 추가 (API 호출)
      addMeal: async (mealData: Omit<Meal, "id">) => {
        try {
          set({ error: null });
          const response = await mealService.createMeal(mealData);
          if (response.success && response.data) {
            set({
              meals: [...get().meals, response.data],
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
      updateMeal: async (id: string, updatedMeal: Partial<Meal>) => {
        try {
          set({ error: null });
          const response = await mealService.updateMeal(id, updatedMeal);
          if (response.success && response.data) {
            const entities = get().meals;
            set({
              meals: entities.map((e) => (e.id === id ? response.data : e)),
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
            // 백엔드 응답을 프론트엔드 타입으로 변환
            // 백엔드: { recipe, ingredients } -> 프론트엔드: { recipe, foods }
            const transformedMeals: Meal[] = response.data.map((meal: any) => ({
              ...meal,
              // ingredients 필드가 있으면 foods로 변환
              foods: meal.ingredients || meal.foods || [],
              // ingredients 필드 제거 (타입 안전성)
              ingredients: undefined,
            }));

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
