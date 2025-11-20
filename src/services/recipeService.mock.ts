// Mock Recipe service for development
import { mockRecipes, Recipe } from "../data/mockRecipes";
import { ApiResponse } from "./api";

class RecipeServiceMock {
  /**
   * Get all recipes (mock)
   */
  async getAllRecipes(): Promise<ApiResponse<Recipe[]>> {
    return {
      success: true,
      data: mockRecipes,
    };
  }

  /**
   * Get recipe by ID (mock)
   */
  async getRecipeById(recipeId: string): Promise<ApiResponse<Recipe>> {
    const recipe = mockRecipes.find((r) => r.id === recipeId);
    if (recipe) {
      return {
        success: true,
        data: recipe,
      };
    }
    return {
      success: false,
      error: "레시피를 찾을 수 없습니다.",
      message: "레시피를 찾을 수 없습니다.",
    };
  }

  /**
   * Search recipes by query (mock)
   */
  async searchRecipes(query: string): Promise<ApiResponse<Recipe[]>> {
    const filtered = mockRecipes.filter((recipe) =>
      recipe.recipeName.toLowerCase().includes(query.toLowerCase())
    );
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get recipes by tags (mock)
   */
  async getRecipesByTags(tags: string[]): Promise<ApiResponse<Recipe[]>> {
    const filtered = mockRecipes.filter((recipe) =>
      tags.some((tag) => recipe.tags.includes(tag))
    );
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get recipes by difficulty (mock)
   */
  async getRecipesByDifficulty(
    difficulty: Recipe["difficulty"]
  ): Promise<ApiResponse<Recipe[]>> {
    const filtered = mockRecipes.filter(
      (recipe) => recipe.difficulty === difficulty
    );
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get recipes by time category (mock)
   */
  async getRecipesByTimeCategory(
    timeCategory: string
  ): Promise<ApiResponse<Recipe[]>> {
    const filtered = mockRecipes.filter(
      (recipe) => recipe.timeCategory === timeCategory
    );
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get recommended recipes based on user's ingredients (mock)
   */
  async getRecommendedRecipes(
    ingredientIds: string[]
  ): Promise<ApiResponse<Recipe[]>> {
    return {
      success: true,
      data: mockRecipes.slice(0, 8),
    };
  }
}

export const recipeServiceMock = new RecipeServiceMock();
export default recipeServiceMock;
