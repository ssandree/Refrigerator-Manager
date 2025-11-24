// Dashboard 관련 API 서비스
import apiClient, { ApiResponse } from "./apiClient";

/**
 * 활동 레벨 문자열을 숫자로 변환
 * @param activityLevel - 활동 레벨 문자열 ("veryLow", "low", "medium", "high", "veryHigh" 등)
 * @returns 활동 계수 (1.2, 1.375, 1.55, 1.725, 1.9)
 */
export function convertActivityLevelToNumber(
  activityLevel?: string | null
): number {
  if (!activityLevel) return 1.2; // 기본값: 거의 활동 없음

  const normalized = activityLevel.toLowerCase();
  if (normalized === "verylow" || normalized === "sedentary") return 1.2;
  if (normalized === "low" || normalized === "light") return 1.375;
  if (normalized === "medium" || normalized === "moderate") return 1.55;
  if (normalized === "high" || normalized === "active") return 1.725;
  if (normalized === "veryhigh" || normalized === "veryactive") return 1.9;

  return 1.2; // 기본값
}

// BMI 계산 요청/응답
export interface BMIRequest {
  weight: number; // kg
  height: number; // cm
}

export interface BMIResponse {
  bmi: number;
  category: string;
}

// BMR 계산 요청/응답
export interface BMRRequest {
  age: number;
  sex: string; // "male" or "female"
  weight: number; // kg
  height: number; // cm
}

export interface BMRResponse {
  bmr: number;
}

// TDEE 계산 요청/응답
export interface TDEERequest {
  bmr: number;
  activity_level: number; // 1.2, 1.375, 1.55, 1.725, 1.9
}

export interface TDEEResponse {
  tdee: number;
}

class DashboardService {
  private readonly basePath = "/dashboard";

  /**
   * BMI 계산
   * POST /dashboard/calculator/bmi
   */
  async calculateBMI(data: BMIRequest): Promise<ApiResponse<BMIResponse>> {
    return await apiClient.post<BMIResponse>(
      `${this.basePath}/calculator/bmi`,
      data
    );
  }

  /**
   * BMR 계산 (파라미터로)
   * POST /dashboard/calculator/bmr
   */
  async calculateBMR(data: BMRRequest): Promise<ApiResponse<BMRResponse>> {
    return await apiClient.post<BMRResponse>(
      `${this.basePath}/calculator/bmr`,
      data
    );
  }

  /**
   * 내 BMR 조회
   * GET /dashboard/calculator/bmr/my
   */
  async getMyBMR(): Promise<ApiResponse<BMRResponse>> {
    return await apiClient.get<BMRResponse>(
      `${this.basePath}/calculator/bmr/my`
    );
  }

  /**
   * TDEE 계산 (파라미터로)
   * POST /dashboard/calculator/tdee
   */
  async calculateTDEE(data: TDEERequest): Promise<ApiResponse<TDEEResponse>> {
    return await apiClient.post<TDEEResponse>(
      `${this.basePath}/calculator/tdee`,
      data
    );
  }

  /**
   * 내 TDEE 조회
   * GET /dashboard/calculator/tdee/my
   */
  async getMyTDEE(): Promise<ApiResponse<TDEEResponse>> {
    return await apiClient.get<TDEEResponse>(
      `${this.basePath}/calculator/tdee/my`
    );
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
