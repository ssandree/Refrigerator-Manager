// Favorite recipe service for managing user's favorite recipes
import { Recipe } from "../data/mockRecipes";
import apiClient, { ApiResponse } from "./api";

class FavoriteRecipeService {
  private readonly basePath = "/favorite-recipes";

  /**
   * Get all favorite recipes for the current user
   * TODO: BE API 연결 시 실제 API 호출로 변경
   */
  async getAllFavorites(): Promise<ApiResponse<Recipe[]>> {
    // 현재는 빈 배열 반환, 나중에 BE API 연결 시 아래 주석 해제
    // return await apiClient.get<Recipe[]>(this.basePath);

    return {
      success: true,
      data: [],
    };
  }

  /**
   * Add a recipe to favorites
   */
  async addToFavorites(recipeId: string) {
    return await apiClient.post<Recipe>(`${this.basePath}/${recipeId}`, {});
  }

  /**
   * Remove a recipe from favorites
   */
  async removeFromFavorites(recipeId: string) {
    return await apiClient.delete(`${this.basePath}/${recipeId}`);
  }

  /**
   * Check if a recipe is in favorites
   */
  async checkIfFavorite(recipeId: string) {
    return await apiClient.get<{ isFavorite: boolean }>(
      `${this.basePath}/${recipeId}/check`
    );
  }

  /**
   * Toggle favorite status of a recipe
   */
  async toggleFavorite(recipeId: string) {
    const checkResponse = await this.checkIfFavorite(recipeId);

    if (!checkResponse.success || !checkResponse.data) {
      return checkResponse;
    }

    if (checkResponse.data.isFavorite) {
      return await this.removeFromFavorites(recipeId);
    } else {
      return await this.addToFavorites(recipeId);
    }
  }

  /**
   * Get favorite recipes by tags
   */
  async getFavoritesByTags(tags: string[]) {
    return await apiClient.post<Recipe[]>(`${this.basePath}/filter-by-tags`, {
      tags,
    });
  }
}

export const favoriteRecipeService = new FavoriteRecipeService();
export default favoriteRecipeService;
