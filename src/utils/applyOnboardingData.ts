// 온보딩 데이터를 사용자 정보에 적용하는 유틸리티
import { mockHealthGoals } from "../data/HealthGoalConstants";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/useAuthStore";
import { useHealthGoalStore } from "../stores/useHealthGoalStore";
import { clearOnboardingData, getOnboardingData } from "./onboardingStorage";

/**
 * 사용처: GetHealthGoal.tsx, Signup.tsx
 * 역할: 온보딩 데이터를 서버에 저장하고 사용자 정보 업데이트
 */
/**
 * @param userId - 사용자 ID
 * @returns 성공 여부
 */
export const applyOnboardingData = async (userId: string): Promise<boolean> => {
  try {
    // 온보딩 데이터 로드
    const onboardingData = await getOnboardingData();

    // 온보딩 데이터가 없으면 성공으로 처리 (온보딩을 건너뛴 경우)
    if (
      !onboardingData.sex &&
      !onboardingData.age &&
      !onboardingData.height &&
      !onboardingData.weight &&
      !onboardingData.activityLevel &&
      !onboardingData.healthGoalIds?.length
    ) {
      return true;
    }

    // BMI 계산 (키: cm, 몸무게: kg)
    let bmi: number | null = null;
    if (onboardingData.height && onboardingData.weight) {
      const heightInMeters = onboardingData.height / 100;
      bmi = onboardingData.weight / (heightInMeters * heightInMeters);
    }

    // 사용자 정보 업데이트 API 호출
    const updateResponse = await authService.updateUser(userId, {
      sex: onboardingData.sex || null,
      age: onboardingData.age || null,
      height: onboardingData.height || null,
      weight: onboardingData.weight || null,
      activityLevel: onboardingData.activityLevel || null,
      bmi: bmi,
    });

    if (!updateResponse.success || !updateResponse.data) {
      console.error("사용자 정보 업데이트 실패:", updateResponse.message);
      return false;
    }

    // 로컬 사용자 정보 업데이트
    const updateUser = useAuthStore.getState().updateUser;
    updateUser({
      sex: updateResponse.data.sex || undefined,
      age: updateResponse.data.age ?? undefined,
      height: updateResponse.data.height ?? undefined,
      bmi: updateResponse.data.bmi ?? undefined,
      weight: updateResponse.data.weight ?? undefined,
      activityLevel: updateResponse.data.activityLevel || undefined,
    });

    // 건강 목표 저장
    if (
      onboardingData.healthGoalIds &&
      onboardingData.healthGoalIds.length > 0
    ) {
      try {
        const setSelectedGoals = useHealthGoalStore.getState().setSelectedGoals;
        const selectedGoalsData = mockHealthGoals.filter((goal) =>
          onboardingData.healthGoalIds!.includes(goal.id)
        );

        if (selectedGoalsData.length === 0) {
          console.error(
            "건강 목표 저장 실패: 선택된 목표를 찾을 수 없습니다",
            onboardingData.healthGoalIds
          );
          // 목표를 찾지 못해도 계속 진행 (온보딩 데이터는 삭제)
          await clearOnboardingData();
          return true;
        }

        const goalsResponse = await setSelectedGoals(selectedGoalsData);

        if (!goalsResponse) {
          const error = useHealthGoalStore.getState().error;
          console.error("건강 목표 저장 실패:", error || "알 수 없는 오류");
          // 건강 목표 저장 실패해도 사용자 정보는 업데이트되었으므로 계속 진행
          await clearOnboardingData();
          return true; // 사용자 정보는 업데이트되었으므로 성공으로 처리
        }
      } catch (error) {
        console.error("건강 목표 저장 중 예외 발생:", error);
        // 예외 발생해도 사용자 정보는 업데이트되었으므로 계속 진행
        await clearOnboardingData();
        return true; // 사용자 정보는 업데이트되었으므로 성공으로 처리
      }
    }

    // 온보딩 데이터 삭제
    await clearOnboardingData();

    return true;
  } catch (error) {
    console.error("온보딩 데이터 적용 중 오류:", error);
    return false;
  }
};
