// Recipe service for managing recipes
import { Recipe } from "../types/recipe";
import apiClientInstance, { ApiResponse } from "./apiClient";

class RecipeService {
  private readonly basePath = "/recipes";

  /**
   * Get all recipes
   */
  async getAllRecipes(): Promise<ApiResponse<Recipe[]>> {
    return await apiClientInstance.get<Recipe[]>(this.basePath);
  }

  /**
   * Get recipe by ID
   */
  async getRecipeById(recipeId: string): Promise<ApiResponse<Recipe>> {
    return await apiClientInstance.get<Recipe>(`${this.basePath}/${recipeId}`);
  }

  /**
   * Search recipes by query
   */
  async searchRecipes(query: string) {
    return await apiClientInstance.get<Recipe[]>(
      `${this.basePath}/search/?q=${encodeURIComponent(query)}`
    );
  }

  /**
   * Get recipes by tags
   */
  async getRecipesByTags(tags: string[]) {
    const queryParams = tags
      .map((tag) => `tags=${encodeURIComponent(tag)}`)
      .join("&");
    return await apiClientInstance.get<Recipe[]>(
      `${this.basePath}/filter-by-tags?${queryParams}`
    );
  }

  /**
   * Get recipes by difficulty
   */
  async getRecipesByDifficulty(difficulty: Recipe["difficulty"]) {
    return await apiClientInstance.get<Recipe[]>(
      `${this.basePath}/difficulty/${difficulty}`
    );
  }

  /**
   * Get recipes by time category
   */
  async getRecipesByTimeCategory(timeCategory: string) {
    return await apiClientInstance.get<Recipe[]>(
      `${this.basePath}/time/${timeCategory}`
    );
  }

  /**
   * Get recommended recipes based on user's ingredients
   */
  async getRecommendedRecipes() {
    return await apiClientInstance.get<Recipe[]>(`${this.basePath}/recommend`);
  }

  /**
   * Get dashboard recommendations (상위 추천 레시피)
   */
  async getDashboardRecommendations(): Promise<ApiResponse<Recipe[]>> {
    return await apiClientInstance.get<Recipe[]>("/dashboard/recommendations");
  }
}

export const recipeService = new RecipeService();
export default recipeService;
