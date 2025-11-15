// Store 에러를 구독하고 토스트로 표시하는 훅
import { useEffect } from "react";
import { showErrorToast } from "../utils/toast";

/**
 * Store의 에러를 구독하고, 에러가 발생하면 토스트로 표시한 후 에러를 초기화하는 훅
 * @param store - error와 clearError를 가진 스토어 객체 또는 직접 error와 clearError를 전달
 */
export function useStoreError(
  storeOrError:
    | { error: string | null; clearError: () => void }
    | string
    | null,
  clearError?: () => void
) {
  useEffect(() => {
    // 스토어 객체를 받은 경우
    if (
      typeof storeOrError === "object" &&
      storeOrError !== null &&
      "error" in storeOrError
    ) {
      const { error, clearError: clear } = storeOrError;
      if (error) {
        showErrorToast({
          message: "오류",
          description: error,
        });
        clear();
      }
    }
    // error와 clearError를 직접 받은 경우 (하위 호환성)
    else if (typeof storeOrError === "string" || storeOrError === null) {
      if (storeOrError && clearError) {
        showErrorToast({
          message: "오류",
          description: storeOrError,
        });
        clearError();
      }
    }
  }, [storeOrError, clearError]);
}
