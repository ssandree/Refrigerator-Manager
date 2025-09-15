import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const healthGoals = [
  { id: 1, title: "체중 유지", description: "현재 체중을 건강하게 유지", icon: "scale-outline", color: "#4CAF50" },
  { id: 2, title: "체지방 감량", description: "건강한 체지방 감소", icon: "trending-down-outline", color: "#FF9800" },
  { id: 3, title: "단백질 보충", description: "근육 건강을 위한 단백질 섭취", icon: "fitness-outline", color: "#2196F3" },
  { id: 4, title: "심혈관 건강", description: "심장과 혈관 건강 관리", icon: "heart-outline", color: "#F44336" },
  { id: 5, title: "혈당 관리", description: "안정적인 혈당 수치 유지", icon: "pulse-outline", color: "#9C27B0" },
  { id: 6, title: "면역력 강화", description: "체내 면역 시스템 강화", icon: "shield-outline", color: "#00BCD4" },
  { id: 7, title: "체력 유지/향상", description: "전반적인 체력 증진", icon: "flash-outline", color: "#FF5722" },
];

export default function GetGoalInfo() {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>건강 목표 설정</Text>
        <Text style={styles.subtitle}>나에게 맞는 건강 목표를 선택해주세요</Text>
        <Text style={styles.limitText}>최대 3개까지 선택 가능</Text>
      </View>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBE8",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D2D2D",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 24,
  },
  limitText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  goalsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalCardSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "#F8FFF8",
  },
  goalCardDisabled: {
    opacity: 0.5,
    backgroundColor: "#F5F5F5",
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
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  goalTitleSelected: {
    color: "#4CAF50",
  },
  goalTitleDisabled: {
    color: "#999",
  },
  goalDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  goalDescriptionSelected: {
    color: "#4CAF50",
  },
  goalDescriptionDisabled: {
    color: "#999",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkboxDisabled: {
    borderColor: "#CCC",
  },
  footer: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  selectedCount: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: "#E0E0E0",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: "#999",
  },
});
