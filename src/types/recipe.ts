export interface Recipe {
  id: string;
  recipeName: string;
  calories: number;
  time: number;
  healthGoal: number | null;
  timeCategory: string | null;
  ingredientsOwned: number;
  totalIngredients: number;
  isFavorite: boolean;
  imageUrl: string | null;
  tags: string[];
  difficulty: "쉬움" | "보통" | "어려움" | "매우 쉬움" | null;
  description: string | null;
  requiredfoods?: string[];
  calories_per_gram?: number | null;
  carbohydrates?: number | null;
  protein?: number | null;
  fat?: number | null;
  sodium?: number | null;
  vitamin_c?: number | null;
  vitamin_d?: number | null;
  zinc?: number | null;
}
