// 건강 목표 계산 관련 상수 정의

import type { ActivityLevel, HealthGoalType } from "./types";

export const activityMultiplier: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export const FOOD_RECOMMENDATIONS: Record<HealthGoalType, string[]> = {
  maintain: [
    "현미",
    "통곡물 파스타",
    "달걀",
    "연어",
    "계절 채소",
    "견과류 소량",
  ],
  weightLoss: [
    "닭가슴살",
    "두부",
    "그릭 요거트",
    "귀리",
    "고구마",
    "현미",
    "브로콜리",
    "시금치",
    "아보카도",
    "견과류 소량",
  ],
  weightGain: [
    "소고기",
    "연어",
    "달걀",
    "치즈",
    "땅콩버터",
    "아몬드",
    "통곡물 빵",
    "파스타",
    "감자",
    "올리브유",
    "우유",
  ],
  proteinSupplement: [
    "닭고기",
    "생선",
    "달걀",
    "두유",
    "콩류",
    "렌틸콩",
    "단백질 쉐이크",
    "새우",
    "홍합",
  ],
  immunityBoost: [
    "감귤류 과일",
    "키위",
    "파프리카",
    "버섯",
    "연어",
    "요구르트",
    "김치",
    "마늘",
    "견과류",
    "토마토",
    "블루베리",
  ],
  bloodPressureControl: [
    "바나나",
    "고구마",
    "시금치",
    "아보카도",
    "연어",
    "고등어",
    "아몬드",
    "올리브유",
    "두부",
    "저지방 우유",
  ],
  endurance: [
    "현미",
    "통곡물 파스타",
    "고구마",
    "닭고기",
    "달걀",
    "시금치",
    "렌틸콩",
    "바나나",
    "견과류",
    "다크 초콜릿",
  ],
};

export const GOAL_SUMMARY: Record<HealthGoalType, string> = {
  maintain: "현재 체중과 컨디션을 안정적으로 유지하기 위한 일일 권장량입니다.",
  weightLoss:
    "체지방 감량을 위해 TDEE에서 300kcal를 감량한 칼로리와 영양소 비율을 제안합니다.",
  weightGain:
    "근육 증가와 체중 증량을 지원하기 위해 TDEE에 300kcal를 추가한 계획입니다.",
  proteinSupplement:
    "근육 유지와 회복을 돕는 단백질 섭취량과 필수 아미노산을 제안합니다.",
  immunityBoost:
    "면역력 강화를 위해 필수 영양소(단백질, 비타민, 미네랄) 공급을 제안합니다.",
  bloodPressureControl:
    "혈압 관리를 위한 나트륨 제한과 칼륨, 마그네슘 섭취 비율을 제공합니다.",
  endurance:
    "지속적인 에너지 공급과 근육 유지에 초점을 맞춘 탄수화물·단백질 계획입니다.",
};

export const GOAL_TITLES: Record<HealthGoalType, string> = {
  maintain: "체중 유지",
  weightLoss: "체중 감량",
  weightGain: "체중 증량",
  proteinSupplement: "단백질 보충",
  immunityBoost: "면역력 강화",
  bloodPressureControl: "혈압 관리",
  endurance: "체력 유지/향상",
};
