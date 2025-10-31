// 냉장고(재료) 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { Ingredient, mockIngredients } from "../data/mockFood";

// 스토어 상태와 액션 정의
interface FridgeState {
  ingredients: Ingredient[];
  // 재료 추가 (중복 ID 방지)
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (
    id: string,
    updatedIngredient: Partial<Ingredient>
  ) => void;
  // 재료 삭제
  removeIngredient: (id: string) => void;
  // 단건 조회
  getIngredientById: (id: string) => Ingredient | undefined;
  // 카테고리별 조회
  getIngredientsByCategory: (category: string) => Ingredient[];
  // 보관 위치별 조회
  getIngredientsByStorageLocation: (location: string) => Ingredient[];
  // 전체 초기화
  clearAllIngredients: () => void;
}

export const useFridgeStore = create<FridgeState>((set, get) => ({
  ingredients: mockIngredients,

  // 재료 추가 (이미 존재하면 무시)
  addIngredient: (ingredient) => {
    set((state) => {
      if (state.ingredients.find((i) => i.id === ingredient.id)) {
        return state;
      }
      return { ingredients: [...state.ingredients, ingredient] };
    });
  },

  // 재료 정보 업데이트
  updateIngredient: (id, updatedIngredient) => {
    set((state) => ({
      ingredients: state.ingredients.map((ingredient) =>
        ingredient.id === id
          ? { ...ingredient, ...updatedIngredient }
          : ingredient
      ),
    }));
  },

  // 재료 삭제
  removeIngredient: (id) => {
    set((state) => ({
      ingredients: state.ingredients.filter(
        (ingredient) => ingredient.id !== id
      ),
    }));
  },

  // ID로 단건 조회
  getIngredientById: (id) => {
    return get().ingredients.find((ingredient) => ingredient.id === id);
  },

  // 카테고리 필터링
  getIngredientsByCategory: (category) => {
    return get().ingredients.filter(
      (ingredient) => ingredient.category === category
    );
  },

  // 보관 위치 필터링
  getIngredientsByStorageLocation: (location) => {
    return get().ingredients.filter(
      (ingredient) => ingredient.storageLocation === location
    );
  },

  // 전체 초기화
  clearAllIngredients: () => {
    set({ ingredients: [] });
  },
}));
