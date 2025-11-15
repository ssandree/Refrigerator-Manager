// 건강 목표 계획 계산 메인 함수

import {
  buildBloodPressurePlan,
  buildEndurancePlan,
  buildImmunityPlan,
  buildMaintainPlan,
  buildProteinSupplementPlan,
  buildWeightGainPlan,
  buildWeightLossPlan,
} from "./goalPlans";
import type {
  HealthGoalPlan,
  HealthGoalType,
  UserHealthProfile,
  WeeklyIntakeSummary,
} from "./types";

/**
 * 건강 목표 타입에 따라 적절한 계획을 계산하여 반환
 */
export const calculateHealthGoalPlan = (
  profile: UserHealthProfile,
  goalType: HealthGoalType,
  intake?: WeeklyIntakeSummary
): HealthGoalPlan => {
  switch (goalType) {
    case "weightLoss":
      return buildWeightLossPlan(profile, intake);
    case "weightGain":
      return buildWeightGainPlan(profile, intake);
    case "proteinSupplement":
      return buildProteinSupplementPlan(profile, intake);
    case "immunityBoost":
      return buildImmunityPlan(profile, intake);
    case "bloodPressureControl":
      return buildBloodPressurePlan(profile, intake);
    case "endurance":
      return buildEndurancePlan(profile, intake);
    case "maintain":
    default:
      return buildMaintainPlan(profile, intake);
  }
};
