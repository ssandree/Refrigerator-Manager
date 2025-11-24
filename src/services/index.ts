// Central export for all services
export { default as apiClient } from "./apiClient";
export {
  authService,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from "./authService";

export { favoriteRecipeService } from "./favoriteRecipeService";
export { default as foodService } from "./foodService";
export { healthGoalService } from "./healthGoalService";
export { default as mealService } from "./mealService";
export { default as notificationService } from "./notificationService";
export { default as recipeService } from "./recipeService";

// Re-export types
export type { ApiError, ApiResponse } from "./apiClient";
export type { Notification } from "./notificationService";
