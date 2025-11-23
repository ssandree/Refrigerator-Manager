// 역할: 온보딩에서 사용자 건강 목표(최대 3개)를 선택하고, 선택 결과를 Zustand 스토어에 저장
// - 로컬 상태(localSelectedIds)로 UI 선택을 관리하며 완료 시 일괄 반영(setSelectedGoals)
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HealthGoalSelector } from "../../src/components/onboarding/HealthGoalSelector";
import { OnboardingFooterButton } from "../../src/components/onboarding/OnboardingFooterButton";
import { OnboardingProgress } from "../../src/components/onboarding/OnboardingProgress";
import { OnboardingTitle } from "../../src/components/onboarding/OnboardingTitle";
import { mockHealthGoals } from "../../src/data/mockHealthGoals";
import {
  Colors,
  commonStyles,
  createShadowStyle,
  FontSizes,
  noShadowStyle,
} from "../../src/styles/common";
import { saveOnboardingData } from "../../src/utils/onboardingStorage";

export default function GetHealthGoal() {
  const insets = useSafeAreaInsets();
  // 건강 목표는 상수에서 직접 가져옴
  const allGoals = mockHealthGoals;

  // 화면 내 임시 선택 상태(3개 초과 선택 방지)
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 목표 선택/해제 토글
  const toggleGoal = (goalId: number) => {
    setLocalSelectedIds((prev) => {
      if (prev.includes(goalId)) {
        return prev.filter((id) => id !== goalId);
      } else if (prev.length < 3) {
        return [...prev, goalId];
      }
      return prev;
    });
  };

  // 완료 버튼: 유효성 체크 후 온보딩 데이터 저장하고 로그인/회원가입 화면으로 이동
  const handleStart = async () => {
    if (localSelectedIds.length === 0) {
      Alert.alert("알림", "최소 1개의 건강 목표를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 건강 목표 ID 저장 (회원가입/로그인 후 사용)
      await saveOnboardingData({
        healthGoalIds: localSelectedIds,
      });

      // 로그인/회원가입 화면으로 이동
      router.push("/(auth)/Login");
    } catch (error) {
      console.error("온보딩 데이터 저장 중 오류:", error);
      Alert.alert(
        "오류",
        "데이터 저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 본문 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 단계 표시 및 타이틀 블록 */}
        <View style={styles.headerSection}>
          <OnboardingProgress current={3} style={styles.progress} />
          <OnboardingTitle
            title="건강 목표 설정"
            subtitle="나에게 맞는 건강 목표를 선택해주세요"
            limitText="최대 3개까지 선택 가능"
          />
        </View>

        {/* 목표 선택 리스트 */}
        <HealthGoalSelector
          healthGoals={allGoals}
          selectedGoalIds={localSelectedIds}
          onGoalToggle={toggleGoal}
          maxSelection={3}
        />

        {/* 선택 개수 표시 */}
        <Text style={styles.selectedCount}>
          {localSelectedIds.length}/3 선택됨
        </Text>
      </ScrollView>

      <OnboardingFooterButton
        prevLabel="이전"
        onPressPrev={() => router.push("./GetBmiActing")}
        label="시작하기"
        onPress={handleStart}
        disabled={localSelectedIds.length === 0 || isSubmitting}
      />
    </View>
  );
}

const footerShadow = createShadowStyle({
  offsetHeight: -2,
  opacity: 0.1,
  radius: 3,
  elevation: 5,
});

const primaryButtonShadow = createShadowStyle({
  opacity: 0.25,
  radius: 3.84,
  elevation: 5,
});

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  headerSection: {
    width: "100%",
    marginBottom: 30,
  },
  progress: {
    alignSelf: "flex-start",
  },
  progressDot: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.textPrimary,
  },
  progressDotInactive: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.textTertiary,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: FontSizes["2xl"],
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    marginBottom: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  limitText: {
    fontSize: FontSizes.base,
    color: Colors.textTertiary,
    textAlign: "center",
    marginBottom: 24,
  },
  selectedCount: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: FontSizes.base,
    color: "#FF3B30",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
  },
  loadingText: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...footerShadow,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    ...primaryButtonShadow,
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
    ...noShadowStyle,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSizes.xl,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: Colors.textTertiary,
  },
});
