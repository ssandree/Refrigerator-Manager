// 식단(Meal) 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { Ingredient } from "../data/mockFood";
import { Recipe } from "../data/mockRecipes";

// 식단 도메인 모델 (레시피/재료, 섭취일/등록일, 메모/식사유형 포함)
export interface Meal {
  id: string;
  recipe: Recipe | null;
  ingredients: Ingredient[];
  quantity: string;
  consumedAt: string;
  registeredAt: string;
  notes?: string;
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
}

// 스토어 상태와 액션 정의
interface MealState {
  meals: Meal[];
  // 식단 추가 (중복 ID 방지)
  addMeal: (meal: Meal) => void;
  // 식단 일부 필드 업데이트
  updateMeal: (id: string, updatedMeal: Partial<Meal>) => void;
  // 식단 삭제
  removeMeal: (id: string) => void;
  // 단건 조회
  getMealById: (id: string) => Meal | undefined;
  // 날짜별 조회 (consumedAt 기준)
  getMealsByDate: (date: string) => Meal[];
  // 레시피별 조회
  getMealsByRecipe: (recipeId: string) => Meal[];
  // 식사 유형별 조회
  getMealsByMealType: (mealType: Meal["mealType"]) => Meal[];
  // 전체 초기화
  clearAllMeals: () => void;
}

export const useMealStore = create<MealState>((set, get) => ({
  meals: [],

  // 식단 추가 (이미 존재하면 무시)
  addMeal: (meal) => {
    set((state) => {
      if (state.meals.find((m) => m.id === meal.id)) {
        return state;
      }
      return { meals: [...state.meals, meal] };
    });
  },

  // 식단 업데이트
  updateMeal: (id, updatedMeal) => {
    set((state) => ({
      meals: state.meals.map((meal) =>
        meal.id === id ? { ...meal, ...updatedMeal } : meal
      ),
    }));
  },

  // 식단 삭제
  removeMeal: (id) => {
    set((state) => ({
      meals: state.meals.filter((meal) => meal.id !== id),
    }));
  },

  // ID로 단건 조회
  getMealById: (id) => {
    return get().meals.find((meal) => meal.id === id);
  },

  // 날짜별 조회
  getMealsByDate: (date) => {
    return get().meals.filter((meal) => meal.consumedAt === date);
  },

  // 레시피별 조회
  getMealsByRecipe: (recipeId) => {
    return get().meals.filter((meal) => meal.recipe?.id === recipeId);
  },

  // 식사 유형별 조회
  getMealsByMealType: (mealType) => {
    return get().meals.filter((meal) => meal.mealType === mealType);
  },

  // 전체 초기화
  clearAllMeals: () => {
    set({ meals: [] });
  },
}));
