// 레시피 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import favoriteRecipeServiceApi from "../services/favoriteRecipeService";
import recipeServiceApi from "../services/recipeService";
import { Recipe } from "../types/recipe";
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

export const useRecipeStore = create<RecipeState>()(
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

          // 레시피와 즐겨찾기 목록을 병렬로 로드
          const [recipesResponse, favoritesResponse] = await Promise.all([
            recipeServiceApi.getAllRecipes(),
            favoriteRecipeServiceApi
              .getAllFavorites()
              .catch(() => ({ success: false, data: [] })),
          ]);

          if (recipesResponse.success && recipesResponse.data) {
            // 즐겨찾기 레시피 ID 집합 생성
            const favoriteRecipeIds = new Set<string>();
            if (favoritesResponse.success && favoritesResponse.data) {
              favoritesResponse.data.forEach((recipe) => {
                favoriteRecipeIds.add(recipe.id);
              });
            }

            // 냉장고 재료 목록 가져오기 (다른 스토어에서)
            const { useFridgeStore } = await import("./useFridgeStore");
            const fridgeState = useFridgeStore.getState();
            const userFoods = fridgeState.foods;
            const userFoodNames = new Set(
              userFoods.map((food) => food.name.toLowerCase())
            );

            // 각 레시피에 UI 필드 계산 및 추가
            const enrichedRecipes: Recipe[] = recipesResponse.data.map(
              (recipe) => {
                // ingredientsOwned, totalIngredients 계산
                const requiredfoods = recipe.requiredfoods || [];
                const totalIngredients = requiredfoods.length;
                const ingredientsOwned = requiredfoods.filter((foodName) =>
                  userFoodNames.has(foodName.toLowerCase())
                ).length;

                // isFavorite 확인 (백엔드 응답에 있으면 사용, 없으면 즐겨찾기 목록에서 확인)
                const isFavorite =
                  recipe.isFavorite !== undefined
                    ? recipe.isFavorite
                    : favoriteRecipeIds.has(recipe.id);

                return {
                  ...recipe,
                  ingredientsOwned,
                  totalIngredients,
                  isFavorite,
                };
              }
            );

            set({
              recipes: enrichedRecipes,
              error: null,
              lastSyncedAt: Date.now(),
            });
          } else {
            set({
              error:
                recipesResponse.message ??
                "레시피 목록을 불러오는데 실패했습니다.",
              lastSyncedAt: Date.now(), // 에러 시에도 설정하여 재시도 방지
            });
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "레시피 목록을 불러오는 중 오류가 발생했습니다."
          );
          set({
            error: errorMessage,
            lastSyncedAt: Date.now(), // 에러 시에도 설정하여 재시도 방지
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "recipe-storage",
      version: 2,
      migrate: (persistedState: any, version) => {
        if (!persistedState) {
          return persistedState;
        }
        if (version < 2) {
          return {
            ...persistedState,
            recipes: initialRecipes,
            lastSyncedAt: null,
          };
        }
        return persistedState;
      },
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
