// Health goal service for managing user's health goals
import { HealthGoal } from "../stores/useHealthGoalStore";
import apiClient, { ApiResponse } from "./apiClient";

class HealthGoalService {
  private readonly basePath = "/health-goals";

  /**
   * Get all available health goals
   */
  async getAllGoals(): Promise<ApiResponse<HealthGoal[]>> {
    return await apiClient.get<HealthGoal[]>(this.basePath);
  }

  /**
   * Get user's selected health goals
   */
  async getUserSelectedGoals() {
    return await apiClient.get<HealthGoal[]>(`${this.basePath}/user-selected`);
  }

  /**
   * Set user's selected health goals
   */
  async setSelectedGoals(goalIds: number[]) {
    return await apiClient.post<HealthGoal[]>(
      `${this.basePath}/user-selected`,
      { goalIds }
    );
  }

  /**
   * Add a health goal to user's selection
   */
  async addSelectedGoal(goalId: number) {
    return await apiClient.post<HealthGoal>(
      `${this.basePath}/user-selected/${goalId}`,
      {}
    );
  }

  /**
   * Remove a health goal from user's selection
   */
  async removeSelectedGoal(goalId: number) {
    return await apiClient.delete<{ message: string }>(
      `${this.basePath}/user-selected/${goalId}`
    );
  }

  /**
   * Get health goal by ID
   */
  async getGoalById(goalId: number) {
    return await apiClient.get<HealthGoal>(`${this.basePath}/${goalId}`);
  }

  /**
   * Get user's health goal statistics
   */
  async getUserGoalStatistics() {
    return await apiClient.get<{
      selectedGoals: number;
      goalsAchieved: number;
      achievementRate: number;
    }>(`${this.basePath}/user-statistics`);
  }

  /**
   * Get weekly health statistics
   */
  async getWeeklyStats(params?: { startDate?: string; endDate?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.startDate) {
      searchParams.set("startDate", params.startDate);
    }
    if (params?.endDate) {
      searchParams.set("endDate", params.endDate);
    }
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/stats/weekly?${queryString}`
      : `${this.basePath}/stats/weekly`;
    return await apiClient.get<Record<string, any>>(endpoint);
  }

  /**
   * Get nutrition statistics
   */
  async getNutritionStats(startDate: string, endDate: string) {
    const searchParams = new URLSearchParams({
      startDate,
      endDate,
    });
    return await apiClient.get<Record<string, any>>(
      `${this.basePath}/stats/nutrition?${searchParams.toString()}`
    );
  }
}

export const healthGoalService = new HealthGoalService();
export default healthGoalService;
