// Central export for all services
export { default as apiClient } from "./api";
export {
  authService,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from "./authService";
export { favoriteRecipeService } from "./favoriteRecipeService";
export { default as fridgeService } from "./fridgeService";
export { healthGoalService } from "./healthGoalService";
export { default as mealService } from "./mealService";
export { default as recipeService } from "./recipeService";

// Re-export types
export type { ApiError, ApiResponse } from "./api";
