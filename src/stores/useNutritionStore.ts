import { create } from "zustand";

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
  totals: NutrientMap; // 현재 날짜의 섭취 합계
  targets: NutrientMap; // 목표치
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

const defaultTargets: NutrientMap = {
  calories: 2000,
  protein: 80,
  carbs: 260,
  fat: 70,
  vitaminC: 100,
  vitaminD: 10,
  zinc: 11,
};

export const useNutritionStore = create<NutritionState>((set) => ({
  dateISO: new Date().toISOString().split("T")[0],
  totals: { ...defaultTotals },
  targets: { ...defaultTargets },
  setDate: (dateISO) => set({ dateISO }),
  setTotals: (partial) =>
    set((state) => ({ totals: { ...state.totals, ...partial } })),
  setTargets: (partial) =>
    set((state) => ({ targets: { ...state.targets, ...partial } })),
  resetTotals: () => set({ totals: { ...defaultTotals } }),
}));
