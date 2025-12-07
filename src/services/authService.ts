// Authentication service for user login, logout, and user management
import { logger } from "../utils/logger";
import apiClient from "./apiClient";
import { deleteToken, getToken, saveToken } from "./tokenStorage";

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number | null;
  sex?: string | null;
  weight?: number | null;
  activityLevel?: string | null;
  bmi?: number | null;
  height?: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RefreshRequest {
  token: string;
}

export interface UserUpdateRequest {
  name?: string | null;
  age?: number | null;
  sex?: string | null;
  weight?: number | null;
  activityLevel?: string | null;
  bmi?: number | null;
  height?: number | null;
}

// 백엔드 응답 구조에 맞춘 타입 정의
export interface AuthDataResponse {
  user: User;
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: AuthDataResponse;
}

class AuthService {
  private readonly basePath = "/auth";

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest) {
    const response = await apiClient.post<AuthDataResponse>(
      `${this.basePath}/login`,
      credentials
    );

    if (response.success && response.data?.token) {
      // 보안 저장소에 토큰 저장 (apiClient 인터셉터가 자동으로 헤더에 추가)
      // 로그인 직후부터 모든 API 요청에 Authorization 헤더가 자동으로 포함됨
      await saveToken(response.data.token);
    }

    return response;
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterRequest) {
    logger.log("[AuthService] register 호출:", userData);
    logger.log("[AuthService] API 엔드포인트:", `${this.basePath}/register`);

    const response = await apiClient.post<AuthDataResponse>(
      `${this.basePath}/register`,
      userData
    );

    logger.log("[AuthService] register 응답:", response);

    if (response.success && response.data?.token) {
      // 보안 저장소에 토큰 저장 (apiClient 인터셉터가 자동으로 헤더에 추가)
      await saveToken(response.data.token);
      logger.log("[AuthService] 토큰 저장 완료");
    }

    return response;
  }

  /**
   * Logout the current user
   */
  async logout() {
    const response = await apiClient.post(`${this.basePath}/logout`, {});

    if (response.success) {
      // 로그아웃 시 메모리/보안 저장소 모두 비움
      apiClient.setToken(null);
      await deleteToken();
    }

    return response;
  }

  /**
   * Get current user information
   */
  async getCurrentUser() {
    return await apiClient.get<User>(`${this.basePath}/me`);
  }

  /**
   * Update user information
   */
  async updateUser(userId: string, userData: UserUpdateRequest) {
    return await apiClient.put<User>(
      `${this.basePath}/user/${userId}`,
      userData
    );
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string) {
    return await apiClient.delete<{ success: boolean; message: string }>(
      `${this.basePath}/user/${userId}`
    );
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    const currentToken = await getToken();
    if (!currentToken) {
      return {
        success: false as const,
        error: "No token available",
        message: "토큰이 없습니다.",
      };
    }

    const response = await apiClient.post<AuthDataResponse>(
      `${this.basePath}/refresh`,
      { token: currentToken } as RefreshRequest
    );

    if (response.success && response.data?.token) {
      // 보안 저장소에 토큰 저장 (apiClient 인터셉터가 자동으로 헤더에 추가)
      await saveToken(response.data.token);
    }

    return response;
  }
}

export const authService = new AuthService();
export default authService;
