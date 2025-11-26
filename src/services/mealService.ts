// Meal service for managing meals/meals consumed by users
import {
  Meal,
  MealCreatePayload,
  MealQueryParams,
  MealStatistics,
  MealUpdatePayload,
} from "../types/meal";
import apiClient, { ApiResponse } from "./apiClient";

class MealService {
  private readonly basePath = "/meals";

  /**
   * Get all meals for the current user
   */
  async getMeals(params?: MealQueryParams): Promise<ApiResponse<Meal[]>> {
    let endpoint = this.basePath;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.date) {
        searchParams.append("date", params.date);
      }
      if (params.startDate) {
        searchParams.append("startDate", params.startDate);
      }
      if (params.endDate) {
        searchParams.append("endDate", params.endDate);
      }
      // FE 타입은 mealType 이지만,
      // BE FastAPI에서는 Query(alias="type") 로 정의되어 있어
      // 실제 쿼리 키는 "type" 이어야 함
      if (params.mealType) {
        searchParams.append("type", params.mealType);
      }
      if (params.recipeId) {
        searchParams.append("recipeId", params.recipeId);
      }

      const queryString = searchParams.toString();
      if (queryString) {
        endpoint = `${endpoint}?${queryString}`;
      }
    }

    return await apiClient.get<Meal[]>(endpoint);
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
  async createMeal(payload: MealCreatePayload): Promise<ApiResponse<Meal>> {
    return await apiClient.post<Meal>(this.basePath, payload);
  }

  /**
   * Update an existing meal
   */
  async updateMeal(
    mealId: string,
    payload: MealUpdatePayload
  ): Promise<ApiResponse<Meal>> {
    return await apiClient.put<Meal>(`${this.basePath}/${mealId}`, payload);
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
   * Get meal statistics for the current user
   */
  async getMealStatistics(): Promise<ApiResponse<MealStatistics>> {
    return await apiClient.get<MealStatistics>(`${this.basePath}/statistics`);
  }
}

export const mealService = new MealService();
export default mealService;
