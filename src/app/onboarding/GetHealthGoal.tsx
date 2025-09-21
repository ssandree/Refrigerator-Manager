import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, commonStyles, FontSizes } from "../../styles/common";

const healthGoals = [
  { id: 1, title: "체중 유지", description: "현재 체중을 건강하게 유지", icon: "scale-outline", color: "#4CAF50" },
  { id: 2, title: "체지방 감량", description: "건강한 체지방 감소", icon: "trending-down-outline", color: "#FF9800" },
  { id: 3, title: "단백질 보충", description: "근육 건강을 위한 단백질 섭취", icon: "fitness-outline", color: "#2196F3" },
  { id: 4, title: "심혈관 건강", description: "심장과 혈관 건강 관리", icon: "heart-outline", color: "#F44336" },
  { id: 5, title: "혈당 관리", description: "안정적인 혈당 수치 유지", icon: "pulse-outline", color: "#9C27B0" },
  { id: 6, title: "면역력 강화", description: "체내 면역 시스템 강화", icon: "shield-outline", color: "#00BCD4" },
  { id: 7, title: "체력 유지/향상", description: "전반적인 체력 증진", icon: "flash-outline", color: "#FF5722" },
];

export default function GetHealthGoal() {
  const [selectedGoals, setSelectedGoals] = useState<number[]>([]);

  const toggleGoal = (goalId: number) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else if (prev.length < 3) {
        return [...prev, goalId];
      }
      return prev;
    });
  };

   const handleGoToHome = () => {
    if (selectedGoals.length === 0) {
      alert("최소 1개의 건강 목표를 선택해주세요.");
      return;
    }
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

          <ScrollView style={styles.goalsContainer} showsVerticalScrollIndicator={false}>
        {healthGoals.map((goal) => {
          const isSelected = selectedGoals.includes(goal.id);
          const isDisabled = !isSelected && selectedGoals.length >= 3;
          
          return (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                isSelected && styles.goalCardSelected,
                isDisabled && styles.goalCardDisabled
              ]}
              onPress={() => toggleGoal(goal.id)}
              disabled={isDisabled}
            >
              <View style={styles.goalContent}>
                <View style={[styles.iconContainer, { backgroundColor: goal.color + '20' }]}>
                  <Ionicons 
                    name={goal.icon as any} 
                    size={24} 
                    color={isSelected ? goal.color : '#666'} 
                  />
                </View>
                <View style={styles.goalTextContainer}>
                  <Text style={[
                    styles.goalTitle,
                    isSelected && styles.goalTitleSelected,
                    isDisabled && styles.goalTitleDisabled
                  ]}>
                    {goal.title}
                  </Text>
                  <Text style={[
                    styles.goalDescription,
                    isSelected && styles.goalDescriptionSelected,
                    isDisabled && styles.goalDescriptionDisabled
                  ]}>
                    {goal.description}
                  </Text>
                </View>
                <View style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                  isDisabled && styles.checkboxDisabled
                ]}>
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
          </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.selectedCount}>
          {selectedGoals.length}/3 선택됨
        </Text>
        <TouchableOpacity 
          style={[
            styles.button,
            selectedGoals.length === 0 && styles.buttonDisabled
          ]} 
          onPress={handleGoToHome}
          disabled={selectedGoals.length === 0}
        >
          <Text style={[
            styles.buttonText,
            selectedGoals.length === 0 && styles.buttonTextDisabled
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
    justifyContent: "flex-start",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center",
  },
  progress: {
    flexDirection: "row",
    marginBottom: 20,
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
  goalsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  goalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalCardSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  goalCardDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.background,
  },
  goalContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  goalTitleSelected: {
    color: Colors.primary[500],
  },
  goalTitleDisabled: {
    color: Colors.textTertiary,
  },
  goalDescription: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  goalDescriptionSelected: {
    color: Colors.primary[500],
  },
  goalDescriptionDisabled: {
    color: Colors.textTertiary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  checkboxDisabled: {
    borderColor: Colors.textTertiary,
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