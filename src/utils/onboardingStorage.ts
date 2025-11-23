// 온보딩 데이터 임시 저장 유틸리티
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ONBOARDING_KEY = "onboarding_data";
const isWeb = Platform.OS === "web";

export interface OnboardingData {
  sex?: "male" | "female";
  age?: number;
  height?: number; // cm
  weight?: number; // kg
  activityLevel?: "veryLow" | "low" | "medium" | "high" | "veryHigh";
  healthGoalIds?: number[];
}

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
 * 온보딩 데이터 저장
 */
export const saveOnboardingData = async (
  data: Partial<OnboardingData>
): Promise<void> => {
  try {
    const existing = await getOnboardingData();
    const merged = { ...existing, ...data };
    const json = JSON.stringify(merged);

    if (isWeb) {
      const storage = getLocalStorage();
      if (storage) {
        storage.setItem(ONBOARDING_KEY, json);
      }
    } else {
      await SecureStore.setItemAsync(ONBOARDING_KEY, json);
    }
  } catch (error) {
    console.error("Failed to save onboarding data:", error);
  }
};

/**
 * 온보딩 데이터 로드
 */
export const getOnboardingData = async (): Promise<OnboardingData> => {
  try {
    let json: string | null = null;

    if (isWeb) {
      const storage = getLocalStorage();
      if (storage) {
        json = storage.getItem(ONBOARDING_KEY);
      }
    } else {
      json = await SecureStore.getItemAsync(ONBOARDING_KEY);
    }

    if (json) {
      return JSON.parse(json);
    }
    return {};
  } catch (error) {
    console.error("Failed to load onboarding data:", error);
    return {};
  }
};

/**
 * 온보딩 데이터 삭제
 */
export const clearOnboardingData = async (): Promise<void> => {
  try {
    if (isWeb) {
      const storage = getLocalStorage();
      if (storage) {
        storage.removeItem(ONBOARDING_KEY);
      }
    } else {
      await SecureStore.deleteItemAsync(ONBOARDING_KEY);
    }
  } catch (error) {
    console.error("Failed to clear onboarding data:", error);
  }
};
