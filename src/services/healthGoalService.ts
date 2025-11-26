// Health goal service for managing user's health goals
import apiClient, { ApiResponse } from "./apiClient";

// BE HealthGoalResponse DTO (id, title만 포함)
export interface HealthGoalDTO {
  id: number;
  title: string;
}

class HealthGoalService {
  private readonly basePath = "/health-goals";

  /**
   * Get user's selected health goals
   */
  async getUserSelectedGoals(): Promise<ApiResponse<HealthGoalDTO[]>> {
    // BE: HealthGoalListResponse(success, data: HealthGoalResponse[])
    // FE: ApiResponse<HealthGoalDTO[]> 로 data 배열만 전달받음
    return await apiClient.get<HealthGoalDTO[]>(
      `${this.basePath}/user-selected`
    );
  }

  /**
   * Set user's selected health goals
   */
  async setSelectedGoals(
    goalIds: number[]
  ): Promise<ApiResponse<HealthGoalDTO[]>> {
    // BE: SetUserGoalsRequest(goalIds: int[])
    // 응답은 HealthGoalListResponse(success, data: HealthGoalResponse[])
    return await apiClient.post<HealthGoalDTO[]>(
      `${this.basePath}/user-selected`,
      { goalIds }
    );
  }

  /**
   * Get user's health goal statistics
   */
  async getUserGoalStatistics(): Promise<
    ApiResponse<{
      selectedGoals: number;
      goalsAchieved: number;
      achievementRate: number;
    }>
  > {
    // BE: { success: True, data: { selectedGoals, goalsAchieved, achievementRate } }
    // FE: ApiResponse<{ ... }> 로 data 객체만 전달받음
    return await apiClient.get<{
      selectedGoals: number;
      goalsAchieved: number;
      achievementRate: number;
    }>(`${this.basePath}/user-statistics`);
  }
}

export const healthGoalService = new HealthGoalService();
export default healthGoalService;
