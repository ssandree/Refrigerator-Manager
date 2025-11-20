import { healthGoalService } from "@/services/healthGoalService";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HealthGoalSelector } from "../../src/components/onboarding/HealthGoalSelector";
import {
  useHealthGoalStore,
  type HealthGoal,
} from "../../src/stores/useHealthGoalStore";
import { Colors, FontSizes } from "../../src/styles/common";
import { logger } from "../../src/utils/logger";

interface UpdateHealthGoalProps {
  onClose: () => void;
}

export default function UpdateHealthGoal({ onClose }: UpdateHealthGoalProps) {
  const insets = useSafeAreaInsets();
  const selectedGoals = useHealthGoalStore((state) => state.selectedGoals);
  const setSelectedGoals = useHealthGoalStore(
    (state) => state.setSelectedGoals
  );

  // 초기값: 전역 상태에서 가져온 선택된 목표 ID들
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>(() =>
    selectedGoals.map((goal) => goal.id)
  );
  const [healthGoals, setHealthGoals] = useState<HealthGoal[]>([]);

  // Service를 통해 건강 목표 목록 로드
  useEffect(() => {
    const loadHealthGoals = async () => {
      try {
        const response = await healthGoalService.getAllGoals();
        if (response.success && response.data) {
          setHealthGoals(response.data);
        } else {
          logger.error("건강 목표 로드 실패:", response.message);
        }
      } catch (error) {
        logger.error("건강 목표 로드 중 오류:", error);
      }
    };
    loadHealthGoals();
  }, []);

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
  const handleSave = () => {
    if (localSelectedIds.length === 0) {
      alert("최소 1개의 건강 목표를 선택해주세요.");
      return;
    }

    // 로컬 상태를 기반으로 선택된 목표 데이터 생성
    const selectedGoalsData = healthGoals.filter((goal) =>
      localSelectedIds.includes(goal.id)
    );

    // 전역 상태 업데이트
    setSelectedGoals(selectedGoalsData);
    onClose();
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
          healthGoals={healthGoals}
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
