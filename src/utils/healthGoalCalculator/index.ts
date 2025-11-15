// 건강 목표 계산 메인 export 파일

// 타입 export
export type {
  ActivityLevel,
  GoalMetric,
  HealthGoalPlan,
  HealthGoalType,
  Sex,
  UserHealthProfile,
  WeeklyIntakeSummary,
} from "./types";

// 계산 함수 export
export {
  calculateBmr,
  calculateTdee,
  getProteinRangeForSupplement,
} from "./calculations";

// 유틸리티 함수 export
export {
  averageProgress,
  clamp01,
  formatGramRange,
  gramsToDisplay,
  iuToDisplay,
  kcalToGrams,
  mgToDisplay,
  progressAtLeast,
  progressAtMost,
  progressWithinRange,
  safeDivide,
} from "./utils";

// 목표 타입 매핑 함수
export { mapGoalTitleToType } from "./mappers";

// 메인 계산 함수
export { calculateHealthGoalPlan } from "./main";
