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
  async getWeeklyStats(startDate: string) {
    return await apiClient.get<Record<string, any>>(
      `${this.basePath}/stats/weekly?startDate=${encodeURIComponent(startDate)}`
    );
  }

  /**
   * Get nutrition statistics
   */
  async getNutritionStats(startDate: string, endDate: string) {
    return await apiClient.get<Record<string, any>>(
      `${this.basePath}/stats/nutrition?startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`
    );
  }
}

export const healthGoalService = new HealthGoalService();
export default healthGoalService;
