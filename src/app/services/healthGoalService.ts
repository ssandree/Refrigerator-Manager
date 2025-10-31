// Health goal service for managing user's health goals
import { HealthGoal } from "../../stores/useHealthGoalStore";
import apiClient from "./api";

class HealthGoalService {
  private readonly basePath = "/health-goals";

  /**
   * Get all available health goals
   */
  async getAllGoals() {
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
    return await apiClient.delete(`${this.basePath}/user-selected/${goalId}`);
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
}

export const healthGoalService = new HealthGoalService();
export default healthGoalService;
