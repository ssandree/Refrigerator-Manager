import { useEffect, useRef } from "react";

interface UseAutoLoadDataOptions {
  /**
   * lastSyncedAt을 체크할지 여부
   * true인 경우, lastSyncedAt이 없거나 지정된 시간(기본 5분)이 지났을 때만 데이터를 로드합니다.
   */
  checkLastSynced?: boolean;
  /**
   * 마지막 동기화 시간 (timestamp number)
   * checkLastSynced가 true일 때 사용됩니다.
   */
  lastSyncedAt?: number | null;
  /**
   * 동기화 유효 시간 (밀리초)
   * 이 시간 이내에 동기화했다면 서버 요청을 생략합니다.
   * 기본값: 5분 (5 * 60 * 1000)
   */
  syncValidDuration?: number;
}

/**
 * Zustand 스토어의 데이터를 자동으로 로드하는 훅
 * 데이터가 비어있고 로딩 중이 아닐 때 데이터를 로드합니다.
 * lastSyncedAt 체크 옵션을 통해 불필요한 서버 요청을 방지할 수 있습니다.
 *
 * @param data - 스토어의 데이터 배열 (예: meals, ingredients)
 * @param isLoading - 스토어의 로딩 상태
 * @param loadData - 데이터를 로드하는 스토어 액션
 * @param options - 추가 옵션 (lastSyncedAt 체크 등)
 *
 * @example
 * ```tsx
 * // 기본 사용 (데이터가 없으면 항상 로드)
 * useAutoLoadData(meals, isLoading, loadMeals);
 *
 * // lastSyncedAt 체크와 함께 사용 (5분 이내 동기화했다면 로드하지 않음)
 * useAutoLoadData(meals, isLoading, loadMeals, {
 *   checkLastSynced: true,
 *   lastSyncedAt: lastSyncedAt,
 * });
 *
 * // 커스텀 동기화 유효 시간 설정 (10분)
 * useAutoLoadData(meals, isLoading, loadMeals, {
 *   checkLastSynced: true,
 *   lastSyncedAt: lastSyncedAt,
 *   syncValidDuration: 10 * 60 * 1000, // 10분
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
  const syncValidDuration = options?.syncValidDuration ?? 5 * 60 * 1000; // 기본 5분

  useEffect(() => {
    // 로딩이 완료되면 hasLoadedRef를 true로 설정
    if (!isLoading) {
      hasLoadedRef.current = true;
    }
  }, [isLoading]);

  useEffect(() => {
    // 이미 로드했으면 스킵
    if (hasLoadedRef.current) {
      return;
    }

    // 데이터가 있고, lastSyncedAt 체크가 활성화되어 있으면
    if (options?.checkLastSynced && options.lastSyncedAt) {
      const timeSinceSync = Date.now() - options.lastSyncedAt;
      // 동기화 유효 시간 이내이고 데이터가 있으면 로드하지 않음
      if (timeSinceSync < syncValidDuration && data.length > 0) {
        return;
      }
    }

    // 데이터가 없고 로딩 중이 아니면 로드
    if (data.length === 0 && !isLoading) {
      loadData(false);
    }
  }, [
    data.length,
    isLoading,
    loadData,
    options?.checkLastSynced,
    options?.lastSyncedAt,
    syncValidDuration,
  ]);
}
