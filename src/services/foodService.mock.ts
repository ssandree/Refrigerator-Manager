// Mock Fridge/Food service for development
import { Food, mockFoods } from "../data/mockFood";
import { StorageLocation } from "../enums/storageLocation";
import { ApiResponse } from "./apiClient";

class FoodServiceMock {
  /**
   * Get all foods in the fridge (mock)
   */
  async getAllFoods(): Promise<ApiResponse<Food[]>> {
    const initialFoods = mockFoods.slice(0, 10);
    return {
      success: true,
      data: initialFoods,
    };
  }

  /**
   * Get food by ID (mock)
   */
  async getFoodById(foodId: string): Promise<ApiResponse<Food>> {
    const food = mockFoods.find((i) => i.id === foodId);
    if (food) {
      return {
        success: true,
        data: food,
      };
    }
    return {
      success: false,
      error: "재료를 찾을 수 없습니다.",
      message: "재료를 찾을 수 없습니다.",
    };
  }

  /**
   * Add a new food to the fridge (mock)
   */
  async addFood(food: Omit<Food, "id">): Promise<ApiResponse<Food>> {
    const newFood: Food = {
      ...food,
      id: `mock-${Date.now()}`,
    };
    return {
      success: true,
      data: newFood,
    };
  }

  /**
   * Update an existing food (mock)
   */
  async updateFood(
    foodId: string,
    updatedFood: Partial<Food>
  ): Promise<ApiResponse<Food>> {
    const food = mockFoods.find((i) => i.id === foodId);
    if (food) {
      const updated = { ...food, ...updatedFood };
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
   * Delete a food from the fridge (mock)
   */
  async deleteFood(foodId: string): Promise<ApiResponse<void>> {
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * Get foods by category (mock)
   */
  async getFoodsByCategory(category: string): Promise<ApiResponse<Food[]>> {
    const filtered = mockFoods.filter((i) => i.category === category);
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get foods by storage location (mock)
   */
  async getFoodsByStorageLocation(
    location: string
  ): Promise<ApiResponse<Food[]>> {
    const filtered = mockFoods.filter((i) => i.storageLocation === location);
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Get expiring foods (mock)
   */
  async getExpiringFoods(days: number): Promise<ApiResponse<Food[]>> {
    const today = new Date();
    const filtered = mockFoods.filter((food) => {
      const expiryDate = new Date(food.expiryDate);
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
   * Get expired foods (mock)
   */
  async getExpiredFoods(): Promise<ApiResponse<Food[]>> {
    const today = new Date();
    const filtered = mockFoods.filter((food) => {
      const expiryDate = new Date(food.expiryDate);
      return expiryDate.getTime() < today.getTime();
    });
    return {
      success: true,
      data: filtered,
    };
  }

  /**
   * Update food quantity (mock)
   */
  async updateFoodQuantity(
    foodId: string,
    quantity: number
  ): Promise<ApiResponse<Food>> {
    const food = mockFoods.find((i) => i.id === foodId);
    if (food) {
      const updated = { ...food, quantity };
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
   * Move food to different storage location (mock)
   */
  async moveFood(
    foodId: string,
    newLocation: string
  ): Promise<ApiResponse<Food>> {
    const food = mockFoods.find((i) => i.id === foodId);
    if (food) {
      const updated = {
        ...food,
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
    const expiring = mockFoods.filter((food) => {
      const expiryDate = new Date(food.expiryDate);
      const daysLeft = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysLeft <= 7 && daysLeft >= 0;
    });
    const expired = mockFoods.filter((food) => {
      const expiryDate = new Date(food.expiryDate);
      return expiryDate.getTime() < today.getTime();
    });

    const categoryCounts = mockFoods.reduce((acc, food) => {
      acc[food.category] = (acc[food.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: {
        totalItems: mockFoods.length,
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
   * Bulk delete foods (mock)
   */
  async bulkDeleteFoods(foodIds: string[]): Promise<ApiResponse<void>> {
    return {
      success: true,
      data: undefined,
    };
  }
}

export const foodServiceMock = new FoodServiceMock();
export default foodServiceMock;
