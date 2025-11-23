// Mock Meal service for development
import { Meal } from "../stores/useMealStore";
import { ApiResponse } from "./apiClient";

class MealServiceMock {
  /**
   * Get all meals for the current user (mock)
   */
  async getAllMeals(): Promise<ApiResponse<Meal[]>> {
    return {
      success: true,
      data: [],
    };
  }

  /**
   * Get meals by date range (mock)
   */
  async getMealsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Meal[]>> {
    return {
      success: true,
      data: [],
    };
  }

  /**
   * Get a specific meal by ID (mock)
   */
  async getMealById(mealId: string): Promise<ApiResponse<Meal>> {
    return {
      success: false,
      error: "식사를 찾을 수 없습니다.",
      message: "식사를 찾을 수 없습니다.",
    };
  }

  /**
   * Create a new meal entry (mock)
   */
  async createMeal(meal: Omit<Meal, "id">): Promise<ApiResponse<Meal>> {
    const newMeal: Meal = {
      ...meal,
      id: `mock-meal-${Date.now()}`,
    };
    return {
      success: true,
      data: newMeal,
    };
  }

  /**
   * Update an existing meal (mock)
   */
  async updateMeal(
    mealId: string,
    updatedMeal: Partial<Meal>
  ): Promise<ApiResponse<Meal>> {
    return {
      success: false,
      error: "식사를 찾을 수 없습니다.",
      message: "식사를 찾을 수 없습니다.",
    };
  }

  /**
   * Delete a meal (mock)
   */
  async deleteMeal(mealId: string): Promise<ApiResponse<void>> {
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * Get meals filtered by meal type (mock)
   */
  async getMealsByType(
    mealType: Meal["mealType"]
  ): Promise<ApiResponse<Meal[]>> {
    return {
      success: true,
      data: [],
    };
  }

  /**
   * Get meals by recipe ID (mock)
   */
  async getMealsByRecipe(recipeId: string): Promise<ApiResponse<Meal[]>> {
    return {
      success: true,
      data: [],
    };
  }

  /**
   * Get meals for a specific date (mock)
   */
  async getMealsByDate(date: string): Promise<ApiResponse<Meal[]>> {
    return {
      success: true,
      data: [],
    };
  }

  /**
   * Get meal statistics for the current user (mock)
   */
  async getMealStatistics(): Promise<
    ApiResponse<{
      totalCalories: number;
      totalMeals: number;
      averagePerMeal: number;
    }>
  > {
    return {
      success: true,
      data: {
        totalCalories: 0,
        totalMeals: 0,
        averagePerMeal: 0,
      },
    };
  }
}

export const mealServiceMock = new MealServiceMock();
export default mealServiceMock;
