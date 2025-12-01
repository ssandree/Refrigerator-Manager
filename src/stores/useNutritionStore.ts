import { create } from "zustand";

/**
 * useNutritionStore: UI에서 사용하기 편한 형태로 영양소 데이터를 저장하는 스토어
 *
 * 역할:
 * - totals: 현재 날짜의 섭취 합계 (useStatisticsStore의 dailyStats에서 변환)
 * - targets: 영양소 목표치 (useStatisticsStore의 combinedTargets에서 변환)
 *
 * useStatisticsStore와의 관계:
 * - useStatisticsStore: API에서 원시 데이터를 가져와 저장 (dailyStats, combinedTargets)
 * - useNutritionStore: UI 컴포넌트에서 사용하기 편한 형태로 변환하여 저장
 *
 * 데이터 흐름:
 * 1. useStatisticsStore.fetchDailyStats() → dailyStats 저장
 * 2. 컴포넌트에서 dailyStats를 읽어 useNutritionStore.setTotals()로 변환하여 저장
 * 3. useStatisticsStore.fetchCombinedTargets() → combinedTargets 저장
 * 4. 컴포넌트에서 combinedTargets를 읽어 useNutritionStore.setTargets()로 변환하여 저장
 */

export type NutrientKey =
  | "calories"
  | "protein"
  | "carbs"
  | "fat"
  | "vitaminC"
  | "vitaminD"
  | "zinc";

export interface NutrientMap {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitaminC: number;
  vitaminD: number;
  zinc: number;
}

interface NutritionState {
  dateISO: string; // YYYY-MM-DD
  totals: NutrientMap; // 현재 날짜의 섭취 합계 (useStatisticsStore.dailyStats에서 변환)
  targets: NutrientMap; // 목표치 (useStatisticsStore.combinedTargets에서 변환, 없으면 defaultTargets 사용)
  setDate: (dateISO: string) => void;
  setTotals: (partial: Partial<NutrientMap>) => void;
  setTargets: (partial: Partial<NutrientMap>) => void;
  resetTotals: () => void;
}

const defaultTotals: NutrientMap = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  vitaminC: 0,
  vitaminD: 0,
  zinc: 0,
};

/**
 * 기본 목표치 (API에서 combinedTargets를 가져오지 못했을 때 사용하는 fallback 값)
 * 실제로는 useStatisticsStore의 combinedTargets를 사용해야 함
 */
const defaultTargets: NutrientMap = {
  calories: 2000,
  protein: 80,
  carbs: 260,
  fat: 70,
  vitaminC: 100,
  vitaminD: 10,
  zinc: 11,
};

import { getTodayInKorea } from "../utils/dateUtils";

export const useNutritionStore = create<NutritionState>((set) => ({
  dateISO: getTodayInKorea(),
  totals: { ...defaultTotals },
  targets: { ...defaultTargets },
  setDate: (dateISO) => set({ dateISO }),
  setTotals: (partial) =>
    set((state) => ({ totals: { ...state.totals, ...partial } })),
  setTargets: (partial) =>
    set((state) => ({ targets: { ...state.targets, ...partial } })),
  resetTotals: () => set({ totals: { ...defaultTotals } }),
}));
