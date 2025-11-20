// Mock Fridge/Ingredient service for development
import { Ingredient, mockIngredients } from "../data/mockFood";
import { StorageLocation } from "../enums/storageLocation";
import { ApiResponse } from "./api";

class FridgeServiceMock {
  /**
   * Get all ingredients in the fridge (mock)
   */
  async getAllIngredients(): Promise<ApiResponse<Ingredient[]>> {
    const initialIngredients = mockIngredients.slice(0, 10);
    return {
      success: true,
      data: initialIngredients,
    };
  }

  /**
   * Get ingredient by ID (mock)
   */
  async getIngredientById(
    ingredientId: string
  ): Promise<ApiResponse<Ingredient>> {
    const ingredient = mockIngredients.find((i) => i.id === ingredientId);
    if (ingredient) {
      return {
        success: true,
        data: ingredient,
      };
    }
    return {
      success: false,
      error: "재료를 찾을 수 없습니다.",
      message: "재료를 찾을 수 없습니다.",
    };
  }

  /**
   * Add a new ingredient to the fridge (mock)
   */
  async addIngredient(
    ingredient: Omit<Ingredient, "id">
  ): Promise<ApiResponse<Ingredient>> {
    const newIngredient: Ingredient = {
      ...ingredient,
      id: `mock-${Date.now()}`,
    };
    return {
      success: true,
      data: newIngredient,
    };
  }

  /**
   * Update an existing ingredient (mock)
   */
  async updateIngredient(
    ingredientId: string,
    updatedIngredient: Partial<Ingredient>
  ): Promise<ApiResponse<Ingredient>> {
    const ingredient = mockIngredients.find((i) => i.id === ingredientId);
    if (ingredient) {
      const updated = { ...ingredient, ...updatedIngredient };
      return {
        success: true,
        data: updated,
      };
    }
    return {
      success: false,
      error: "재료를 찾을 수 없습니다.",
      message: "재료를 찾을 수 없습니다.",
    };
  }

  /**
   * Delete an ingredient from the fridge (mock)
   */
  async deleteIngredient(ingredientId: string): Promise<ApiResponse<void>> {
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * Get ingredients by category (mock)
   */
  async getIngredientsByCategory(
    category: string
  ): Promise<ApiResponse<Ingredient[]>> {
    const filtered = mockIngredients.filter((i) => i.category === category);
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get ingredients by storage location (mock)
   */
  async getIngredientsByStorageLocation(
    location: string
  ): Promise<ApiResponse<Ingredient[]>> {
    const filtered = mockIngredients.filter(
      (i) => i.storageLocation === location
    );
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get expiring ingredients (mock)
   */
  async getExpiringIngredients(
    days: number
  ): Promise<ApiResponse<Ingredient[]>> {
    const today = new Date();
    const filtered = mockIngredients.filter((ingredient) => {
      const expiryDate = new Date(ingredient.expiryDate);
      const daysLeft = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysLeft <= days && daysLeft >= 0;
    });
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get expired ingredients (mock)
   */
  async getExpiredIngredients(): Promise<ApiResponse<Ingredient[]>> {
    const today = new Date();
    const filtered = mockIngredients.filter((ingredient) => {
      const expiryDate = new Date(ingredient.expiryDate);
      return expiryDate.getTime() < today.getTime();
    });
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Update ingredient quantity (mock)
   */
  async updateIngredientQuantity(
    ingredientId: string,
    quantity: number
  ): Promise<ApiResponse<Ingredient>> {
    const ingredient = mockIngredients.find((i) => i.id === ingredientId);
    if (ingredient) {
      const updated = { ...ingredient, quantity };
      return {
        success: true,
        data: updated,
      };
    }
    return {
      success: false,
      error: "재료를 찾을 수 없습니다.",
      message: "재료를 찾을 수 없습니다.",
    };
  }

  /**
   * Move ingredient to different storage location (mock)
   */
  async moveIngredient(
    ingredientId: string,
    newLocation: string
  ): Promise<ApiResponse<Ingredient>> {
    const ingredient = mockIngredients.find((i) => i.id === ingredientId);
    if (ingredient) {
      const updated = {
        ...ingredient,
        storageLocation: newLocation as StorageLocation,
      };
      return {
        success: true,
        data: updated,
      };
    }
    return {
      success: false,
      error: "재료를 찾을 수 없습니다.",
      message: "재료를 찾을 수 없습니다.",
    };
  }

  /**
   * Get fridge statistics (mock)
   */
  async getFridgeStatistics(): Promise<
    ApiResponse<{
      totalItems: number;
      expiringItems: number;
      expiredItems: number;
      categories: { name: string; count: number }[];
    }>
  > {
    const today = new Date();
    const expiring = mockIngredients.filter((ingredient) => {
      const expiryDate = new Date(ingredient.expiryDate);
      const daysLeft = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysLeft <= 7 && daysLeft >= 0;
    });
    const expired = mockIngredients.filter((ingredient) => {
      const expiryDate = new Date(ingredient.expiryDate);
      return expiryDate.getTime() < today.getTime();
    });

    const categoryCounts = mockIngredients.reduce((acc, ingredient) => {
      acc[ingredient.category] = (acc[ingredient.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: {
        totalItems: mockIngredients.length,
        expiringItems: expiring.length,
        expiredItems: expired.length,
        categories: Object.entries(categoryCounts).map(([name, count]) => ({
          name,
          count,
        })),
      },
    };
  }

  /**
   * Bulk delete ingredients (mock)
   */
  async bulkDeleteIngredients(
    ingredientIds: string[]
  ): Promise<ApiResponse<void>> {
    return {
      success: true,
      data: undefined,
    };
  }
}

export const fridgeServiceMock = new FridgeServiceMock();
export default fridgeServiceMock;
