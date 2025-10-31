// Central export for all services
export { default as apiClient } from "./api";
export {
  authService,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from "./authService";
export { favoriteRecipeService } from "./favoriteRecipeService";
export { fridgeService } from "./fridgeService";
export { healthGoalService } from "./healthGoalService";
export { mealService } from "./mealService";

// Re-export types
export type { ApiError, ApiResponse } from "./api";
