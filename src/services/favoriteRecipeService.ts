// Favorite recipe service for managing user's favorite recipes
import { Recipe } from "../types/recipe";
import apiClientInstance, { ApiResponse } from "./apiClient";

class FavoriteRecipeService {
  private readonly basePath = "/favorite-recipes";

  /**
   * Get all favorite recipes for the current user
   */
  async getAllFavorites(): Promise<ApiResponse<Recipe[]>> {
    // BE: RecipeListResponse(BaseResponse + data: Recipe[])
    // FE: ApiResponse<Recipe[]> 로 data 배열만 전달받음
    return await apiClientInstance.get<Recipe[]>(this.basePath);
  }

  /**
   * Add a recipe to favorites
   */
  async addToFavorites(recipeId: string): Promise<ApiResponse<Recipe>> {
    // BE: SingleRecipeResponse(BaseResponse + data: RecipeResponse)
    // FE: ApiResponse<Recipe> 로 data(단일 레시피)만 전달받음
    return await apiClientInstance.post<Recipe>(
      `${this.basePath}/${recipeId}`,
      {}
    );
  }

  /**
   * Remove a recipe from favorites
   */
  async removeFromFavorites(recipeId: string): Promise<ApiResponse<void>> {
    // BE: DeleteFavoriteResponse(BaseResponse, data 없음, message 필수)
    // FE: ApiResponse<void> 로 success / message 만 사용
    return await apiClientInstance.delete<void>(`${this.basePath}/${recipeId}`);
  }

  /**
   * Check if a recipe is in favorites
   */
  async checkIfFavorite(
    recipeId: string
  ): Promise<ApiResponse<{ isFavorite: boolean }>> {
    // BE: CheckFavoriteResponse(BaseResponse + data: { isFavorite: bool })
    // FE: ApiResponse<{ isFavorite: boolean }> 로 data 객체만 전달받음
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
}

export const favoriteRecipeService = new FavoriteRecipeService();
export default favoriteRecipeService;
