// Central export for all services
// To switch between mock and API services, change the import paths below:
// - Use `./fridgeService` for API calls
// - Use `./fridgeService.mock` for mock data

export { default as apiClient } from "./api";
export {
  authService,
  type LoginRequest,
  type RegisterRequest,
  type User,
} from "./authService";

// API Services (change to .mock versions for development)
export { favoriteRecipeService } from "./favoriteRecipeService";
export { default as fridgeService } from "./fridgeService";
export { healthGoalService } from "./healthGoalService";
export { default as mealService } from "./mealService";
export { default as recipeService } from "./recipeService";

// Mock Services (uncomment to use mock data instead)
// export { favoriteRecipeService } from "./favoriteRecipeService.mock";
// export { default as fridgeService } from "./fridgeService.mock";
// export { healthGoalService } from "./healthGoalService.mock";
// export { default as mealService } from "./mealService.mock";
// export { default as recipeService } from "./recipeService.mock";

// Re-export types
export type { ApiError, ApiResponse } from "./api";
