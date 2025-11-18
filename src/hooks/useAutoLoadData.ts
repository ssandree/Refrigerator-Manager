import { useEffect, useRef } from "react";

interface UseAutoLoadDataOptions {
  /**
   * lastSyncedAt을 체크할지 여부
   * true인 경우, lastSyncedAt이 없을 때만 데이터를 로드합니다.
   */
  checkLastSynced?: boolean;
  /**
   * 마지막 동기화 시간 (timestamp number)
   * checkLastSynced가 true일 때 사용됩니다.
   */
  lastSyncedAt?: number | null;
}

/**
 * Zustand 스토어의 데이터를 자동으로 로드하는 훅
 * 데이터가 비어있고 로딩 중이 아닐 때 데이터를 로드합니다.
 *
 * @param data - 스토어의 데이터 배열 (예: meals, ingredients)
 * @param isLoading - 스토어의 로딩 상태
 * @param loadData - 데이터를 로드하는 스토어 액션
 * @param options - 추가 옵션 (lastSyncedAt 체크 등)
 *
 * @example
 * ```tsx
 * // 기본 사용
 * useAutoLoadData(meals, isLoading, loadMeals);
 *
 * // lastSyncedAt 체크와 함께 사용
 * useAutoLoadData(meals, isLoading, loadMeals, {
 *   checkLastSynced: true,
 *   lastSyncedAt: lastSyncedAt,
 * });
 * ```
 */
export function useAutoLoadData<T>(
  data: T[],
  isLoading: boolean,
  loadData: (force?: boolean) => Promise<void>,
  options?: UseAutoLoadDataOptions
) {
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // 로딩이 완료되면 hasLoadedRef를 true로 설정
    if (!isLoading) {
      hasLoadedRef.current = true;
    }
  }, [isLoading]);

  useEffect(() => {
    const shouldLoad = options?.checkLastSynced
      ? !options.lastSyncedAt && !hasLoadedRef.current
      : !hasLoadedRef.current;

    if (data.length === 0 && !isLoading && shouldLoad) {
      loadData(false);
    }
  }, [
    data.length,
    isLoading,
    loadData,
    options?.checkLastSynced,
    options?.lastSyncedAt,
  ]);
}
