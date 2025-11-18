import { useStoreError } from "./useStoreError";

/**
 * Store의 에러 처리와 함께 사용하는 편의 훅
 * Store에서 error, clearError를 가져와서 useStoreError에 자동으로 전달
 *
 * @param useStore - Zustand store hook (예: useMealStore)
 * @returns Store의 error와 clearError를 포함한 객체
 *
 * @example
 * ```tsx
 * useStoreWithError(useMealStore);
 * // 자동으로 useStoreError가 호출되어 에러가 토스트로 표시됨
 * ```
 */
export function useStoreWithError(
  useStore: (
    selector: (state: any) => { error: string | null; clearError: () => void }
  ) => { error: string | null; clearError: () => void }
): { error: string | null; clearError: () => void } {
  const store = useStore((s: any) => ({
    error: s.error,
    clearError: s.clearError,
  }));

  useStoreError(store);

  return store;
}
