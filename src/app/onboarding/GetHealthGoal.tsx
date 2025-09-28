import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { healthGoals, HealthGoalSelector } from "../../components/HealthGoalSelector";
import { useHealthGoal } from "../../contexts/HealthGoalContext";
import { Colors, commonStyles, FontSizes } from "../../styles/common";

export default function GetHealthGoal() {
  const { selectedGoals, addSelectedGoal, removeSelectedGoal } = useHealthGoal();
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>([]);

  const toggleGoal = (goalId: number) => {
    setLocalSelectedIds(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else if (prev.length < 3) {
        return [...prev, goalId];
      }
      return prev;
    });
  };

   const handleGoToHome = () => {
    if (localSelectedIds.length === 0) {
      alert("최소 1개의 건강 목표를 선택해주세요.");
      return;
    }
    
    // 선택된 목표들을 Context에 저장
    const selectedGoalsData = healthGoals.filter(goal => localSelectedIds.includes(goal.id));
    selectedGoals.forEach(goal => removeSelectedGoal(goal.id)); // 기존 목표 제거
    selectedGoalsData.forEach(goal => addSelectedGoal(goal)); // 새 목표 추가
    
    router.push("../(tabs)/Home");
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: "건강 목표",
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTintColor: "#333",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.progress}>
            <Text style={styles.progressDotInactive}>●</Text>
            <Text style={styles.progressDotInactive}>●</Text>
            <Text style={styles.progressDot}>●</Text>
          </View>

          <Text style={styles.title}>건강 목표 설정</Text>
          <Text style={styles.subtitle}>나에게 맞는 건강 목표를 선택해주세요</Text>
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
        <TouchableOpacity 
          style={[
            styles.button,
            localSelectedIds.length === 0 && styles.buttonDisabled
          ]} 
          onPress={handleGoToHome}
          disabled={localSelectedIds.length === 0}
        >
          <Text style={[
            styles.buttonText,
            localSelectedIds.length === 0 && styles.buttonTextDisabled
          ]}>
            시작하기
          </Text>
      </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: "center",
  },
  progress: {
    flexDirection: "row",
    marginBottom: 50,
    alignSelf: "flex-start",
  },
  progressDot: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.text,
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
    fontSize: FontSizes['2xl'],
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
    color: Colors.text,
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
  footer: {
    padding: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectedCount: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.primary[500],
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