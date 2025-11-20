// BE에서 받아올 데이터 타입 정의
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "veryActive";

export type Sex = "male" | "female";

export interface UserHealthProfile {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
}

export interface WeeklyIntakeSummary {
  averageDailyCalories: number;
  averageDailyProtein: number;
  averageDailyCarbs: number;
  averageDailyFat: number;
  averageDailyFiber: number;
  averageDailyVitaminC: number;
  averageDailyVitaminD: number;
  averageDailyZinc: number;
  averageDailySodium: number;
}

export const mockUserProfile: UserHealthProfile = {
  sex: "female",
  age: 32,
  heightCm: 165,
  weightKg: 58,
  activityLevel: "moderate",
};

export const mockWeeklyIntake: WeeklyIntakeSummary = {
  averageDailyCalories: 1850,
  averageDailyProtein: 92,
  averageDailyCarbs: 215,
  averageDailyFat: 58,
  averageDailyFiber: 28,
  averageDailyVitaminC: 145,
  averageDailyVitaminD: 1200,
  averageDailyZinc: 9.5,
  averageDailySodium: 1850,
};

export const activityLabelMap: Record<ActivityLevel, string> = {
  sedentary: "거의 활동 없음",
  light: "가벼운 활동 (주 1~3회)",
  moderate: "보통 활동 (주 3~5회)",
  active: "높은 활동 (주 6~7회)",
  veryActive: "매우 높은 활동 (운동선수 수준)",
};
