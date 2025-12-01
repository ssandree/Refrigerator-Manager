// recipService.ts
// Recipe service for managing recipes
import { Recipe, RecipeFilterParams, RecommendItem } from "../types/recipe";
import apiClient, { ApiResponse } from "./apiClient";

class RecipeService {
  private readonly basePath = "/recipes";

  /**
   * Get all recipes
   */
  async getAllRecipes(): Promise<
    ApiResponse<{ total: number; data: Recipe[] }>
  > {
    return await apiClient.get<{ total: number; data: Recipe[] }>(
      this.basePath
    );
  }

  /**
   * Get recipe by ID
   */
  async getRecipeById(
    recipeId: string
  ): Promise<ApiResponse<{ data: Recipe }>> {
    return await apiClient.get<{ data: Recipe }>(
      `${this.basePath}/${recipeId}`
    );
  }

  /**
   * Search recipes by query
   */
  async searchRecipes(
    query: string,
    limit?: number
  ): Promise<ApiResponse<{ total: number; data: Recipe[] }>> {
    const searchParams = new URLSearchParams();
    searchParams.append("q", query);
    if (limit) {
      searchParams.append("limit", String(limit));
    }
    return await apiClient.get<{ total: number; data: Recipe[] }>(
      `${this.basePath}/search/?${searchParams.toString()}`
    );
  }

  /**
   * Filter recipes
   */
  async filterRecipes(
    params: RecipeFilterParams
  ): Promise<ApiResponse<{ total: number; data: Recipe[] }>> {
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

    const endpoint = searchParams.toString()
      ? `${this.basePath}/filter?${searchParams.toString()}`
      : `${this.basePath}/filter`;

    return await apiClient.get<{ total: number; data: Recipe[] }>(endpoint);
  }

  /**
   * Get recommended recipes (RecommendItem[])
   */
  async getDashboardRecommendations(): Promise<ApiResponse<RecommendItem[]>> {
    return await apiClient.get<RecommendItem[]>(`${this.basePath}/recommend`);
  }
}

export const recipeService = new RecipeService();
export default recipeService;
