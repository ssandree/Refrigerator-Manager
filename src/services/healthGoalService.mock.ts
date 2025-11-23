// Mock Health goal service for development
import { mockHealthGoals } from "../data/mockHealthGoals";
import { HealthGoal } from "../stores/useHealthGoalStore";
import { ApiResponse } from "./apiClient";

class HealthGoalServiceMock {
  /**
   * Get all available health goals (mock)
   */
  async getAllGoals(): Promise<ApiResponse<HealthGoal[]>> {
    return {
      success: true,
      data: mockHealthGoals,
    };
  }

  /**
   * Get user's selected health goals (mock)
   */
  async getUserSelectedGoals(): Promise<ApiResponse<HealthGoal[]>> {
    return {
      success: true,
      data: [],
    };
  }

  /**
   * Set user's selected health goals (mock)
   */
  async setSelectedGoals(
    goalIds: number[]
  ): Promise<ApiResponse<HealthGoal[]>> {
    const selected = mockHealthGoals.filter((goal) =>
      goalIds.includes(goal.id)
    );
    return {
      success: true,
      data: selected,
    };
  }

  /**
   * Add a health goal to user's selection (mock)
   */
  async addSelectedGoal(goalId: number): Promise<ApiResponse<HealthGoal>> {
    const goal = mockHealthGoals.find((g) => g.id === goalId);
    if (goal) {
      return {
        success: true,
        data: goal,
      };
    }
    return {
      success: false,
      error: "건강 목표를 찾을 수 없습니다.",
      message: "건강 목표를 찾을 수 없습니다.",
    };
  }

  /**
   * Remove a health goal from user's selection (mock)
   */
  async removeSelectedGoal(goalId: number): Promise<ApiResponse<void>> {
    return {
      success: true,
      data: undefined,
    };
  }

  /**
   * Get health goal by ID (mock)
   */
  async getGoalById(goalId: number): Promise<ApiResponse<HealthGoal>> {
    const goal = mockHealthGoals.find((g) => g.id === goalId);
    if (goal) {
      return {
        success: true,
        data: goal,
      };
    }
    return {
      success: false,
      error: "건강 목표를 찾을 수 없습니다.",
      message: "건강 목표를 찾을 수 없습니다.",
    };
  }

  /**
   * Get user's health goal statistics (mock)
   */
  async getUserGoalStatistics(): Promise<
    ApiResponse<{
      selectedGoals: number;
      goalsAchieved: number;
      achievementRate: number;
    }>
  > {
    return {
      success: true,
      data: {
        selectedGoals: 0,
        goalsAchieved: 0,
        achievementRate: 0,
      },
    };
  }
}

export const healthGoalServiceMock = new HealthGoalServiceMock();
export default healthGoalServiceMock;
