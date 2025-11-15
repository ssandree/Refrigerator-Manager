// Zustand 스토어에서 공통으로 사용하는 유틸리티 함수들

import { logger } from "../utils/logger";

/**
 * 배열 데이터 검증 및 초기화
 * @param data - 검증할 데이터
 * @param storeName - 스토어 이름 (로깅용)
 * @returns 검증된 배열 또는 빈 배열
 */
export function validateArray<T>(data: unknown, storeName: string): T[] {
  if (!Array.isArray(data)) {
    logger.warn(`[${storeName}] Invalid array data, resetting`);
    return [];
  }
  return data as T[];
}

/**
 * 30일 이상 된 동기화 데이터 무효화
 * @param lastSyncedAt - 마지막 동기화 시간 (timestamp)
 * @param storeName - 스토어 이름 (로깅용)
 * @returns 유효한 경우 lastSyncedAt, 무효한 경우 null
 */
export function validateSyncTimestamp(
  lastSyncedAt: number | null | undefined,
  storeName: string
): number | null {
  if (!lastSyncedAt) {
    return null;
  }

  const daysSinceSync = (Date.now() - lastSyncedAt) / (1000 * 60 * 60 * 24);

  if (daysSinceSync > 30) {
    logger.info(
      `[${storeName}] Data is too old (${Math.floor(
        daysSinceSync
      )} days), will refresh on next load`
    );
    return null;
  }

  return lastSyncedAt;
}

/**
 * 배열 길이 제한 검증
 * @param array - 검증할 배열
 * @param maxLength - 최대 길이
 * @param storeName - 스토어 이름 (로깅용)
 * @returns 제한된 배열
 */
export function validateArrayLength<T>(
  array: T[],
  maxLength: number,
  storeName: string
): T[] {
  if (array.length > maxLength) {
    logger.warn(
      `[${storeName}] Array length exceeds limit (${array.length} > ${maxLength}), keeping first ${maxLength}`
    );
    return array.slice(0, maxLength);
  }
  return array;
}
