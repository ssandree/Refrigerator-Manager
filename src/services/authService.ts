// Authentication service for user login, logout, and user management
import apiClient from "./api";
import { deleteToken, saveToken } from "./tokenStorage";

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  sex?: string;
  bmi?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  age?: number;
  sex?: string;
  bmi?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private readonly basePath = "/auth";

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest) {
    const response = await apiClient.post<AuthResponse>(
      `${this.basePath}/login`,
      credentials
    );

    if (response.success && response.data) {
      // API 헤더에 토큰 적용 + 보안 저장소에 영구 저장
      apiClient.setToken(response.data.token);
      await saveToken(response.data.token);
    }

    return response;
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterRequest) {
    const response = await apiClient.post<AuthResponse>(
      `${this.basePath}/register`,
      userData
    );

    if (response.success && response.data) {
      // 회원가입 후 자동 로그인과 동일하게 토큰 저장
      apiClient.setToken(response.data.token);
      await saveToken(response.data.token);
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
  async updateUser(userId: string, userData: Partial<User>) {
    return await apiClient.put<User>(
      `${this.basePath}/user/${userId}`,
      userData
    );
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string) {
    return await apiClient.delete(`${this.basePath}/user/${userId}`);
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    const response = await apiClient.post<{ token: string }>(
      `${this.basePath}/refresh`,
      {}
    );

    if (response.success && response.data) {
      // 토큰 재발급 시에도 동일하게 반영
      apiClient.setToken(response.data.token);
      await saveToken(response.data.token);
    }

    return response;
  }
}

export const authService = new AuthService();
export default authService;
