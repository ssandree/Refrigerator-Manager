import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HealthGoalSelector } from "../../src/components/onboarding/HealthGoalSelector";
import { mockHealthGoals } from "../../src/data/mockHealthGoals";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useHealthGoalStore } from "../../src/stores/useHealthGoalStore";
import { Colors, FontSizes } from "../../src/styles/common";

interface UpdateHealthGoalProps {
  onClose: () => void;
}

export default function UpdateHealthGoal({ onClose }: UpdateHealthGoalProps) {
  const insets = useSafeAreaInsets();
  // 건강 목표는 상수에서 직접 가져옴
  const allGoals = mockHealthGoals;
  const selectedGoals = useHealthGoalStore((state) => state.selectedGoals);
  const loadUserSelectedGoals = useHealthGoalStore(
    (state) => state.loadUserSelectedGoals
  );
  const setSelectedGoals = useHealthGoalStore(
    (state) => state.setSelectedGoals
  );

  useStoreWithError(useHealthGoalStore);

  // 컴포넌트 마운트 시 사용자 선택 목표 로드
  useEffect(() => {
    loadUserSelectedGoals(true);
  }, [loadUserSelectedGoals]);

  // 초기값: 전역 상태에서 가져온 선택된 목표 ID들
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>(() =>
    selectedGoals.map((goal) => goal.id)
  );

  // selectedGoals가 변경되면 localSelectedIds도 업데이트
  useEffect(() => {
    setLocalSelectedIds(selectedGoals.map((goal) => goal.id));
  }, [selectedGoals]);

  // 토글 함수 (3개 제한 로직 포함)
  // 로컬 상태만 업데이트하며, 저장 시점에만 전역 상태에 반영됨
  const toggleGoal = (goalId: number) => {
    setLocalSelectedIds((prev) => {
      if (prev.includes(goalId)) {
        // 제거
        return prev.filter((id) => id !== goalId);
      } else if (prev.length < 3) {
        // 추가 (최대 3개)
        return [...prev, goalId];
      }
      return prev; // 이미 3개면 변경 없음
    });
  };

  // 저장 시점에만 전역 상태 업데이트
  const handleSave = async () => {
    if (localSelectedIds.length === 0) {
      alert("최소 1개의 건강 목표를 선택해주세요.");
      return;
    }

    // 로컬 상태를 기반으로 선택된 목표 데이터 생성
    const selectedGoalsData = allGoals.filter((goal) =>
      localSelectedIds.includes(goal.id)
    );

    // 전역 상태 업데이트 (서버에 저장)
    const success = await setSelectedGoals(selectedGoalsData);
    if (success) {
      // 서버 동기화 성공 시 사용자 선택 목표 다시 로드
      await loadUserSelectedGoals(true);
      onClose();
    }
  };

  // 취소 시 로컬 상태는 버리고 모달만 닫음
  const handleCancel = () => {
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>건강 목표 수정</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveButton,
            localSelectedIds.length === 0 && styles.saveButtonDisabled,
          ]}
          disabled={localSelectedIds.length === 0}
        >
          <Text
            style={[
              styles.saveButtonText,
              localSelectedIds.length === 0 && styles.saveButtonTextDisabled,
            ]}
          >
            저장
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          나에게 맞는 건강 목표를 선택해주세요
        </Text>
        <Text style={styles.limitText}>최대 3개까지 선택 가능</Text>

        <HealthGoalSelector
          healthGoals={allGoals}
          selectedGoalIds={localSelectedIds}
          onGoalToggle={toggleGoal}
          maxSelection={3}
        />

        <View style={styles.footer}>
          <Text style={styles.selectedCount}>
            {localSelectedIds.length}/3 선택됨
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.border,
  },
  saveButtonText: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.surface,
  },
  saveButtonTextDisabled: {
    color: Colors.textTertiary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    marginBottom: 8,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  limitText: {
    fontSize: FontSizes.base,
    color: Colors.textTertiary,
    textAlign: "center",
    marginBottom: 24,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  selectedCount: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
