// Meal service for managing meals/meals consumed by users
import { Meal, MealStatistics } from "../stores/useMealStore";
import apiClient, { ApiResponse } from "./apiClient";

class MealService {
  private readonly basePath = "/meals";

  /**
   * Get all meals for the current user
   */
  async getAllMeals(): Promise<ApiResponse<Meal[]>> {
    return await apiClient.get<Meal[]>(this.basePath);
  }

  /**
   * Get meals by date range
   */
  async getMealsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Meal[]>> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    return await apiClient.get<Meal[]>(`${this.basePath}/range?${params}`);
  }

  /**
   * Get a specific meal by ID
   */
  async getMealById(mealId: string): Promise<ApiResponse<Meal>> {
    return await apiClient.get<Meal>(`${this.basePath}/${mealId}`);
  }

  /**
   * Create a new meal entry
   */
  async createMeal(meal: Omit<Meal, "id">): Promise<ApiResponse<Meal>> {
    return await apiClient.post<Meal>(this.basePath, meal);
  }

  /**
   * Update an existing meal
   */
  async updateMeal(
    mealId: string,
    updatedMeal: Partial<Meal>
  ): Promise<ApiResponse<Meal>> {
    return await apiClient.put<Meal>(`${this.basePath}/${mealId}`, updatedMeal);
  }

  /**
   * Delete a meal
   */
  async deleteMeal(mealId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<{ message: string }>(
      `${this.basePath}/${mealId}`
    );
  }

  /**
   * Get meals filtered by meal type
   */
  async getMealsByType(
    mealType: Meal["mealType"]
  ): Promise<ApiResponse<Meal[]>> {
    return await apiClient.get<Meal[]>(`${this.basePath}/type/${mealType}`);
  }

  /**
   * Get meals by recipe ID
   */
  async getMealsByRecipe(recipeId: string): Promise<ApiResponse<Meal[]>> {
    return await apiClient.get<Meal[]>(`${this.basePath}/recipe/${recipeId}`);
  }

  /**
   * Get meals for a specific date
   */
  async getMealsByDate(date: string): Promise<ApiResponse<Meal[]>> {
    return await apiClient.get<Meal[]>(`${this.basePath}/date/${date}`);
  }

  /**
   * Get meal statistics for the current user
   */
  async getMealStatistics(): Promise<ApiResponse<MealStatistics>> {
    return await apiClient.get<MealStatistics>(`${this.basePath}/statistics`);
  }
}

export const mealService = new MealService();
export default mealService;
