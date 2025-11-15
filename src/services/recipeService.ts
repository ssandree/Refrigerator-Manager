// Recipe service for managing recipes
import { mockRecipes, Recipe } from "../data/mockRecipes";
import apiClient, { ApiResponse } from "./api";

class RecipeService {
  private readonly basePath = "/recipes";

  /**
   * Get all recipes
   * TODO: BE API 연결 시 apiClient.get으로 변경
   */
  async getAllRecipes(): Promise<ApiResponse<Recipe[]>> {
    // 현재는 mockData 반환, 나중에 BE API 연결 시 아래 주석 해제
    // return await apiClient.get<Recipe[]>(this.basePath);

    return {
      success: true,
      data: mockRecipes,
    };
  }

  /**
   * Get recipe by ID
   */
  async getRecipeById(recipeId: string) {
    return await apiClient.get<Recipe>(`${this.basePath}/${recipeId}`);
  }

  /**
   * Search recipes by query
   */
  async searchRecipes(query: string) {
    return await apiClient.get<Recipe[]>(`${this.basePath}/search?q=${query}`);
  }

  /**
   * Get recipes by tags
   */
  async getRecipesByTags(tags: string[]) {
    return await apiClient.post<Recipe[]>(`${this.basePath}/filter-by-tags`, {
      tags,
    });
  }

  /**
   * Get recipes by difficulty
   */
  async getRecipesByDifficulty(difficulty: Recipe["difficulty"]) {
    return await apiClient.get<Recipe[]>(
      `${this.basePath}/difficulty/${difficulty}`
    );
  }

  /**
   * Get recipes by time category
   */
  async getRecipesByTimeCategory(timeCategory: string) {
    return await apiClient.get<Recipe[]>(
      `${this.basePath}/time/${timeCategory}`
    );
  }

  /**
   * Get recommended recipes based on user's ingredients
   */
  async getRecommendedRecipes(ingredientIds: string[]) {
    return await apiClient.post<Recipe[]>(`${this.basePath}/recommend`, {
      ingredientIds,
    });
  }
}

export const recipeService = new RecipeService();
export default recipeService;
