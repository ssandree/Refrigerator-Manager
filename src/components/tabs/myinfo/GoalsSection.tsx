import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { mockHealthGoals } from "../../../data/mockHealthGoals";
import { useHealthGoalStore } from "../../../stores/useHealthGoalStore";
import { Colors, createShadowStyle } from "../../../styles/common";
import { tabsStyles } from "../../../styles/tabs";

const goalCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

interface GoalsSectionProps {
  onEditGoals: () => void;
}

export default function GoalsSection({ onEditGoals }: GoalsSectionProps) {
  const selectedGoals = useHealthGoalStore((state) => state.selectedGoals);

  return (
    <View style={tabsStyles.section}>
      <View style={styles.sectionHeader}>
        <Text style={tabsStyles.sectionTitle}>🎯 건강 목표</Text>
        <TouchableOpacity style={styles.editButton} onPress={onEditGoals}>
          <Text style={styles.editButtonText}>목표 수정</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.goalCard}>
        {selectedGoals.length > 0 ? (
          selectedGoals.map((goal, index) => (
            <View
              key={goal.id}
              style={[
                styles.goalItem,
                index === selectedGoals.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={styles.goalItemContent}>
                {(() => {
                  const fallback = mockHealthGoals.find(
                    (mockGoal) => mockGoal.id === goal.id
                  );
                  const iconName = (goal.icon ||
                    fallback?.icon ||
                    "sparkles-outline") as keyof typeof Ionicons.glyphMap;
                  const iconColor =
                    goal.color || fallback?.color || Colors.primary;
                  return (
                    <View
                      style={[
                        styles.goalIconContainer,
                        { backgroundColor: iconColor + "20" },
                      ]}
                    >
                      <Ionicons name={iconName} size={24} color={iconColor} />
                    </View>
                  );
                })()}
                <View style={styles.goalTextContent}>
                  <Text style={styles.goalLabel}>{goal.title}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyGoalsContainer}>
            <Text style={styles.emptyGoalsText}>
              선택된 건강 목표가 없습니다
            </Text>
            <Text style={styles.emptyGoalsSubtext}>
              온보딩에서 건강 목표를 설정해보세요
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 12,
  },
  goalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    ...goalCardShadow,
  },
  goalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  goalItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  goalTextContent: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  goalDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  emptyGoalsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyGoalsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  emptyGoalsSubtext: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editButtonText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
});
