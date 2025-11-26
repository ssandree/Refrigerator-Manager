/**
 * 사용처: Onboarding.tsx
 * 역할: 온보딩 필수 항목 확인
 */

interface OnboardingProfile {
  sex?: string | null;
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  activityLevel?: string | null;
}

const isValidNumber = (value?: number | null) =>
  typeof value === "number" && !Number.isNaN(value);

/**
 * 사용자 정보 중 필수 온보딩 항목(성별/나이/키/몸무게/활동량)이 모두 존재하는지 확인한다.
 * 하나라도 누락되었으면 true를 반환하여 온보딩을 진행하도록 한다.
 */
export const needsOnboarding = (
  user: OnboardingProfile | null | undefined
): boolean => {
  if (!user) {
    return true;
  }

  return (
    !user.sex ||
    !isValidNumber(user.age) ||
    !isValidNumber(user.height) ||
    !isValidNumber(user.weight) ||
    !user.activityLevel
  );
};
