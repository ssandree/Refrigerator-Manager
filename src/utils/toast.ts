// 토스트 알림 유틸리티 함수
import Toast from "react-native-toast-message";

export type ToastType = "success" | "error" | "info";

interface ToastOptions {
  message: string;
  description?: string;
  duration?: number;
}

/**
 * 성공 토스트 메시지 표시
 */
export const showSuccessToast = (options: ToastOptions) => {
  Toast.show({
    type: "success",
    text1: options.message,
    text2: options.description,
    visibilityTime: options.duration || 3000,
    position: "bottom",
  });
};

/**
 * 에러 토스트 메시지 표시
 */
export const showErrorToast = (options: ToastOptions) => {
  Toast.show({
    type: "error",
    text1: options.message,
    text2: options.description,
    visibilityTime: options.duration || 4000,
    position: "bottom",
  });
};

/**
 * 정보 토스트 메시지 표시
 */
export const showInfoToast = (options: ToastOptions) => {
  Toast.show({
    type: "info",
    text1: options.message,
    text2: options.description,
    visibilityTime: options.duration || 3000,
    position: "bottom",
  });
};

/**
 * API 에러 응답을 토스트로 표시
 */
export const showApiErrorToast = (
  error: string | { message?: string; error?: string }
) => {
  const message =
    typeof error === "string"
      ? error
      : error.message || error.error || "오류가 발생했습니다.";
  showErrorToast({
    message: "오류",
    description: message,
  });
};

/**
 * React Query에서 사용할 수 있는 에러 처리 래퍼
 * API 응답이 에러인 경우 throw하여 React Query의 onError가 호출되도록 함
 */
export function handleApiResponse<T>(response: {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}): T {
  if (!response.success || !response.data) {
    const errorMessage =
      response.error || response.message || "오류가 발생했습니다.";
    throw new Error(errorMessage);
  }
  return response.data;
}
