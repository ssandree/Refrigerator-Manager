// Recipe service for managing recipes
import { Recipe, type RecipeFilterParams } from "../types/recipe";
import apiClient, { ApiResponse } from "./apiClient";

class RecipeService {
  private readonly basePath = "/recipes";

  /**
   * Get all recipes
   */
  async getAllRecipes(): Promise<ApiResponse<Recipe[]>> {
    // GET /recipes
    return await apiClient.get<Recipe[]>(this.basePath);
  }

  /**
   * Get recipe by ID
   */
  async getRecipeById(recipeId: string): Promise<ApiResponse<Recipe>> {
    // GET /recipes/{recipe_id}
    return await apiClient.get<Recipe>(`${this.basePath}/${recipeId}`);
  }

  /**
   * Search recipes by query
   */
  async searchRecipes(query: string): Promise<ApiResponse<Recipe[]>> {
    // GET /recipes/search/?q={query}
    return await apiClient.get<Recipe[]>(
      `${this.basePath}/search/?q=${encodeURIComponent(query)}`
    );
  }

  /**
   * Filter recipes
   * - ingredients: 이 재료들을 모두 포함하는 레시피만 조회
   * - expiringOnly: 임박 재료(3일 이내 만료) 포함 레시피만 조회
   * - minCalories / maxCalories: 칼로리 범위 필터
   *
   * GET /recipes/filter
   */
  async filterRecipes(
    params: RecipeFilterParams
  ): Promise<ApiResponse<Recipe[]>> {
    const searchParams = new URLSearchParams();

    if (params.ingredients && params.ingredients.length > 0) {
      params.ingredients.forEach((ingredient) =>
        searchParams.append("ingredients", ingredient)
      );
    }

    if (typeof params.expiringOnly === "boolean") {
      searchParams.append("expiringOnly", String(params.expiringOnly));
    }

    if (typeof params.minCalories === "number") {
      searchParams.append("minCalories", String(params.minCalories));
    }

    if (typeof params.maxCalories === "number") {
      searchParams.append("maxCalories", String(params.maxCalories));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/filter?${queryString}`
      : `${this.basePath}/filter`;

    return await apiClient.get<Recipe[]>(endpoint);
  }

  /**
   * Get recommended recipes based on user's ingredients
   */
  async getDashboardRecommendations(): Promise<ApiResponse<Recipe[]>> {
    // BE: GET /recipes/recommend → { success, data: Recipe[] }
    // 대시보드/추천 레시피 용도로 재사용
    return await apiClient.get<Recipe[]>(`${this.basePath}/recommend`);
  }
}

export const recipeService = new RecipeService();
export default recipeService;
