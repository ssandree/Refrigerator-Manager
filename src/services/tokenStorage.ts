import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { logger } from "../utils/logger";

const TOKEN_KEY = "authToken";

/**
 * 토큰 저장/로드 유틸리티
 * 사용자 정보는 useAuthStore의 persist 미들웨어를 통해 관리되므로,
 * 이 파일은 인증 토큰만 관리합니다.
 * 웹 환경에서는 localStorage를 사용합니다.
 */

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

const isWeb = Platform.OS === "web";

/**
 * 인증 토큰을 보안 저장소에 저장
 * @param token - 저장할 인증 토큰
 */
export async function saveToken(token: string): Promise<void> {
  try {
    if (isWeb) {
      const localStorage = getLocalStorage();
      if (localStorage) {
        localStorage.setItem(TOKEN_KEY, token);
        return;
      }
      throw new Error("localStorage is not available");
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    logger.error("[TokenStorage] 토큰 저장 실패:", error);
    throw error;
  }
}

/**
 * 보안 저장소에서 인증 토큰을 로드
 * @returns 저장된 토큰 또는 null
 */
export async function getToken(): Promise<string | null> {
  try {
    if (isWeb) {
      const localStorage = getLocalStorage();
      if (localStorage) {
        return localStorage.getItem(TOKEN_KEY);
      }
      return null;
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    logger.error("[TokenStorage] 토큰 로드 실패:", error);
    return null;
  }
}

/**
 * 보안 저장소에서 인증 토큰을 삭제
 */
export async function deleteToken(): Promise<void> {
  try {
    if (isWeb) {
      const localStorage = getLocalStorage();
      if (localStorage) {
        localStorage.removeItem(TOKEN_KEY);
        return;
      }
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    logger.error("[TokenStorage] 토큰 삭제 실패:", error);
    // 삭제 실패는 치명적이지 않으므로 에러를 던지지 않음
  }
}
