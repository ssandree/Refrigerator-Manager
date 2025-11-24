// Fridge/Food service for managing refrigerator contents
import { Food } from "../data/mockFood";
import apiClientInstance, { ApiResponse } from "./apiClient";

class FoodService {
  private readonly basePath = "/foods";

  /**
   * Get all foods in the fridge
   */
  async getAllFoods(): Promise<ApiResponse<Food[]>> {
    return await apiClientInstance.get<Food[]>(this.basePath);
  }

  /**
   * Get food by ID
   */
  async getFoodById(foodId: string) {
    return await apiClientInstance.get<Food>(`${this.basePath}/${foodId}`);
  }

  /**
   * Add a new food to the fridge
   */
  async addFood(food: Omit<Food, "id">) {
    return await apiClientInstance.post<Food>(this.basePath, food);
  }

  /**
   * Update an existing food
   */
  async updateFood(foodId: string, updatedFood: Partial<Food>) {
    return await apiClientInstance.put<Food>(
      `${this.basePath}/${foodId}`,
      updatedFood
    );
  }

  /**
   * Delete a food from the fridge
   */
  async deleteFood(foodId: string) {
    return await apiClientInstance.delete<{ message: string }>(
      `${this.basePath}/${foodId}`
    );
  }

  /**
   * Get foods by category
   */
  async getFoodsByCategory(category: string) {
    return await apiClientInstance.get<Food[]>(
      `${this.basePath}/category/${category}`
    );
  }

  /**
   * Get foods by storage location
   */
  async getFoodsByStorageLocation(location: string) {
    return await apiClientInstance.get<Food[]>(
      `${this.basePath}/location/${location}`
    );
  }

  /**
   * Get expiring foods (within specified days)
   */
  async getExpiringFoods(days?: number) {
    const endpoint =
      days !== undefined
        ? `${this.basePath}/expiring?days=${days}`
        : `${this.basePath}/expiring`;
    return await apiClientInstance.get<Food[]>(endpoint);
  }

  /**
   * Get expired foods
   */
  async getExpiredFoods() {
    return await apiClientInstance.get<Food[]>(`${this.basePath}/expired`);
  }

  /**
   * Bulk delete foods
   */
  async bulkDeleteFoods(foodIds: string[]) {
    return await apiClientInstance.delete<{
      deletedCount: number;
      message: string;
    }>(`${this.basePath}/bulk`, {
      foodIds,
    });
  }
}

export const foodService = new FoodService();
export default foodService;
