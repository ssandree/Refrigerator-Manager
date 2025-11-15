// Base API configuration and utilities

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";

// 성공 응답 타입
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// 실패 응답 타입
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  data?: never;
}

// 통합 응답 타입
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// 타입 가드 함수
export function isApiSuccess<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

export function isApiError<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return response.success === false;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };

      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // 응답이 비어있을 수 있는 경우 처리
      const contentType = response.headers.get("content-type");
      let data: unknown = null;

      if (contentType && contentType.includes("application/json")) {
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } catch {
          // JSON 파싱 실패 시
          return {
            success: false,
            error: "Invalid JSON response",
            message: "서버 응답을 파싱할 수 없습니다.",
          };
        }
      }

      if (!response.ok) {
        // data가 객체인지 확인하고 타입 단언
        const errorData =
          data && typeof data === "object"
            ? (data as Record<string, unknown>)
            : null;
        const apiError: ApiError = {
          message:
            (errorData?.message as string) ||
            (errorData?.error as string) ||
            `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          code: (errorData?.code as string) || `HTTP_${response.status}`,
        };

        // 401 Unauthorized - 토큰 만료 또는 인증 실패
        if (response.status === 401) {
          this.token = null;
          // 토큰 삭제는 호출하는 쪽에서 처리하도록 함
        }

        return {
          success: false,
          error: apiError.message,
          message: apiError.message,
        };
      }

      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      // 네트워크 에러 또는 기타 에러
      if (error instanceof TypeError && error.message.includes("fetch")) {
        return {
          success: false,
          error: "Network error",
          message: "네트워크 연결을 확인해주세요.",
        };
      }

      const apiError = error as ApiError;
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
        message: apiError.message || "알 수 없는 오류가 발생했습니다.",
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export for use in other services
export default apiClient;
