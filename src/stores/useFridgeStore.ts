// 냉장고(재료) 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Ingredient } from "../data/mockFood";
import fridgeService from "../services/fridgeService";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import {
  createAddEntity,
  createGetEntityById,
  createRemoveEntity,
  createUpdateEntity,
} from "./storeCrudHelpers";
import { validateArray, validateSyncTimestamp } from "./storeUtils";

// 스토어 상태와 액션 정의
interface FridgeState {
  ingredients: Ingredient[];
  error: string | null;
  isLoading: boolean;
  lastSyncedAt: number | null;
  // 재료 추가 (중복 ID 방지)
  addIngredient: (ingredient: Ingredient) => boolean;
  updateIngredient: (
    id: string,
    updatedIngredient: Partial<Ingredient>
  ) => boolean;
  // 재료 삭제
  removeIngredient: (id: string) => boolean;
  // 단건 조회
  getIngredientById: (id: string) => Ingredient | undefined;
  // 카테고리별 조회
  getIngredientsByCategory: (category: string) => Ingredient[];
  // 보관 위치별 조회
  getIngredientsByStorageLocation: (location: string) => Ingredient[];
  // 전체 초기화
  clearAllIngredients: () => void;
  clearError: () => void;
  // Service를 통해 데이터 로드
  loadIngredients: (force?: boolean) => Promise<void>;
}

export const useFridgeStore = create<FridgeState>(
  persist(
    (set, get) => ({
      ingredients: [],
      error: null,
      isLoading: false,
      lastSyncedAt: null,

      // 재료 추가 (이미 존재하면 무시)
      addIngredient: createAddEntity<Ingredient>(
        "재료",
        () => get().ingredients,
        (ingredients) => set({ ingredients, error: null }),
        (error) => set({ error })
      ),

      // 재료 정보 업데이트
      updateIngredient: createUpdateEntity<Ingredient>(
        "재료",
        () => get().ingredients,
        (ingredients) => set({ ingredients, error: null }),
        (error) => set({ error })
      ),

      // 재료 삭제
      removeIngredient: createRemoveEntity<Ingredient>(
        "재료",
        () => get().ingredients,
        (ingredients) => set({ ingredients, error: null }),
        (error) => set({ error })
      ),

      // ID로 단건 조회
      getIngredientById: createGetEntityById<Ingredient>(
        () => get().ingredients
      ),

      // 카테고리 필터링
      getIngredientsByCategory: (category) => {
        return get().ingredients.filter(
          (ingredient) => ingredient.category === category
        );
      },

      // 보관 위치 필터링
      getIngredientsByStorageLocation: (location) => {
        return get().ingredients.filter(
          (ingredient) => ingredient.storageLocation === location
        );
      },

      // 전체 초기화
      clearAllIngredients: () => {
        set({ ingredients: [], error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      // Service를 통해 데이터 로드
      // force: true면 persist 데이터가 있어도 서버에서 다시 로드
      loadIngredients: async (force: boolean = false) => {
        const state = get();
        // persist로 복원된 데이터가 있고 강제 로드가 아니면 서버 요청 생략
        if (!force && state.ingredients.length > 0 && state.lastSyncedAt) {
          const timeSinceSync = Date.now() - state.lastSyncedAt;
          // 5분 이내에 동기화했으면 서버 요청 생략
          if (timeSinceSync < 5 * 60 * 1000) {
            return;
          }
        }

        try {
          set({ isLoading: true, error: null });
          const response = await fridgeService.getAllIngredients();
          if (response.success && response.data) {
            set({
              ingredients: response.data,
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
          set({ error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "fridge-storage",
      storage:
        createSecureStorage<
          Pick<FridgeState, "ingredients" | "lastSyncedAt">
        >(),
      // error와 isLoading은 임시 상태이므로 persist에서 제외
      partialize: (state) => ({
        ingredients: state.ingredients,
        lastSyncedAt: state.lastSyncedAt,
      }),
      // 하이드레이션 완료 후 검증 및 정리
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.ingredients = validateArray<Ingredient>(
            state.ingredients,
            "FridgeStore"
          );
          state.lastSyncedAt = validateSyncTimestamp(
            state.lastSyncedAt,
            "FridgeStore"
          );
        }
      },
    }
  )
);
