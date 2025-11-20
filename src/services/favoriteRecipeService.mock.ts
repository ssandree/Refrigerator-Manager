// Mock Favorite recipe service for development
import { Recipe } from "../data/mockRecipes";
import { ApiResponse } from "./api";

class FavoriteRecipeServiceMock {
  /**
   * Get all favorite recipes for the current user (mock)
   */
  async getAllFavorites(): Promise<ApiResponse<Recipe[]>> {
    return {
      success: true,
      data: [],
    };
  }

  /**
   * Add a recipe to favorites (mock)
   */
  async addToFavorites(recipeId: string): Promise<ApiResponse<Recipe>> {
    return {
      success: false,
      error: "레시피를 찾을 수 없습니다.",
      message: "레시피를 찾을 수 없습니다.",
    };
  }

  /**
   * Remove a recipe from favorites (mock)
   */
  async removeFromFavorites(recipeId: string): Promise<ApiResponse<void>> {
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * Check if a recipe is in favorites (mock)
   */
  async checkIfFavorite(
    recipeId: string
  ): Promise<ApiResponse<{ isFavorite: boolean }>> {
    return {
      success: true,
      data: {
        isFavorite: false,
      },
    };
  }

  /**
   * Toggle favorite status of a recipe (mock)
   */
  async toggleFavorite(recipeId: string): Promise<ApiResponse<Recipe | void>> {
    const checkResponse = await this.checkIfFavorite(recipeId);

    if (!checkResponse.success || !checkResponse.data) {
      return checkResponse as ApiResponse<Recipe | void>;
    }

    if (checkResponse.data.isFavorite) {
      return await this.removeFromFavorites(recipeId);
    } else {
      return await this.addToFavorites(recipeId);
    }
  }

  /**
   * Get favorite recipes by tags (mock)
   */
  async getFavoritesByTags(tags: string[]): Promise<ApiResponse<Recipe[]>> {
    return {
      success: true,
      data: [],
    };
  }
}

export const favoriteRecipeServiceMock = new FavoriteRecipeServiceMock();
export default favoriteRecipeServiceMock;
