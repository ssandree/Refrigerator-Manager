// Fridge/Ingredient service for managing refrigerator contents
import { Ingredient, mockIngredients } from "../data/mockFood";
import apiClient, { ApiResponse } from "./api";

class FridgeService {
  private readonly basePath = "/fridge";

  /**
   * Get all ingredients in the fridge
   * TODO: BE API 연결 시 apiClient.get으로 변경
   */
  async getAllIngredients(): Promise<ApiResponse<Ingredient[]>> {
    // 현재는 mockData 반환, 나중에 BE API 연결 시 아래 주석 해제
    // return await apiClient.get<Ingredient[]>(`${this.basePath}/ingredients`);

    // TODO: 나중에 여기를 바꿔라 - 냉장고 화면 초기화 시 mockFood.ts에서 앞쪽 10개만 가져오도록 설정
    // 현재는 초기화를 위해 앞쪽 10개만 반환
    const initialIngredients = mockIngredients.slice(0, 10);

    return {
      success: true,
      data: initialIngredients,
    };
  }

  /**
   * Get ingredient by ID
   */
  async getIngredientById(ingredientId: string) {
    return await apiClient.get<Ingredient>(
      `${this.basePath}/ingredients/${ingredientId}`
    );
  }

  /**
   * Add a new ingredient to the fridge
   */
  async addIngredient(ingredient: Omit<Ingredient, "id">) {
    return await apiClient.post<Ingredient>(
      `${this.basePath}/ingredients`,
      ingredient
    );
  }

  /**
   * Update an existing ingredient
   */
  async updateIngredient(
    ingredientId: string,
    updatedIngredient: Partial<Ingredient>
  ) {
    return await apiClient.put<Ingredient>(
      `${this.basePath}/ingredients/${ingredientId}`,
      updatedIngredient
    );
  }

  /**
   * Delete an ingredient from the fridge
   */
  async deleteIngredient(ingredientId: string) {
    return await apiClient.delete(
      `${this.basePath}/ingredients/${ingredientId}`
    );
  }

  /**
   * Get ingredients by category
   */
  async getIngredientsByCategory(category: string) {
    return await apiClient.get<Ingredient[]>(
      `${this.basePath}/ingredients/category/${category}`
    );
  }

  /**
   * Get ingredients by storage location
   */
  async getIngredientsByStorageLocation(location: string) {
    return await apiClient.get<Ingredient[]>(
      `${this.basePath}/ingredients/location/${location}`
    );
  }

  /**
   * Get expiring ingredients (within specified days)
   */
  async getExpiringIngredients(days: number) {
    return await apiClient.get<Ingredient[]>(
      `${this.basePath}/ingredients/expiring?days=${days}`
    );
  }

  /**
   * Get expired ingredients
   */
  async getExpiredIngredients() {
    return await apiClient.get<Ingredient[]>(
      `${this.basePath}/ingredients/expired`
    );
  }

  /**
   * Update ingredient quantity
   */
  async updateIngredientQuantity(ingredientId: string, quantity: number) {
    return await apiClient.patch<Ingredient>(
      `${this.basePath}/ingredients/${ingredientId}/quantity`,
      { quantity }
    );
  }

  /**
   * Move ingredient to different storage location
   */
  async moveIngredient(ingredientId: string, newLocation: string) {
    return await apiClient.patch<Ingredient>(
      `${this.basePath}/ingredients/${ingredientId}/location`,
      { storageLocation: newLocation }
    );
  }

  /**
   * Get fridge statistics
   */
  async getFridgeStatistics() {
    return await apiClient.get<{
      totalItems: number;
      expiringItems: number;
      expiredItems: number;
      categories: { name: string; count: number }[];
    }>(`${this.basePath}/statistics`);
  }

  /**
   * Bulk delete ingredients
   */
  async bulkDeleteIngredients(ingredientIds: string[]) {
    return await apiClient.post(`${this.basePath}/ingredients/bulk-delete`, {
      ingredientIds,
    });
  }
}

export const fridgeService = new FridgeService();
export default fridgeService;
