import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HealthGoal } from "../../../src/stores/useHealthGoalStore";
import {
  Colors,
  createShadowStyle,
  FontSizes,
} from "../../../src/styles/common";

const goalCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 4,
  elevation: 3,
});

interface HealthGoalSelectorProps {
  healthGoals: HealthGoal[];
  selectedGoalIds: number[];
  onGoalToggle: (goalId: number) => void;
  maxSelection?: number;
}

export const HealthGoalSelector: React.FC<HealthGoalSelectorProps> = ({
  healthGoals,
  selectedGoalIds,
  onGoalToggle,
  maxSelection = 3,
}) => {
  return (
    <ScrollView
      style={styles.goalsContainer}
      showsVerticalScrollIndicator={false}
    >
      {healthGoals.map((goal) => {
        const isSelected = selectedGoalIds.includes(goal.id);
        const isDisabled =
          !isSelected && selectedGoalIds.length >= maxSelection;

        return (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalCard,
              isSelected && styles.goalCardSelected,
              isDisabled && styles.goalCardDisabled,
            ]}
            onPress={() => onGoalToggle(goal.id)}
            disabled={isDisabled}
          >
            <View style={styles.goalContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: goal.color + "20" },
                ]}
              >
                <Ionicons
                  name={goal.icon as any}
                  size={24}
                  color={isSelected ? goal.color : "#666"}
                />
              </View>
              <View style={styles.goalTextContainer}>
                <Text
                  style={[
                    styles.goalTitle,
                    isSelected && styles.goalTitleSelected,
                    isDisabled && styles.goalTitleDisabled,
                  ]}
                >
                  {goal.title}
                </Text>
                <Text
                  style={[
                    styles.goalDescription,
                    isSelected && styles.goalDescriptionSelected,
                    isDisabled && styles.goalDescriptionDisabled,
                  ]}
                >
                  {goal.description}
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                  isDisabled && styles.checkboxDisabled,
                ]}
              >
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
    ...goalCardShadow,
  },
  goalCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
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
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  goalTitleSelected: {
    color: Colors.primary,
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
    color: Colors.primary,
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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxDisabled: {
    borderColor: Colors.textTertiary,
  },
});

export default HealthGoalSelector;
