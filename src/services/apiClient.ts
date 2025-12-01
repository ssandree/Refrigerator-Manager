import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";
import { getToken } from "./tokenStorage";

// Expo Go를 사용할 때는 컴퓨터의 로컬 네트워크 IP 주소를 사용해야 합니다
// Windows: ipconfig 명령어로 IPv4 주소 확인
// Mac/Linux: ifconfig 또는 ip addr 명령어로 확인
// 백엔드가 /api prefix 없이 실행되면 "/api"를 제거하세요
//
// 주의:
// - Android 에뮬레이터: "http://10.0.2.2:8000" 사용
// - iOS 시뮬레이터: "http://localhost:8000" 사용
// - 실제 기기/Expo Go: 컴퓨터의 실제 로컬 IP 사용 (예: "http://172.16.69.179:8000")
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://172.16.69.179:8000";

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
  private axiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 5000, // 5초 타임아웃
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 요청 인터셉터: 토큰 자동 삽입
    // 매 요청마다 보안 저장소에서 토큰을 가져와 Authorization 헤더에 추가
    // 로그인 시 saveToken()으로 저장된 토큰이 자동으로 사용됨
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터: 에러 처리
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // 401 Unauthorized - 토큰 만료 또는 인증 실패
        if (error.response?.status === 401) {
          // 토큰 삭제는 호출하는 쪽에서 처리하도록 함
        }
        return Promise.reject(error);
      }
    );
  }

  // 기존 코드와의 호환성을 위해 유지 (하지만 인터셉터가 자동으로 처리)
  setToken(token: string | null) {
    // axios 인터셉터가 자동으로 처리하므로 빈 구현
    // 필요시 추가 로직 구현 가능
  }

  private async request<T>(
    endpoint: string,
    options: {
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      body?: unknown;
    }
  ): Promise<ApiResponse<T>> {
    try {
      let response;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      switch (options.method) {
        case "GET":
          response = await this.axiosInstance.get<ApiSuccessResponse<T>>(
            endpoint,
            config
          );
          break;
        case "POST":
          response = await this.axiosInstance.post<ApiSuccessResponse<T>>(
            endpoint,
            options.body,
            config
          );
          break;
        case "PUT":
          response = await this.axiosInstance.put<ApiSuccessResponse<T>>(
            endpoint,
            options.body,
            config
          );
          break;
        case "PATCH":
          response = await this.axiosInstance.patch<ApiSuccessResponse<T>>(
            endpoint,
            options.body,
            config
          );
          break;
        case "DELETE":
          if (options.body) {
            response = await this.axiosInstance.delete<ApiSuccessResponse<T>>(
              endpoint,
              {
                ...config,
                data: options.body,
              }
            );
          } else {
            response = await this.axiosInstance.delete<ApiSuccessResponse<T>>(
              endpoint,
              config
            );
          }
          break;
      }

      // 백엔드 응답이 { success: true, data: T } 또는 { success: false, ... } 형식
      const backendResponse = response.data as any;

      // 백엔드가 success 필드를 포함한 응답 형식인 경우
      if (
        backendResponse &&
        typeof backendResponse === "object" &&
        "success" in backendResponse
      ) {
        // success: false인 경우 (백엔드가 200 OK와 함께 에러 응답을 보낸 경우)
        if (backendResponse.success === false) {
          return {
            success: false,
            error: backendResponse.error || "Unknown error",
            message: backendResponse.message || "요청 처리에 실패했습니다.",
          };
        }

        // success: true인 경우 data 필드 추출
        if ("data" in backendResponse) {
          return {
            success: true,
            data: backendResponse.data as T,
            message: backendResponse.message,
          };
        }

        // success 필드는 있지만 data 필드가 없는 응답 (예: 삭제 성공 메시지)
        return {
          success: true,
          data: undefined as T,
          message: backendResponse.message,
        };
      }

      // 백엔드 응답이 { success: true, data: T } 형식이지만 success 필드가 없는 경우 (호환성)
      if (
        backendResponse &&
        typeof backendResponse === "object" &&
        "data" in backendResponse
      ) {
        return {
          success: true,
          data: backendResponse.data as T,
          message: backendResponse.message,
        };
      }

      // 백엔드 응답이 직접 데이터인 경우 (호환성)
      return {
        success: true,
        data: response.data as T,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          message?: string;
          error?: string;
          code?: string;
        }>;

        const errorData = axiosError.response?.data as any;
        const status = axiosError.response?.status;

        // 400 에러의 경우 상세 에러 메시지 확인
        let errorMessage =
          errorData?.message || errorData?.error || axiosError.message;

        // FastAPI의 validation error 형식 처리
        if (status === 400 && errorData && typeof errorData === "object") {
          // FastAPI validation error는 보통 detail 필드에 있음
          if (Array.isArray(errorData.detail)) {
            const validationErrors = errorData.detail
              .map((err: any) => err.msg || err.message || JSON.stringify(err))
              .join(", ");
            errorMessage = `입력값 오류: ${validationErrors}`;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        }

        const apiError: ApiError = {
          message:
            errorMessage ||
            `HTTP ${status || "Unknown"}: ${
              axiosError.response?.statusText || "Unknown error"
            }`,
          status: status,
          code: errorData?.code || `HTTP_${status || "UNKNOWN"}`,
        };

        // 네트워크 에러 처리
        if (!axiosError.response) {
          return {
            success: false,
            error: "Network error",
            message: "네트워크 연결을 확인해주세요.",
          };
        }

        return {
          success: false,
          error: apiError.message,
          message: apiError.message,
        };
      }

      // 기타 에러
      const unknownError = error as Error;
      return {
        success: false,
        error: unknownError.message || "An error occurred",
        message: unknownError.message || "알 수 없는 오류가 발생했습니다.",
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PUT", body });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "PATCH", body });
  }

  async delete<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", body });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export for use in other services
export default apiClient;
