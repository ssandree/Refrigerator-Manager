import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  useHealthGoalStore,
  type HealthGoal,
} from "../../stores/useHealthGoalStore";
import { Colors, FontSizes } from "../../styles/common";
import {
  HealthGoalSelector,
  healthGoals,
} from "../onboarding/components/HealthGoalSelector";

interface UpdateHealthGoalProps {
  onClose: () => void;
}

export default function UpdateHealthGoal({ onClose }: UpdateHealthGoalProps) {
  const selectedGoals = useHealthGoalStore((state) => state.selectedGoals);
  const setSelectedGoals = useHealthGoalStore(
    (state) => state.setSelectedGoals
  );
  const addSelectedGoal = useHealthGoalStore((state) => state.addSelectedGoal);
  const removeSelectedGoal = useHealthGoalStore(
    (state) => state.removeSelectedGoal
  );
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>([]);
  const previousSelectedGoalsRef = useRef<HealthGoal[] | null>(null);

  useEffect(() => {
    // 처음 열릴 때 현재 전역 상태 스냅샷 저장 및 로컬 동기화
    if (previousSelectedGoalsRef.current === null) {
      previousSelectedGoalsRef.current = selectedGoals;
    }
    setLocalSelectedIds(selectedGoals.map((goal) => goal.id));
  }, [selectedGoals]);

  const toggleGoal = (goalId: number) => {
    setLocalSelectedIds((prev) => {
      if (prev.includes(goalId)) {
        // 로컬 업데이트
        const next = prev.filter((id) => id !== goalId);
        // 전역 상태 동기 제거
        removeSelectedGoal(goalId);
        return next;
      } else if (prev.length < 3) {
        const next = [...prev, goalId];
        // 전역 상태 동기 추가
        const goalData = healthGoals.find((g) => g.id === goalId);
        if (goalData) addSelectedGoal(goalData as unknown as HealthGoal);
        return next;
      }
      return prev;
    });
  };

  const handleSave = () => {
    if (localSelectedIds.length === 0) {
      alert("최소 1개의 건강 목표를 선택해주세요.");
      return;
    }
    // 전역 상태는 토글 시점에 이미 최신으로 반영됨. 안전하게 재동기화
    const selectedGoalsData = healthGoals.filter((goal) =>
      localSelectedIds.includes(goal.id)
    );
    setSelectedGoals(selectedGoalsData as unknown as HealthGoal[]);
    previousSelectedGoalsRef.current = null;
    onClose();
  };

  const handleCancel = () => {
    // 취소 시 스냅샷으로 롤백
    if (previousSelectedGoalsRef.current) {
      setSelectedGoals(previousSelectedGoalsRef.current);
    }
    previousSelectedGoalsRef.current = null;
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
