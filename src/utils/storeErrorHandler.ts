// Store의 에러 처리를 위한 공통 유틸리티 함수

// HTTP 에러 타입 정의
type HttpError = {
  status?: number;
  message?: string;
  error?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

/**
 * Store 액션에서 발생하는 에러를 일관되게 처리하는 헬퍼 함수
 * React Query의 에러도 처리할 수 있도록 확장
 * @param error - 발생한 에러 객체
 * @param defaultMessage - 기본 에러 메시지
 * @returns 에러 메시지 문자열
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string
): string {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  // HTTP 에러 객체 처리 (React Query 등에서 사용)
  if (typeof error === "object" && error !== null) {
    const httpError = error as HttpError;
    return (
      httpError.message ||
      httpError.error ||
      httpError.response?.data?.message ||
      defaultMessage
    );
  }
  return defaultMessage;
}

/**
 * Store의 set 함수와 함께 사용하는 에러 처리 래퍼
 * @param fn - 실행할 함수
 * @param setError - 에러를 설정하는 함수
 * @param defaultMessage - 기본 에러 메시지
 * @returns 함수 실행 결과 또는 null (에러 발생 시)
 */
export function withStoreErrorHandling<T>(
  fn: () => T,
  setError: (error: string) => void,
  defaultMessage: string
): T | null {
  try {
    return fn();
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, defaultMessage);
    setError(errorMessage);
    return null;
  }
}

/**
 * 비동기 Store 액션의 에러를 처리하는 헬퍼
 * @param fn - 실행할 비동기 함수
 * @param setError - 에러를 설정하는 함수
 * @param defaultMessage - 기본 에러 메시지
 * @returns 함수 실행 결과 또는 null (에러 발생 시)
 */
export async function withAsyncStoreErrorHandling<T>(
  fn: () => Promise<T>,
  setError: (error: string) => void,
  defaultMessage: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, defaultMessage);
    setError(errorMessage);
    return null;
  }
}
