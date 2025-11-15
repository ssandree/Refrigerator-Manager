// 기본 대사량 및 TDEE 계산 함수들

import { activityMultiplier } from "./constants";
import type { UserHealthProfile } from "./types";

/**
 * 기초대사량(BMR) 계산
 * 남자: 66.47 + (13.75 × 체중) + (5 × 키) - (6.76 × 나이)
 * 여자: 655.1 + (9.56 × 체중) + (1.85 × 키) - (4.68 × 나이)
 */
export const calculateBmr = (profile: UserHealthProfile): number => {
  if (profile.sex === "male") {
    return (
      66.47 +
      13.75 * profile.weightKg +
      5 * profile.heightCm -
      6.76 * profile.age
    );
  }
  return (
    655.1 +
    9.56 * profile.weightKg +
    1.85 * profile.heightCm -
    4.68 * profile.age
  );
};

/**
 * 총 일일 에너지 소비량(TDEE) 계산
 * TDEE = BMR × 활동지수
 */
export const calculateTdee = (
  profile: UserHealthProfile,
  bmr = calculateBmr(profile)
): number => {
  const multiplier = activityMultiplier[profile.activityLevel] ?? 1.2;
  return bmr * multiplier;
};

/**
 * 단백질 보충 목표를 위한 단백질 범위 계산
 */
export const getProteinRangeForSupplement = (
  profile: UserHealthProfile
): { min: number; max: number } => {
  const weight = profile.weightKg;
  if (
    profile.activityLevel === "sedentary" ||
    profile.activityLevel === "light"
  ) {
    const grams = weight * 0.8;
    return { min: grams, max: grams };
  }
  const min = weight * 1.6;
  const max =
    profile.activityLevel === "veryActive" ? weight * 2.2 : weight * 2.0;
  return { min, max };
};
