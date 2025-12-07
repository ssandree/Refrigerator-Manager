// recipService.ts
// Recipe service for managing recipes
import { Recipe, RecipeFilterParams, RecommendItem } from "../types/recipe";
import { logger } from "../utils/logger";
import apiClient, { ApiResponse } from "./apiClient";

class RecipeService {
  private readonly basePath = "/recipes";

  /**
   * Get all recipes
   * 백엔드 응답: { success: true, data: Recipe[], total: number }
   */
  async getAllRecipes(
    limit?: number,
    skip?: number
  ): Promise<ApiResponse<Recipe[]>> {
    logger.log("[RecipeService] getAllRecipes 호출됨", { limit, skip });
    const searchParams = new URLSearchParams();
    if (limit !== undefined) {
      searchParams.append("limit", String(limit));
    }
    if (skip !== undefined) {
      searchParams.append("skip", String(skip));
    }
    const query = searchParams.toString();
    const endpoint = query ? `${this.basePath}?${query}` : this.basePath;
    logger.log("[RecipeService] API 엔드포인트:", endpoint);
    const response = await apiClient.get<Recipe[]>(endpoint);
    logger.log("[RecipeService] getAllRecipes 응답:", response);
    return response;
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
   * 백엔드 응답: { success: true, data: Recipe[], total: number }
   */
  async searchRecipes(
    query: string,
    limit?: number
  ): Promise<ApiResponse<Recipe[]>> {
    const searchParams = new URLSearchParams();
    searchParams.append("q", query);
    if (limit) {
      searchParams.append("limit", String(limit));
    }
    return await apiClient.get<Recipe[]>(
      `${this.basePath}/search?${searchParams.toString()}`
    );
  }

  /**
   * Filter recipes
   * 백엔드 응답: { success: true, data: Recipe[], total: number }
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

    const endpoint = searchParams.toString()
      ? `${this.basePath}/filter?${searchParams.toString()}`
      : `${this.basePath}/filter`;

    return await apiClient.get<Recipe[]>(endpoint);
  }

  /**
   * Get recommended recipes (RecommendItem[])
   * 백엔드 응답: { success: true, data: RecommendItem[], total: number }
   */
  async getDashboardRecommendations(
    limit?: number,
    skip?: number
  ): Promise<ApiResponse<RecommendItem[]>> {
    logger.log("[RecipeService] getDashboardRecommendations 호출:", {
      limit,
      skip,
      basePath: this.basePath,
    });
    const searchParams = new URLSearchParams();
    if (limit !== undefined) {
      searchParams.append("limit", String(limit));
    }
    if (skip !== undefined) {
      searchParams.append("skip", String(skip));
    }
    const query = searchParams.toString();
    const endpoint = query
      ? `${this.basePath}/recommend?${query}`
      : `${this.basePath}/recommend`;
    logger.log("[RecipeService] 최종 엔드포인트:", endpoint);
    logger.log("[RecipeService] 쿼리 파라미터:", query);
    return await apiClient.get<RecommendItem[]>(endpoint);
  }
}

export const recipeService = new RecipeService();
export default recipeService;
