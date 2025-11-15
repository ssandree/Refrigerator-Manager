// 각 건강 목표별 계획 빌더 함수들

import {
  calculateBmr,
  calculateTdee,
  getProteinRangeForSupplement,
} from "./calculations";
import { FOOD_RECOMMENDATIONS, GOAL_SUMMARY, GOAL_TITLES } from "./constants";
import type {
  HealthGoalPlan,
  UserHealthProfile,
  WeeklyIntakeSummary,
} from "./types";
import {
  averageProgress,
  formatGramRange,
  gramsToDisplay,
  iuToDisplay,
  kcalToGrams,
  mgToDisplay,
  progressAtLeast,
  progressAtMost,
  progressWithinRange,
} from "./utils";

const buildMaintainPlan = (
  profile: UserHealthProfile,
  intake?: WeeklyIntakeSummary
): HealthGoalPlan => {
  const bmr = calculateBmr(profile);
  const tdee = calculateTdee(profile, bmr);
  const targetCalories = tdee;
  const caloriesCurrent = intake?.averageDailyCalories;
  const calorieProgress = progressWithinRange(
    caloriesCurrent,
    targetCalories * 0.95,
    targetCalories * 1.05
  );

  const proteinTarget = profile.weightKg * 1.2;
  const fatTarget = kcalToGrams(targetCalories * 0.3, 9);
  const carbTarget = kcalToGrams(
    targetCalories - (proteinTarget * 4 + fatTarget * 9),
    4
  );

  const proteinProgress = progressWithinRange(
    intake?.averageDailyProtein,
    proteinTarget * 0.9,
    proteinTarget * 1.1
  );
  const fatProgress = progressWithinRange(
    intake?.averageDailyFat,
    fatTarget * 0.9,
    fatTarget * 1.1
  );
  const carbProgress = progressWithinRange(
    intake?.averageDailyCarbs,
    carbTarget * 0.9,
    carbTarget * 1.1
  );

  return {
    goalType: "maintain",
    title: GOAL_TITLES.maintain,
    summary: GOAL_SUMMARY.maintain,
    targetCalories,
    displayCalories: `${Math.round(targetCalories)}kcal`,
    metrics: [
      {
        label: "일일 권장 칼로리",
        target: `${Math.round(targetCalories)}kcal`,
        current: caloriesCurrent
          ? `${Math.round(caloriesCurrent)}kcal`
          : undefined,
        progress: calorieProgress,
      },
      {
        label: "단백질",
        target: gramsToDisplay(proteinTarget),
        current: intake?.averageDailyProtein
          ? gramsToDisplay(intake.averageDailyProtein)
          : undefined,
        progress: proteinProgress,
      },
      {
        label: "지방",
        target: gramsToDisplay(fatTarget),
        current: intake?.averageDailyFat
          ? gramsToDisplay(intake.averageDailyFat)
          : undefined,
        progress: fatProgress,
      },
      {
        label: "탄수화물",
        target: gramsToDisplay(carbTarget),
        current: intake?.averageDailyCarbs
          ? gramsToDisplay(intake.averageDailyCarbs)
          : undefined,
        progress: carbProgress,
      },
    ],
    recommendedFoods: FOOD_RECOMMENDATIONS.maintain,
    notes: [
      "균형 잡힌 3대 영양소 비율(단백질 25%, 지방 30%, 탄수화물 45%)을 유지해 주세요.",
      "충분한 수분 섭취와 수면이 체중 유지에 도움이 됩니다.",
    ],
    overallProgress: averageProgress([
      calorieProgress,
      proteinProgress,
      fatProgress,
      carbProgress,
    ]),
  };
};

const buildWeightLossPlan = (
  profile: UserHealthProfile,
  intake?: WeeklyIntakeSummary
): HealthGoalPlan => {
  const baseTdee = calculateTdee(profile);
  const targetCalories = Math.max(baseTdee - 300, 1100);
  const caloriesCurrent = intake?.averageDailyCalories;
  const calorieProgress = progressAtMost(caloriesCurrent, targetCalories);

  const proteinKcalMin = targetCalories * 0.2;
  const proteinKcalMax = targetCalories * 0.3;
  const proteinGramsMin = kcalToGrams(proteinKcalMin, 4);
  const proteinGramsMax = kcalToGrams(proteinKcalMax, 4);

  const fiberKcalMin = targetCalories * 0.2;
  const fiberKcalMax = targetCalories * 0.3;
  const fiberGramsMin = kcalToGrams(fiberKcalMin, 4);
  const fiberGramsMax = kcalToGrams(fiberKcalMax, 4);

  const fatKcalMin = targetCalories * 0.4;
  const fatKcalMax = targetCalories * 0.55;
  const fatGramsMin = kcalToGrams(fatKcalMin, 9);
  const fatGramsMax = kcalToGrams(fatKcalMax, 9);

  const proteinProgress = progressWithinRange(
    intake?.averageDailyProtein,
    proteinGramsMin,
    proteinGramsMax
  );
  const fiberProgress = progressWithinRange(
    intake?.averageDailyFiber,
    fiberGramsMin,
    fiberGramsMax
  );
  const fatProgress = progressWithinRange(
    intake?.averageDailyFat,
    fatGramsMin,
    fatGramsMax
  );

  return {
    goalType: "weightLoss",
    title: GOAL_TITLES.weightLoss,
    summary: GOAL_SUMMARY.weightLoss,
    targetCalories,
    displayCalories: `${Math.round(targetCalories)}kcal`,
    metrics: [
      {
        label: "일일 섭취 칼로리",
        target: `${Math.round(targetCalories)}kcal`,
        current: caloriesCurrent
          ? `${Math.round(caloriesCurrent)}kcal`
          : undefined,
        progress: calorieProgress,
      },
      {
        label: "단백질",
        target: formatGramRange(proteinGramsMin, proteinGramsMax),
        current: intake?.averageDailyProtein
          ? gramsToDisplay(intake.averageDailyProtein)
          : undefined,
        progress: proteinProgress,
        note: "포만감을 높이고 근손실을 방지하기 위해 충분히 섭취하세요.",
      },
      {
        label: "식이섬유",
        target: formatGramRange(fiberGramsMin, fiberGramsMax),
        current: intake?.averageDailyFiber
          ? gramsToDisplay(intake.averageDailyFiber)
          : undefined,
        progress: fiberProgress,
      },
      {
        label: "건강한 지방",
        target: formatGramRange(fatGramsMin, fatGramsMax),
        current: intake?.averageDailyFat
          ? gramsToDisplay(intake.averageDailyFat)
          : undefined,
        progress: fatProgress,
      },
    ],
    recommendedFoods: FOOD_RECOMMENDATIONS.weightLoss,
    notes: [
      "주 0.5kg 감량을 목표로 안정적인 칼로리 적자를 유지하세요.",
      "규칙적인 근력 운동과 충분한 수면이 체지방 감량에 도움이 됩니다.",
    ],
    overallProgress: averageProgress([
      calorieProgress,
      proteinProgress,
      fiberProgress,
      fatProgress,
    ]),
  };
};

const buildWeightGainPlan = (
  profile: UserHealthProfile,
  intake?: WeeklyIntakeSummary
): HealthGoalPlan => {
  const targetCalories = calculateTdee(profile) + 300;
  const caloriesCurrent = intake?.averageDailyCalories;
  const calorieProgress = progressAtLeast(caloriesCurrent, targetCalories);

  const proteinGramsMin = profile.weightKg * 1.6;
  const proteinGramsMax = profile.weightKg * 2.2;
  const proteinProgress = progressWithinRange(
    intake?.averageDailyProtein,
    proteinGramsMin,
    proteinGramsMax
  );

  const fatGramsMin = kcalToGrams(targetCalories * 0.2, 9);
  const fatGramsMax = kcalToGrams(targetCalories * 0.3, 9);
  const fatProgress = progressWithinRange(
    intake?.averageDailyFat,
    fatGramsMin,
    fatGramsMax
  );

  const proteinMid = (proteinGramsMin + proteinGramsMax) / 2;
  const fatMid = (fatGramsMin + fatGramsMax) / 2;
  const carbGrams = kcalToGrams(
    targetCalories - (proteinMid * 4 + fatMid * 9),
    4
  );
  const carbProgress = progressAtLeast(
    intake?.averageDailyCarbs,
    carbGrams * 0.9
  );

  return {
    goalType: "weightGain",
    title: GOAL_TITLES.weightGain,
    summary: GOAL_SUMMARY.weightGain,
    targetCalories,
    displayCalories: `${Math.round(targetCalories)}kcal`,
    metrics: [
      {
        label: "일일 섭취 칼로리",
        target: `${Math.round(targetCalories)}kcal`,
        current: caloriesCurrent
          ? `${Math.round(caloriesCurrent)}kcal`
          : undefined,
        progress: calorieProgress,
      },
      {
        label: "단백질",
        target: formatGramRange(proteinGramsMin, proteinGramsMax),
        current: intake?.averageDailyProtein
          ? gramsToDisplay(intake.averageDailyProtein)
          : undefined,
        progress: proteinProgress,
        note: "근육 합성을 위해 체중 1kg당 1.6~2.2g 단백질을 유지하세요.",
      },
      {
        label: "지방",
        target: formatGramRange(fatGramsMin, fatGramsMax),
        current: intake?.averageDailyFat
          ? gramsToDisplay(intake.averageDailyFat)
          : undefined,
        progress: fatProgress,
      },
      {
        label: "탄수화물",
        target: gramsToDisplay(carbGrams),
        current: intake?.averageDailyCarbs
          ? gramsToDisplay(intake.averageDailyCarbs)
          : undefined,
        progress: carbProgress,
      },
    ],
    recommendedFoods: FOOD_RECOMMENDATIONS.weightGain,
    notes: [
      "고단백 식품 중심으로 3시간마다 소량씩 섭취하면 도움됩니다.",
      "충분한 휴식과 수면이 근육 성장에 필수입니다.",
    ],
    overallProgress: averageProgress([
      calorieProgress,
      proteinProgress,
      fatProgress,
      carbProgress,
    ]),
  };
};

const buildProteinSupplementPlan = (
  profile: UserHealthProfile,
  intake?: WeeklyIntakeSummary
): HealthGoalPlan => {
  const tdee = calculateTdee(profile);
  const proteinRange = getProteinRangeForSupplement(profile);
  const caloriesCurrent = intake?.averageDailyCalories;
  const calorieProgress = progressWithinRange(
    caloriesCurrent,
    tdee * 0.95,
    tdee * 1.05
  );

  const proteinProgress = progressWithinRange(
    intake?.averageDailyProtein,
    proteinRange.min,
    proteinRange.max
  );

  return {
    goalType: "proteinSupplement",
    title: GOAL_TITLES.proteinSupplement,
    summary: GOAL_SUMMARY.proteinSupplement,
    targetCalories: tdee,
    displayCalories: `${Math.round(tdee)}kcal`,
    metrics: [
      {
        label: "일일 섭취 칼로리",
        target: `${Math.round(tdee)}kcal`,
        current: caloriesCurrent
          ? `${Math.round(caloriesCurrent)}kcal`
          : undefined,
        progress: calorieProgress,
      },
      {
        label: "단백질",
        target: formatGramRange(proteinRange.min, proteinRange.max),
        current: intake?.averageDailyProtein
          ? gramsToDisplay(intake.averageDailyProtein)
          : undefined,
        progress: proteinProgress,
        note: "단백질 과다(3g/kg 이상)는 신장에 부담이 될 수 있습니다.",
      },
    ],
    recommendedFoods: FOOD_RECOMMENDATIONS.proteinSupplement,
    notes: [
      "운동 직후 30분 내 단백질 보충이 근육 회복에 효과적입니다.",
      "필수 아미노산이 풍부한 단백질 식품을 다양하게 섭취하세요.",
    ],
    overallProgress: averageProgress([calorieProgress, proteinProgress]),
  };
};

const buildImmunityPlan = (
  profile: UserHealthProfile,
  intake?: WeeklyIntakeSummary
): HealthGoalPlan => {
  const tdee = calculateTdee(profile);
  const caloriesCurrent = intake?.averageDailyCalories;
  const calorieProgress = progressWithinRange(
    caloriesCurrent,
    tdee * 0.95,
    tdee * 1.05
  );

  const proteinTarget = profile.weightKg * 1.4;
  const fatTarget = kcalToGrams(tdee * 0.27, 9);

  const proteinProgress = progressWithinRange(
    intake?.averageDailyProtein,
    proteinTarget * 0.95,
    proteinTarget * 1.05
  );
  const fatProgress = progressWithinRange(
    intake?.averageDailyFat,
    fatTarget * 0.9,
    fatTarget * 1.1
  );
  const vitaminCProgress = progressAtLeast(intake?.averageDailyVitaminC, 150);
  const vitaminDProgress = progressAtLeast(intake?.averageDailyVitaminD, 1500);
  const zincProgress = progressWithinRange(intake?.averageDailyZinc, 9, 11);

  return {
    goalType: "immunityBoost",
    title: GOAL_TITLES.immunityBoost,
    summary: GOAL_SUMMARY.immunityBoost,
    targetCalories: tdee,
    displayCalories: `${Math.round(tdee)}kcal`,
    metrics: [
      {
        label: "단백질",
        target: gramsToDisplay(proteinTarget),
        current: intake?.averageDailyProtein
          ? gramsToDisplay(intake.averageDailyProtein)
          : undefined,
        progress: proteinProgress,
      },
      {
        label: "지방",
        target: gramsToDisplay(fatTarget),
        current: intake?.averageDailyFat
          ? gramsToDisplay(intake.averageDailyFat)
          : undefined,
        progress: fatProgress,
      },
      {
        label: "비타민 C",
        target: mgToDisplay(150),
        current: intake?.averageDailyVitaminC
          ? mgToDisplay(intake.averageDailyVitaminC)
          : undefined,
        progress: vitaminCProgress,
      },
      {
        label: "비타민 D",
        target: iuToDisplay(1500),
        current: intake?.averageDailyVitaminD
          ? iuToDisplay(intake.averageDailyVitaminD)
          : undefined,
        progress: vitaminDProgress,
      },
      {
        label: "아연",
        target: mgToDisplay(10),
        current: intake?.averageDailyZinc
          ? mgToDisplay(intake.averageDailyZinc)
          : undefined,
        progress: zincProgress,
      },
    ],
    recommendedFoods: FOOD_RECOMMENDATIONS.immunityBoost,
    notes: [
      "다양한 색상의 채소와 과일을 섭취하여 항산화 물질을 보충하세요.",
      "프로바이오틱스가 풍부한 발효식품은 장 건강과 면역력에 도움을 줍니다.",
    ],
    overallProgress: averageProgress([
      calorieProgress,
      proteinProgress,
      fatProgress,
      vitaminCProgress,
      vitaminDProgress,
      zincProgress,
    ]),
  };
};

const buildBloodPressurePlan = (
  profile: UserHealthProfile,
  intake?: WeeklyIntakeSummary
): HealthGoalPlan => {
  const tdee = calculateTdee(profile);
  const caloriesCurrent = intake?.averageDailyCalories;
  const calorieProgress = progressWithinRange(
    caloriesCurrent,
    tdee * 0.95,
    tdee * 1.05
  );

  const proteinTarget = profile.weightKg * 1.4;
  const fatTarget = kcalToGrams(tdee * 0.27, 9);
  const carbTarget = kcalToGrams(tdee - (proteinTarget * 4 + fatTarget * 9), 4);

  const proteinProgress = progressWithinRange(
    intake?.averageDailyProtein,
    proteinTarget * 0.95,
    proteinTarget * 1.05
  );
  const fatProgress = progressWithinRange(
    intake?.averageDailyFat,
    fatTarget * 0.9,
    fatTarget * 1.1
  );
  const carbProgress = progressWithinRange(
    intake?.averageDailyCarbs,
    carbTarget * 0.9,
    carbTarget * 1.1
  );
  const sodiumProgress = progressAtMost(intake?.averageDailySodium, 2000);

  return {
    goalType: "bloodPressureControl",
    title: GOAL_TITLES.bloodPressureControl,
    summary: GOAL_SUMMARY.bloodPressureControl,
    targetCalories: tdee,
    displayCalories: `${Math.round(tdee)}kcal`,
    metrics: [
      {
        label: "나트륨",
        target: "≤ 2000mg",
        current: intake?.averageDailySodium
          ? mgToDisplay(intake.averageDailySodium)
          : undefined,
        progress: sodiumProgress,
        note: "가공식품과 외식 섭취를 줄여 나트륨을 관리하세요.",
      },
      {
        label: "단백질",
        target: gramsToDisplay(proteinTarget),
        current: intake?.averageDailyProtein
          ? gramsToDisplay(intake.averageDailyProtein)
          : undefined,
        progress: proteinProgress,
      },
      {
        label: "지방",
        target: gramsToDisplay(fatTarget),
        current: intake?.averageDailyFat
          ? gramsToDisplay(intake.averageDailyFat)
          : undefined,
        progress: fatProgress,
      },
      {
        label: "탄수화물",
        target: gramsToDisplay(carbTarget),
        current: intake?.averageDailyCarbs
          ? gramsToDisplay(intake.averageDailyCarbs)
          : undefined,
        progress: carbProgress,
      },
    ],
    recommendedFoods: FOOD_RECOMMENDATIONS.bloodPressureControl,
    notes: [
      "칼륨과 마그네슘이 풍부한 식품을 섭취하면 혈압 조절에 도움이 됩니다.",
      "짠 음식 대신 허브와 향신료로 간을 조절해 보세요.",
    ],
    overallProgress: averageProgress([
      calorieProgress,
      sodiumProgress,
      proteinProgress,
      fatProgress,
      carbProgress,
    ]),
  };
};

const buildEndurancePlan = (
  profile: UserHealthProfile,
  intake?: WeeklyIntakeSummary
): HealthGoalPlan => {
  const tdee = calculateTdee(profile);
  const caloriesCurrent = intake?.averageDailyCalories;
  const calorieProgress = progressWithinRange(
    caloriesCurrent,
    tdee * 0.95,
    tdee * 1.05
  );

  const proteinTarget = profile.weightKg * 1.7;
  const fatTarget = kcalToGrams(tdee * 0.23, 9);
  const carbTarget = kcalToGrams(tdee - (proteinTarget * 4 + fatTarget * 9), 4);

  const proteinProgress = progressWithinRange(
    intake?.averageDailyProtein,
    proteinTarget * 0.95,
    proteinTarget * 1.05
  );
  const fatProgress = progressWithinRange(
    intake?.averageDailyFat,
    fatTarget * 0.9,
    fatTarget * 1.1
  );
  const carbProgress = progressAtLeast(
    intake?.averageDailyCarbs,
    carbTarget * 0.95
  );

  return {
    goalType: "endurance",
    title: GOAL_TITLES.endurance,
    summary: GOAL_SUMMARY.endurance,
    targetCalories: tdee,
    displayCalories: `${Math.round(tdee)}kcal`,
    metrics: [
      {
        label: "단백질",
        target: gramsToDisplay(proteinTarget),
        current: intake?.averageDailyProtein
          ? gramsToDisplay(intake.averageDailyProtein)
          : undefined,
        progress: proteinProgress,
      },
      {
        label: "지방",
        target: gramsToDisplay(fatTarget),
        current: intake?.averageDailyFat
          ? gramsToDisplay(intake.averageDailyFat)
          : undefined,
        progress: fatProgress,
      },
      {
        label: "탄수화물",
        target: gramsToDisplay(carbTarget),
        current: intake?.averageDailyCarbs
          ? gramsToDisplay(intake.averageDailyCarbs)
          : undefined,
        progress: carbProgress,
      },
    ],
    recommendedFoods: FOOD_RECOMMENDATIONS.endurance,
    notes: [
      "고강도 운동 전후 탄수화물과 단백질을 적절히 보충하세요.",
      "철분과 비타민 B군은 피로 회복과 에너지 생성에 필수입니다.",
    ],
    overallProgress: averageProgress([
      calorieProgress,
      proteinProgress,
      fatProgress,
      carbProgress,
    ]),
  };
};

export {
  buildBloodPressurePlan,
  buildEndurancePlan,
  buildImmunityPlan,
  buildMaintainPlan,
  buildProteinSupplementPlan,
  buildWeightGainPlan,
  buildWeightLossPlan,
};
