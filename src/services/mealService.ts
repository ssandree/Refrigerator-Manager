// Meal service for managing meals/meals consumed by users
import { Meal } from "../stores/useMealStore";
import apiClient, { ApiResponse } from "./api";

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
  async getMealsByDateRange(startDate: string, endDate: string) {
    return await apiClient.get<Meal[]>(
      `${this.basePath}?startDate=${startDate}&endDate=${endDate}`
    );
  }

  /**
   * Get a specific meal by ID
   */
  async getMealById(mealId: string) {
    return await apiClient.get<Meal>(`${this.basePath}/${mealId}`);
  }

  /**
   * Create a new meal entry
   */
  async createMeal(meal: Omit<Meal, "id">) {
    return await apiClient.post<Meal>(this.basePath, meal);
  }

  /**
   * Update an existing meal
   */
  async updateMeal(mealId: string, updatedMeal: Partial<Meal>) {
    return await apiClient.put<Meal>(`${this.basePath}/${mealId}`, updatedMeal);
  }

  /**
   * Delete a meal
   */
  async deleteMeal(mealId: string) {
    return await apiClient.delete(`${this.basePath}/${mealId}`);
  }

  /**
   * Get meals filtered by meal type
   */
  async getMealsByType(mealType: Meal["mealType"]) {
    return await apiClient.get<Meal[]>(`${this.basePath}/type/${mealType}`);
  }

  /**
   * Get meals by recipe ID
   */
  async getMealsByRecipe(recipeId: string) {
    return await apiClient.get<Meal[]>(`${this.basePath}/recipe/${recipeId}`);
  }

  /**
   * Get meals for a specific date
   */
  async getMealsByDate(date: string) {
    return await apiClient.get<Meal[]>(`${this.basePath}/date/${date}`);
  }

  /**
   * Get meal statistics for the current user
   */
  async getMealStatistics() {
    return await apiClient.get<{
      totalCalories: number;
      totalMeals: number;
      averagePerMeal: number;
    }>(`${this.basePath}/statistics`);
  }
}

export const mealService = new MealService();
export default mealService;
