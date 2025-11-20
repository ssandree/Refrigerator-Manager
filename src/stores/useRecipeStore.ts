// 레시피 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockRecipes, Recipe } from "../data/mockRecipes";
import recipeService from "../services/recipeService";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import {
  createAddEntity,
  createGetEntityById,
  createRemoveEntity,
  createUpdateEntity,
} from "./storeCrudHelpers";
import { validateArray, validateSyncTimestamp } from "./storeUtils";

// 초기값: 빈 배열 (서버에서 로드)
const initialRecipes: Recipe[] = [];

// 스토어 상태와 액션 정의
interface RecipeState {
  recipes: Recipe[];
  error: string | null;
  isLoading: boolean;
  lastSyncedAt: number | null; // 마지막 서버 동기화 시간
  // 레시피 추가 (중복 ID 방지)
  addRecipe: (recipe: Recipe) => boolean;
  // 레시피 업데이트
  updateRecipe: (id: string, updatedRecipe: Partial<Recipe>) => boolean;
  // 레시피 삭제
  removeRecipe: (id: string) => boolean;
  // 단건 조회
  getRecipeById: (id: string) => Recipe | undefined;
  // 검색어로 조회
  searchRecipes: (query: string) => Recipe[];
  // 전체 초기화
  clearAllRecipes: () => void;
  clearError: () => void;
  // Service를 통해 데이터 로드
  loadRecipes: (force?: boolean) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>(
  persist(
    (set, get) => ({
      recipes: initialRecipes,
      error: null,
      isLoading: false,
      lastSyncedAt: null,

      // 레시피 추가 (이미 존재하면 무시)
      addRecipe: createAddEntity<Recipe>(
        "레시피",
        () => get().recipes,
        (recipes) => set({ recipes, error: null }),
        (error) => set({ error })
      ),

      // 레시피 업데이트
      updateRecipe: createUpdateEntity<Recipe>(
        "레시피",
        () => get().recipes,
        (recipes) => set({ recipes, error: null }),
        (error) => set({ error })
      ),

      // 레시피 삭제
      removeRecipe: createRemoveEntity<Recipe>(
        "레시피",
        () => get().recipes,
        (recipes) => set({ recipes, error: null }),
        (error) => set({ error })
      ),

      // ID로 단건 조회
      getRecipeById: createGetEntityById<Recipe>(() => get().recipes),

      // 검색어로 조회
      searchRecipes: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().recipes.filter((recipe) =>
          recipe.recipeName.toLowerCase().includes(lowerQuery)
        );
      },

      // 전체 초기화
      clearAllRecipes: () => {
        set({ recipes: [], error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      // Service를 통해 데이터 로드
      // force: true면 persist 데이터가 있어도 서버에서 다시 로드
      loadRecipes: async (force: boolean = false) => {
        const state = get();
        // persist로 복원된 데이터가 있고 강제 로드가 아니면 서버 요청 생략
        if (!force && state.recipes.length > 0 && state.lastSyncedAt) {
          const timeSinceSync = Date.now() - state.lastSyncedAt;
          // 5분 이내에 동기화했으면 서버 요청 생략
          if (timeSinceSync < 5 * 60 * 1000) {
            return;
          }
        }

        try {
          set({ isLoading: true, error: null });
          const response = await recipeService.getAllRecipes();
          if (response.success && response.data) {
            set({
              recipes: response.data,
              error: null,
              lastSyncedAt: Date.now(),
            });
          } else {
            // 개발 환경: API 실패 시 mock 데이터 사용 (BE 연결 전까지)
            if (__DEV__ && state.recipes.length === 0) {
              set({
                recipes: mockRecipes,
                error: null,
                lastSyncedAt: Date.now(),
              });
            } else {
              set({
                error:
                  response.message ?? "레시피 목록을 불러오는데 실패했습니다.",
                lastSyncedAt: Date.now(), // 에러 시에도 설정하여 재시도 방지
              });
            }
          }
        } catch (error: unknown) {
          // 개발 환경: 네트워크 에러 시 mock 데이터 사용 (BE 연결 전까지)
          if (__DEV__ && state.recipes.length === 0) {
            set({
              recipes: mockRecipes,
              error: null,
              lastSyncedAt: Date.now(),
            });
          } else {
            const errorMessage = getErrorMessage(
              error,
              "레시피 목록을 불러오는 중 오류가 발생했습니다."
            );
            set({
              error: errorMessage,
              lastSyncedAt: Date.now(), // 에러 시에도 설정하여 재시도 방지
            });
          }
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "recipe-storage",
      storage:
        createSecureStorage<Pick<RecipeState, "recipes" | "lastSyncedAt">>(),
      // error와 isLoading은 임시 상태이므로 persist에서 제외
      partialize: (state) => ({
        recipes: state.recipes,
        lastSyncedAt: state.lastSyncedAt,
      }),
      // 하이드레이션 완료 후 검증 및 정리
      onRehydrateStorage: () => (state) => {
        if (state) {
          const validatedRecipes = validateArray<Recipe>(
            state.recipes,
            "RecipeStore"
          );
          state.recipes = validatedRecipes;
          state.lastSyncedAt = validateSyncTimestamp(
            state.lastSyncedAt,
            "RecipeStore"
          );
        } else {
          // state가 없으면 초기값으로 설정
          return {
            recipes: initialRecipes,
            lastSyncedAt: null,
          };
        }
      },
    }
  )
);
