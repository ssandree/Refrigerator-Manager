// 역할: 온보딩에서 사용자 건강 목표(최대 3개)를 선택하고, 선택 결과를 Zustand 스토어에 저장
// - 로컬 상태(localSelectedIds)로 UI 선택을 관리하며 완료 시 일괄 반영(setSelectedGoals)
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useHealthGoalStore } from "../../stores/useHealthGoalStore";
import { Colors, commonStyles, FontSizes } from "../../styles/common";
import {
  healthGoals,
  HealthGoalSelector,
} from "./components/HealthGoalSelector";
import { OnboardingFooterButton } from "./components/OnboardingFooterButton";
import { OnboardingProgress } from "./components/OnboardingProgress";
import { OnboardingTitle } from "./components/OnboardingTitle";

export default function GetHealthGoal() {
  // Zustand: 선택된 목표를 전역으로 일괄 설정하는 액션
  const setSelectedGoals = useHealthGoalStore(
    (state) => state.setSelectedGoals
  );
  // 화면 내 임시 선택 상태(3개 초과 선택 방지)
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>([]);

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

  // 완료 버튼: 유효성 체크 후 선택 항목을 전역 상태로 저장하고 로그인으로 이동
  const handleStart = () => {
    if (localSelectedIds.length === 0) {
      alert("최소 1개의 건강 목표를 선택해주세요.");
      return;
    }

    // 선택된 목표들을 Zustand 스토어에 일괄 저장
    const selectedGoalsData = healthGoals.filter((goal) =>
      localSelectedIds.includes(goal.id)
    );
    setSelectedGoals(selectedGoalsData);

    router.push("/(auth)/Login");
  };

  return (
    <View style={styles.container}>
      {/* 본문 스크롤 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 단계 표시 및 타이틀 블록 */}
        <OnboardingProgress current={3} style={{ width: "100%" }} />
        <OnboardingTitle
          title="건강 목표 설정"
          subtitle="나에게 맞는 건강 목표를 선택해주세요"
          limitText="최대 3개까지 선택 가능"
        />

        {/* 목표 선택 리스트 */}
        <HealthGoalSelector
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
        disabled={localSelectedIds.length === 0}
      />
    </View>
  );
}

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
    paddingTop: 30,
    paddingBottom: 120,
  },
  progress: {
    flexDirection: "row",
    marginBottom: 50,
    width: "100%",
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
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
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
