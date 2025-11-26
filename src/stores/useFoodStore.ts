// 냉장고(재료) 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FoodQueryParams, foodService } from "../services/foodService";
import { Food } from "../types/food";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import { createGetEntityById } from "./storeCrudHelpers";
import { validateArray, validateSyncTimestamp } from "./storeUtils";

// 초기값: 빈 배열 (서버에서 로드)
const initialFoods: Food[] = [];

// 스토어 상태와 액션 정의
interface LoadFoodsOptions {
  force?: boolean;
  filters?: FoodQueryParams;
}

interface FridgeState {
  foods: Food[];
  error: string | null;
  isLoading: boolean;
  lastSyncedAt: number | null;
  // 재료 추가/수정/삭제 (API 연동)
  addFood: (food: Omit<Food, "id">) => Promise<boolean>;
  updateFood: (id: string, updatedFood: Partial<Food>) => Promise<boolean>;
  removeFood: (id: string) => Promise<boolean>;
  // 단건 조회
  getFoodById: (id: string) => Food | undefined;
  // 카테고리별 조회
  getFoodsByCategory: (category: string) => Food[];
  // 보관 위치별 조회
  getFoodsByStorageLocation: (location: string) => Food[];
  // 전체 초기화
  clearAllFoods: () => void;
  clearError: () => void;
  // Service를 통해 데이터 로드
  loadFoods: (options?: LoadFoodsOptions) => Promise<void>;
}

export const useFridgeStore = create<FridgeState>()(
  persist(
    (set, get) => ({
      foods: initialFoods,
      error: null,
      isLoading: false,
      lastSyncedAt: null,

      // 재료 추가 (API 연동)
      addFood: async (foodData) => {
        try {
          set({ error: null });
          const response = await foodService.addFood(foodData);
          if (response.success && response.data) {
            set((state) => ({
              foods: [...state.foods, response.data],
              error: null,
              lastSyncedAt: Date.now(),
            }));
            return true;
          }
          set({
            error: response.message ?? "재료 추가에 실패했습니다.",
          });
          return false;
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "재료 추가 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        }
      },

      // 재료 정보 업데이트 (API 연동)
      updateFood: async (id, updatedFood) => {
        try {
          set({ error: null });
          const response = await foodService.updateFood(id, updatedFood);
          if (response.success && response.data) {
            set((state) => ({
              foods: state.foods.map((food) =>
                food.id === id ? response.data : food
              ),
              error: null,
              lastSyncedAt: Date.now(),
            }));
            return true;
          }
          set({
            error: response.message ?? "재료 수정에 실패했습니다.",
          });
          return false;
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "재료 수정 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        }
      },

      // 재료 삭제 (API 연동)
      removeFood: async (id) => {
        try {
          set({ error: null });
          const response = await foodService.deleteFood(id);
          if (response.success) {
            set((state) => ({
              foods: state.foods.filter((food) => food.id !== id),
              error: null,
              lastSyncedAt: Date.now(),
            }));
            return true;
          }
          set({
            error: response.message ?? "재료 삭제에 실패했습니다.",
          });
          return false;
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "재료 삭제 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        }
      },

      // ID로 단건 조회
      getFoodById: createGetEntityById<Food>(() => get().foods),

      // 카테고리 필터링
      getFoodsByCategory: (category) => {
        return get().foods.filter((food) => food.category === category);
      },

      // 보관 위치 필터링
      getFoodsByStorageLocation: (location) => {
        return get().foods.filter((food) => food.storageLocation === location);
      },

      // 전체 초기화
      clearAllFoods: () => {
        set({ foods: [], error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      // Service를 통해 데이터 로드
      // force: true면 persist 데이터가 있어도 서버에서 다시 로드
      loadFoods: async (options?: LoadFoodsOptions) => {
        const { force = false, filters } = options ?? {};
        const state = get();
        // persist로 복원된 데이터가 있고 강제 로드가 아니면 서버 요청 생략
        if (!force && state.foods.length > 0 && state.lastSyncedAt) {
          const timeSinceSync = Date.now() - state.lastSyncedAt;
          // 5분 이내에 동기화했으면 서버 요청 생략
          if (timeSinceSync < 5 * 60 * 1000) {
            return;
          }
        }

        try {
          set({ isLoading: true, error: null });
          const response = await foodService.getAllFoods(filters ?? undefined);
          if (response.success && response.data) {
            set({
              foods: response.data,
              error: null,
              lastSyncedAt: Date.now(),
            });
          } else {
            set({
              error: response.message ?? "재료 목록을 불러오는데 실패했습니다.",
            });
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "재료 목록을 불러오는 중 오류가 발생했습니다."
          );
          set({
            error: errorMessage,
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "fridge-storage",
      storage:
        createSecureStorage<Pick<FridgeState, "foods" | "lastSyncedAt">>(),
      // error와 isLoading은 임시 상태이므로 persist에서 제외
      partialize: (state) => ({
        foods: state.foods,
        lastSyncedAt: state.lastSyncedAt,
      }),
      // 하이드레이션 완료 후 검증 및 정리
      onRehydrateStorage: () => (state) => {
        if (state) {
          // foods가 없거나 undefined인 경우 (이전 데이터 형식이거나 초기 상태)
          if (!state.foods) {
            state.foods = initialFoods;
          } else {
            const validatedFoods = validateArray<Food>(
              state.foods,
              "FridgeStore"
            );
            state.foods = validatedFoods;
          }
          state.lastSyncedAt = validateSyncTimestamp(
            state.lastSyncedAt,
            "FridgeStore"
          );
        } else {
          // state가 없으면 초기값으로 설정
          return {
            foods: initialFoods,
            lastSyncedAt: null,
          };
        }
      },
    }
  )
);
