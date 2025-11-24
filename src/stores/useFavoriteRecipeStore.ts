// 즐겨찾기 레시피 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import favoriteRecipeService from "../services/favoriteRecipeService";
import { Recipe } from "../types/recipe";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import { validateArray, validateSyncTimestamp } from "./storeUtils";

// 초기값: 빈 배열 (서버에서 로드)
const initialFavoriteRecipes: Recipe[] = [];

// 스토어 상태 및 액션 타입 정의
interface FavoriteRecipeState {
  favoriteRecipes: Recipe[];
  error: string | null;
  isLoading: boolean;
  lastSyncedAt: number | null; // 마지막 서버 동기화 시간
  // 레시피를 즐겨찾기에 추가 (중복 방지)
  addToFavorites: (recipe: Recipe) => Promise<boolean>;
  // 특정 레시피를 즐겨찾기에서 제거
  removeFromFavorites: (recipeId: string) => Promise<boolean>;
  // 주어진 레시피가 즐겨찾기인지 여부 확인
  isFavorite: (recipeId: string) => boolean;
  // 즐겨찾기 상태 토글 (추가/제거)
  toggleFavorite: (recipe: Recipe) => Promise<boolean>;
  // 전체 초기화
  clearAllFavorites: () => void;
  clearError: () => void;
  // Service를 통해 데이터 로드
  loadFavorites: (force?: boolean) => Promise<void>;
}

export const useFavoriteRecipeStore = create<FavoriteRecipeState>(
  persist(
    (set, get) => ({
      favoriteRecipes: initialFavoriteRecipes,
      error: null,
      isLoading: false,
      lastSyncedAt: null,

      // 즐겨찾기 추가 (서버에 저장)
      addToFavorites: async (recipe) => {
        const state = get();
        // 이미 존재하면 무시
        if (state.favoriteRecipes.find((r) => r.id === recipe.id)) {
          return true;
        }

        try {
          set({ isLoading: true, error: null });
          const response = await favoriteRecipeService.addToFavorites(
            recipe.id
          );

          if (response.success && response.data) {
            set((currentState) => ({
              favoriteRecipes: [
                ...currentState.favoriteRecipes,
                { ...response.data, isFavorite: true },
              ],
              error: null,
              lastSyncedAt: Date.now(),
            }));
            return true;
          } else {
            const errorMessage =
              response.message ?? "즐겨찾기 추가에 실패했습니다.";
            set({ error: errorMessage });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "즐겨찾기 추가 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // 즐겨찾기 제거 (서버에서 삭제)
      removeFromFavorites: async (recipeId) => {
        try {
          set({ isLoading: true, error: null });
          const response = await favoriteRecipeService.removeFromFavorites(
            recipeId
          );

          if (response.success) {
            set((state) => ({
              favoriteRecipes: state.favoriteRecipes.filter(
                (recipe) => recipe.id !== recipeId
              ),
              error: null,
              lastSyncedAt: Date.now(),
            }));
            return true;
          } else {
            const errorMessage =
              response.message ?? "즐겨찾기 제거에 실패했습니다.";
            set({ error: errorMessage });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "즐겨찾기 제거 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // 즐겨찾기 여부 확인
      isFavorite: (recipeId) => {
        return get().favoriteRecipes.some((recipe) => recipe.id === recipeId);
      },

      // 즐겨찾기 토글 (있으면 제거, 없으면 추가)
      toggleFavorite: async (recipe) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        if (isFavorite(recipe.id)) {
          return await removeFromFavorites(recipe.id);
        } else {
          return await addToFavorites(recipe);
        }
      },

      // 전체 초기화
      clearAllFavorites: () => {
        set({ favoriteRecipes: [], error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      // Service를 통해 데이터 로드
      // force: true면 persist 데이터가 있어도 서버에서 다시 로드
      loadFavorites: async (force: boolean = false) => {
        const state = get();
        // persist로 복원된 데이터가 있고 강제 로드가 아니면 서버 요청 생략
        if (!force && state.favoriteRecipes.length > 0 && state.lastSyncedAt) {
          const timeSinceSync = Date.now() - state.lastSyncedAt;
          // 5분 이내에 동기화했으면 서버 요청 생략
          if (timeSinceSync < 5 * 60 * 1000) {
            return;
          }
        }

        try {
          set({ isLoading: true, error: null });
          const response = await favoriteRecipeService.getAllFavorites();

          if (response.success && response.data) {
            set({
              favoriteRecipes: response.data,
              error: null,
              lastSyncedAt: Date.now(),
            });
          } else {
            set({
              error:
                response.message ?? "즐겨찾기 목록을 불러오는데 실패했습니다.",
              lastSyncedAt: Date.now(),
            });
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "즐겨찾기 목록을 불러오는 중 오류가 발생했습니다."
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
      name: "favorite-recipe-storage",
      storage:
        createSecureStorage<
          Pick<FavoriteRecipeState, "favoriteRecipes" | "lastSyncedAt">
        >(),
      partialize: (state) => ({
        favoriteRecipes: state.favoriteRecipes,
        lastSyncedAt: state.lastSyncedAt,
      }),
      // 하이드레이션 완료 후 검증
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.favoriteRecipes = validateArray<Recipe>(
            state.favoriteRecipes,
            "FavoriteRecipeStore"
          );
          state.lastSyncedAt = validateSyncTimestamp(
            state.lastSyncedAt,
            "FavoriteRecipeStore"
          );
        } else {
          return {
            favoriteRecipes: initialFavoriteRecipes,
            lastSyncedAt: null,
          };
        }
      },
    }
  )
);
