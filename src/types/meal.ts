export type MealTypeOption = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  recipeId: string | null;
  foodIds: string[];
  quantity: string | null;
  consumedAt: string;
  registeredAt: string;
  notes: string | null;
  mealType: MealTypeOption | null;
}

export interface MealCreatePayload {
  recipeId?: string | null;
  foodIds?: string[];
  quantity?: string | null;
  consumedAt: string;
  notes?: string | null;
  mealType?: MealTypeOption | null;
}

export interface MealUpdatePayload {
  quantity?: string | null;
  notes?: string | null;
  mealType?: MealTypeOption | null;
}

export interface MealQueryParams {
  date?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  // FE에서는 mealType으로 사용하지만,
  // BE에서는 Query(alias="type") 이므로 실제 전송 시에는 "type"으로 보내야 함
  mealType?: MealTypeOption | null;
  recipeId?: string | null;
}

export interface MealStatistics {
  totalCalories: number;
  totalMeals: number;
  averagePerMeal: number;
}
