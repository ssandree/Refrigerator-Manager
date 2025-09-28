import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, FontSizes } from "../styles/common";

export interface HealthGoal {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface HealthGoalSelectorProps {
  selectedGoalIds: number[];
  onGoalToggle: (goalId: number) => void;
  maxSelection?: number;
}

export const healthGoals: HealthGoal[] = [
  { id: 1, title: "체중 유지", description: "현재 체중을 건강하게 유지", icon: "scale-outline", color: "#4CAF50" },
  { id: 2, title: "체지방 감량", description: "건강한 체지방 감소", icon: "trending-down-outline", color: "#FF9800" },
  { id: 3, title: "단백질 보충", description: "근육 건강을 위한 단백질 섭취", icon: "fitness-outline", color: "#2196F3" },
  { id: 4, title: "체중 증량", description: "체중을 늘리기", icon: "heart-outline", color: "#F44336" },
  { id: 5, title: "혈당 관리", description: "안정적인 혈당 수치 유지", icon: "pulse-outline", color: "#9C27B0" },
  { id: 6, title: "면역력 강화", description: "체내 면역 시스템 강화", icon: "shield-outline", color: "#00BCD4" },
  { id: 7, title: "체력 유지/향상", description: "전반적인 체력 증진", icon: "flash-outline", color: "#FF5722" },
];

export const HealthGoalSelector: React.FC<HealthGoalSelectorProps> = ({
  selectedGoalIds,
  onGoalToggle,
  maxSelection = 3,
}) => {
  return (
    <ScrollView style={styles.goalsContainer} showsVerticalScrollIndicator={false}>
      {healthGoals.map((goal) => {
        const isSelected = selectedGoalIds.includes(goal.id);
        const isDisabled = !isSelected && selectedGoalIds.length >= maxSelection;
        
        return (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              isSelected && styles.goalCardSelected,
              isDisabled && styles.goalCardDisabled
            ]}
            onPress={() => onGoalToggle(goal.id)}
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
  );
};

const styles = StyleSheet.create({
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
});
