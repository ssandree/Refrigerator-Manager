// Favorite recipe service for managing user's favorite recipes
import { Recipe } from "../types/recipe";
import apiClientInstance, { ApiResponse } from "./apiClient";

class FavoriteRecipeService {
  private readonly basePath = "/favorite-recipes";

  /**
   * Get all favorite recipes for the current user
   */
  async getAllFavorites(): Promise<ApiResponse<Recipe[]>> {
    return await apiClientInstance.get<Recipe[]>(this.basePath);
  }

  /**
   * Add a recipe to favorites
   */
  async addToFavorites(recipeId: string) {
    return await apiClientInstance.post<Recipe>(
      `${this.basePath}/${recipeId}`,
      {}
    );
  }

  /**
   * Remove a recipe from favorites
   */
  async removeFromFavorites(recipeId: string) {
    return await apiClientInstance.delete<{ message: string }>(
      `${this.basePath}/${recipeId}`
    );
  }

  /**
   * Check if a recipe is in favorites
   */
  async checkIfFavorite(recipeId: string) {
    return await apiClientInstance.get<{ isFavorite: boolean }>(
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
    const queryParams = tags
      .map((tag) => `tags=${encodeURIComponent(tag)}`)
      .join("&");
    return await apiClientInstance.get<Recipe[]>(
      `${this.basePath}/filter-by-tags?${queryParams}`
    );
  }
}

export const favoriteRecipeService = new FavoriteRecipeService();
export default favoriteRecipeService;
