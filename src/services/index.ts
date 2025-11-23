// Central export for all services
// To switch between mock and API services, change the import paths below:
// - Use `./foodService` for API calls
// - Use `./foodService.mock` for mock data

export { default as apiClient } from "./apiClient";
export {
  authService,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from "./authService";

// API Services (change to .mock versions for development)
export { favoriteRecipeService } from "./favoriteRecipeService";
export { default as foodService } from "./foodService";
export { healthGoalService } from "./healthGoalService";
export { default as mealService } from "./mealService";
export { default as notificationService } from "./notificationService";
export { default as recipeService } from "./recipeService";

// Mock Services (uncomment to use mock data instead)
// export { favoriteRecipeService } from "./favoriteRecipeService.mock";
// export { default as foodService } from "./foodService.mock";
// export { healthGoalService } from "./healthGoalService.mock";
// export { default as mealService } from "./mealService.mock";
// export { default as recipeService } from "./recipeService.mock";

// Re-export types
export type { ApiError, ApiResponse } from "./apiClient";
export type { Notification } from "./notificationService";
