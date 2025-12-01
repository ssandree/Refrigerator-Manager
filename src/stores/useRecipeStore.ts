// useRecipeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import recipeServiceApi from "../services/recipeService";
import { Recipe, RecommendItem } from "../types/recipe";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import {
  createAddEntity,
  createGetEntityById,
  createRemoveEntity,
  createUpdateEntity,
} from "./storeCrudHelpers";
import { validateArray, validateSyncTimestamp } from "./storeUtils";

// initial
const initialRecipes: Recipe[] = [];

// merge helper
const mergeRecipes = (current: Recipe[], incoming: Recipe[]): Recipe[] => {
  const map = new Map(current.map((r) => [r.id, r]));
  incoming.forEach((r) => map.set(r.id, r));
  return [...map.values()];
};

// Convert RecommendItem → Recipe
function convertRecommendToRecipe(item: RecommendItem): Recipe {
  return {
    id: item.id,
    recipeName: item.recipeName,
    calories: item.scoreDetails?.calories ?? 0,
    healthGoal: null,
    imageUrl: item.imageUrl ?? null,
    sourceUrl: item.sourceUrl ?? null, // ⭐ 추가
    requiredfoods: item.requiredfoods ?? [], // ⭐ 추가

    carbohydrates: item.carbohydrates ?? null,
    protein: item.protein ?? null,
    fat: item.fat ?? null,
    sodium: item.sodium ?? null,
    vitamin_c: item.vitamin_c ?? null,
    vitamin_d: item.vitamin_d ?? null,
    zinc: item.zinc ?? null,

    ingredientsOwned: item.foodsOwned,
    totalIngredients: item.totalFoods,
  };
}

interface RecipeState {
  recipes: Recipe[];
  error: string | null;
  isLoading: boolean;
  lastSyncedAt: number | null;

  addRecipe: (recipe: Recipe) => boolean;
  updateRecipe: (id: string, data: Partial<Recipe>) => boolean;
  removeRecipe: (id: string) => boolean;

  getRecipeById: (id: string) => Recipe | undefined;
  fetchRecipeById: (id: string) => Promise<Recipe | null>;

  searchRecipes: (query: string) => Promise<Recipe[]>;
  filterRecipes: (params: any) => Promise<Recipe[]>;
  loadDashboardRecommendations: () => Promise<Recipe[]>;

  loadRecipes: (force?: boolean) => Promise<void>;

  clearAllRecipes: () => void;
  clearError: () => void;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: initialRecipes,
      error: null,
      isLoading: false,
      lastSyncedAt: null,

      addRecipe: createAddEntity(
        "레시피",
        () => get().recipes,
        (recipes) => set({ recipes }),
        (error) => set({ error }) // ★ 추가
      ),

      updateRecipe: createUpdateEntity(
        "레시피",
        () => get().recipes,
        (recipes) => set({ recipes }),
        (error) => set({ error }) // ★ 추가
      ),

      removeRecipe: createRemoveEntity(
        "레시피",
        () => get().recipes,
        (recipes) => set({ recipes }),
        (error) => set({ error }) // ★ 추가
      ),

      getRecipeById: createGetEntityById(() => get().recipes),

      fetchRecipeById: async (id) => {
        try {
          set({ isLoading: true, error: null });

          const res = await recipeServiceApi.getRecipeById(id);
          if (res.success && res.data) {
            const recipe = res.data.data; // BE: { data: Recipe }
            set({
              recipes: mergeRecipes(get().recipes, [recipe]),
              lastSyncedAt: Date.now(),
            });
            return recipe;
          }
          set({ error: res.message ?? "레시피 조회 실패" });
          return null;
        } catch (err) {
          set({ error: getErrorMessage(err, "레시피 조회 오류") });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      searchRecipes: async (query, limit?: number) => {
        try {
          set({ isLoading: true, error: null });

          const res = await recipeServiceApi.searchRecipes(query, limit);
          if (res.success && res.data) {
            const recipes = res.data.data; // { total, data }
            const merged = mergeRecipes(get().recipes, recipes);
            set({ recipes: merged, lastSyncedAt: Date.now() });
            return recipes;
          }
          set({ error: res.message });
          return [];
        } catch (err) {
          set({ error: getErrorMessage(err, "검색 오류") });
          return [];
        } finally {
          set({ isLoading: false });
        }
      },

      filterRecipes: async (params) => {
        try {
          set({ isLoading: true, error: null });

          const res = await recipeServiceApi.filterRecipes(params);
          if (res.success && res.data) {
            const recipes = res.data.data; // { total, data }
            const merged = mergeRecipes(get().recipes, recipes);
            set({ recipes: merged, lastSyncedAt: Date.now() });
            return recipes;
          }
          set({ error: res.message });
          return [];
        } catch (err) {
          set({ error: getErrorMessage(err, "필터 오류") });
          return [];
        } finally {
          set({ isLoading: false });
        }
      },

      loadDashboardRecommendations: async () => {
        try {
          set({ isLoading: true, error: null });

          const res = await recipeServiceApi.getDashboardRecommendations();
          if (res.success && res.data) {
            const converted = res.data.map(convertRecommendToRecipe);
            const merged = mergeRecipes(get().recipes, converted);
            set({ recipes: merged, lastSyncedAt: Date.now() });
            return converted;
          }
          set({ error: res.message });
          return [];
        } catch (err) {
          set({ error: getErrorMessage(err, "추천 불러오기 오류") });
          return [];
        } finally {
          set({ isLoading: false });
        }
      },

      loadRecipes: async (force = false) => {
        const state = get();

        if (!force && state.lastSyncedAt && state.recipes.length > 0) {
          if (Date.now() - state.lastSyncedAt < 5 * 60 * 1000) return;
        }

        try {
          set({ isLoading: true, error: null });

          const res = await recipeServiceApi.getAllRecipes();
          if (res.success && res.data) {
            const recipes = res.data.data; // { total, data }
            set({
              recipes,
              lastSyncedAt: Date.now(),
            });
          }
        } catch (err) {
          set({ error: getErrorMessage(err, "레시피 로드 오류") });
        } finally {
          set({ isLoading: false });
        }
      },

      clearAllRecipes: () => set({ recipes: [], error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "recipe-storage",
      version: 2,
      storage:
        createSecureStorage<Pick<RecipeState, "recipes" | "lastSyncedAt">>(),
      partialize: (state) => ({
        recipes: state.recipes,
        lastSyncedAt: state.lastSyncedAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.recipes = validateArray(state.recipes, "RecipeStore");
          state.lastSyncedAt = validateSyncTimestamp(
            state.lastSyncedAt,
            "RecipeStore"
          );
        }
      },
    }
  )
);
