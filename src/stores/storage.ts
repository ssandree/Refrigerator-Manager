// Zustand persist 미들웨어를 위한 SecureStore storage adapter
// 웹 환경에서는 localStorage를 사용하고, 네이티브 환경에서는 SecureStore를 사용합니다.
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { PersistStorage } from "zustand/middleware";
import { logger } from "../utils/logger";

/**
 * 웹 환경 여부 확인
 */
const isWeb = Platform.OS === "web";

/**
 * localStorage 접근 헬퍼
 */
const getLocalStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

/**
 * 메모리 폴백 (localStorage도 사용 불가능한 경우)
 */
const memoryFallback = new Map<string, string>();

/**
 * localStorage를 사용한 getItem
 */
const getLocalStorageItem = (name: string): string | null => {
  const localStorage = getLocalStorage();
  if (localStorage) {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      logger.error(
        `[Storage] Failed to get localStorage item "${name}":`,
        error
      );
    }
  }
  return memoryFallback.get(name) ?? null;
};

/**
 * localStorage를 사용한 setItem
 */
const setLocalStorageItem = (name: string, value: string): void => {
  const localStorage = getLocalStorage();
  if (localStorage) {
    try {
      localStorage.setItem(name, value);
      return;
    } catch (error) {
      logger.error(
        `[Storage] Failed to set localStorage item "${name}":`,
        error
      );
      // localStorage 실패 시 메모리로 폴백
      memoryFallback.set(name, value);
    }
  } else {
    memoryFallback.set(name, value);
  }
};

/**
 * localStorage를 사용한 removeItem
 */
const removeLocalStorageItem = (name: string): void => {
  const localStorage = getLocalStorage();
  if (localStorage) {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      logger.error(
        `[Storage] Failed to remove localStorage item "${name}":`,
        error
      );
    }
  }
  memoryFallback.delete(name);
};

/**
 * SecureStore 사용 가능 여부 확인 (네이티브 환경에서만)
 */
const secureStoreAvailablePromise = isWeb
  ? Promise.resolve(false)
  : SecureStore.isAvailableAsync()
      .then((available) => available)
      .catch(() => false);

/**
 * Zustand persist 미들웨어를 위한 storage adapter
 * - 웹 환경: localStorage 사용
 * - 네이티브 환경: SecureStore 사용 (사용 불가능하면 localStorage 또는 메모리로 폴백)
 */
export const createSecureStorage = <T>(): PersistStorage<T> => ({
  getItem: async (name: string) => {
    let result: string | null;

    // 웹 환경에서는 바로 localStorage 사용
    if (isWeb) {
      result = getLocalStorageItem(name);
    } else {
      // 네이티브 환경에서는 SecureStore 사용 시도
      const canUseSecureStore = await secureStoreAvailablePromise;
      if (!canUseSecureStore) {
        // SecureStore 사용 불가능하면 localStorage 또는 메모리로 폴백
        result = getLocalStorageItem(name);
      } else {
        try {
          result = await SecureStore.getItemAsync(name);
        } catch (error) {
          logger.error(`[Storage] Failed to get item "${name}":`, error);
          // SecureStore 실패 시 localStorage로 폴백
          try {
            await SecureStore.deleteItemAsync(name);
          } catch (deleteError) {
            logger.error(
              `[Storage] Failed to delete corrupted item "${name}":`,
              deleteError
            );
          }
          result = getLocalStorageItem(name);
        }
      }
    }

    // Zustand 4.5.3에서는 string | null을 반환
    return result as any;
  },
  setItem: async (name: string, value) => {
    // StorageValue<T>를 string으로 변환
    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);

    // 웹 환경에서는 바로 localStorage 사용
    if (isWeb) {
      setLocalStorageItem(name, stringValue);
      return;
    }

    // 네이티브 환경에서는 SecureStore 사용 시도
    const canUseSecureStore = await secureStoreAvailablePromise;
    if (!canUseSecureStore) {
      // SecureStore 사용 불가능하면 localStorage 또는 메모리로 폴백
      setLocalStorageItem(name, stringValue);
      return;
    }

    try {
      await SecureStore.setItemAsync(name, stringValue);
    } catch (error) {
      logger.error(`[Storage] Failed to set item "${name}":`, error);
      // SecureStore 실패 시 localStorage로 폴백
      try {
        await SecureStore.deleteItemAsync(name);
        await SecureStore.setItemAsync(name, stringValue);
      } catch (retryError) {
        logger.error(`[Storage] Retry failed for item "${name}":`, retryError);
        // 재시도 실패 시 localStorage로 폴백
        setLocalStorageItem(name, stringValue);
      }
    }
  },
  removeItem: async (name: string): Promise<void> => {
    // 웹 환경에서는 바로 localStorage 사용
    if (isWeb) {
      removeLocalStorageItem(name);
      return;
    }

    // 네이티브 환경에서는 SecureStore 사용 시도
    const canUseSecureStore = await secureStoreAvailablePromise;
    if (!canUseSecureStore) {
      // SecureStore 사용 불가능하면 localStorage 또는 메모리로 폴백
      removeLocalStorageItem(name);
      return;
    }

    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      logger.error(`[Storage] Failed to remove item "${name}":`, error);
      // SecureStore 실패 시 localStorage로 폴백
      removeLocalStorageItem(name);
    }
  },
});
