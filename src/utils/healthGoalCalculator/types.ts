// 건강 목표 계산 관련 타입 정의

export type Sex = "male" | "female";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "veryActive";

export interface UserHealthProfile {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
}

export interface WeeklyIntakeSummary {
  averageDailyCalories?: number;
  averageDailyProtein?: number;
  averageDailyCarbs?: number;
  averageDailyFat?: number;
  averageDailyFiber?: number;
  averageDailyVitaminC?: number; // mg
  averageDailyVitaminD?: number; // IU
  averageDailyZinc?: number; // mg
  averageDailySodium?: number; // mg
}

export type HealthGoalType =
  | "maintain"
  | "weightLoss"
  | "weightGain"
  | "proteinSupplement"
  | "immunityBoost"
  | "bloodPressureControl"
  | "endurance";

export interface GoalMetric {
  label: string;
  target: string;
  current?: string;
  progress?: number;
  note?: string;
}

export interface HealthGoalPlan {
  goalType: HealthGoalType;
  title: string;
  summary: string;
  targetCalories: number;
  displayCalories: string;
  metrics: GoalMetric[];
  recommendedFoods: string[];
  notes: string[];
  overallProgress: number;
}
