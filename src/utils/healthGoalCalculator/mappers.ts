// 건강 목표 제목을 타입으로 매핑하는 함수

import type { HealthGoalType } from "./types";

/**
 * 건강 목표 제목을 HealthGoalType으로 매핑
 */
export const mapGoalTitleToType = (title: string): HealthGoalType => {
  if (/감량|체지방|다이어트/.test(title)) {
    return "weightLoss";
  }
  if (/증량|벌크|근육/.test(title)) {
    return "weightGain";
  }
  if (/단백질|프로틴/.test(title)) {
    return "proteinSupplement";
  }
  if (/면역/.test(title)) {
    return "immunityBoost";
  }
  if (/혈압|혈당|혈관/.test(title)) {
    return "bloodPressureControl";
  }
  if (/체력|지구력|스태미너/.test(title)) {
    return "endurance";
  }
  if (/유지/.test(title)) {
    return "maintain";
  }
  return "maintain";
};
