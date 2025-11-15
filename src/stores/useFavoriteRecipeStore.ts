// 즐겨찾기 레시피 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Recipe } from "../data/mockRecipes";
import { createSecureStorage } from "./storage";
import { validateArray } from "./storeUtils";

// 스토어 상태 및 액션 타입 정의
interface FavoriteRecipeState {
  favoriteRecipes: Recipe[];
  // 레시피를 즐겨찾기에 추가 (중복 방지)
  addToFavorites: (recipe: Recipe) => void;
  // 특정 레시피를 즐겨찾기에서 제거
  removeFromFavorites: (recipeId: string) => void;
  // 주어진 레시피가 즐겨찾기인지 여부 확인
  isFavorite: (recipeId: string) => boolean;
  // 즐겨찾기 상태 토글 (추가/제거)
  toggleFavorite: (recipe: Recipe) => void;
}

export const useFavoriteRecipeStore = create<FavoriteRecipeState>(
  persist(
    (set, get) => ({
      favoriteRecipes: [],

      // 즐겨찾기 추가 (이미 존재하면 무시)
      addToFavorites: (recipe) => {
        set((state) => {
          if (state.favoriteRecipes.find((r) => r.id === recipe.id)) {
            return state;
          }
          return {
            favoriteRecipes: [
              ...state.favoriteRecipes,
              { ...recipe, isFavorite: true },
            ],
          };
        });
      },

      // 즐겨찾기 제거
      removeFromFavorites: (recipeId) => {
        set((state) => ({
          favoriteRecipes: state.favoriteRecipes.filter(
            (recipe) => recipe.id !== recipeId
          ),
        }));
      },

      // 즐겨찾기 여부 확인
      isFavorite: (recipeId) => {
        return get().favoriteRecipes.some((recipe) => recipe.id === recipeId);
      },

      // 즐겨찾기 토글 (있으면 제거, 없으면 추가)
      toggleFavorite: (recipe) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        if (isFavorite(recipe.id)) {
          removeFromFavorites(recipe.id);
        } else {
          addToFavorites(recipe);
        }
      },
    }),
    {
      name: "favorite-recipe-storage",
      storage:
        createSecureStorage<Pick<FavoriteRecipeState, "favoriteRecipes">>(),
      partialize: (state) => ({
        favoriteRecipes: state.favoriteRecipes,
      }),
      // 하이드레이션 완료 후 검증
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.favoriteRecipes = validateArray<Recipe>(
            state.favoriteRecipes,
            "FavoriteRecipeStore"
          );
        }
      },
    }
  )
);
