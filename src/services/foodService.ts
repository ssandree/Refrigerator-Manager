// Fridge/Food service for managing refrigerator contents
import { Food } from "../types/food";
import apiClientInstance, { ApiResponse } from "./apiClient";

export interface FoodQueryParams {
  category?: string | null;
  location?: string | null;
  expired?: boolean | null;
  expiring?: boolean | null;
  sort?: string | null;
}

class FoodService {
  private readonly basePath = "/foods";

  /**
   * Get all foods in the fridge
   */
  async getAllFoods(params?: FoodQueryParams): Promise<ApiResponse<Food[]>> {
    let endpoint = this.basePath;

    if (params) {
      const searchParams = new URLSearchParams();

      if (params.category) {
        searchParams.append("category", params.category);
      }
      if (params.location) {
        searchParams.append("location", params.location);
      }
      if (typeof params.expired === "boolean") {
        searchParams.append("expired", params.expired.toString());
      }
      if (typeof params.expiring === "boolean") {
        searchParams.append("expiring", params.expiring.toString());
      }
      if (params.sort) {
        searchParams.append("sort", params.sort);
      }

      const queryString = searchParams.toString();
      if (queryString) {
        endpoint = `${endpoint}?${queryString}`;
      }
    }

    return await apiClientInstance.get<Food[]>(endpoint);
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
  async deleteFood(foodId: string): Promise<ApiResponse<void>> {
    // BE: DeleteResponse(BaseResponse, data 없음, message 필수)
    // FE: ApiResponse<void> 로 success / message만 사용
    return await apiClientInstance.delete<void>(`${this.basePath}/${foodId}`);
  }

  /**
   * Bulk delete foods
   */
  async bulkDeleteFoods(foodIds: string[]): Promise<ApiResponse<void>> {
    // BE: DELETE /foods, body: { foodIds: string[] }, 응답: BulkDeleteResponse(BaseResponse + deletedCount, message)
    // 현재 FE에서는 삭제 성공 여부만 필요하므로 ApiResponse<void> 로 처리 (deletedCount는 사용하지 않음)
    return await apiClientInstance.delete<void>(this.basePath, {
      foodIds,
    });
  }
}

export const foodService = new FoodService();
export default foodService;
