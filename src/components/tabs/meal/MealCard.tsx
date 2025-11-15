import { Clock, Flame, Trash2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Colors, FontSizes, commonStyles } from "../../../styles/common";

interface DailyDietCardProps {
  recipeName: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time?: string;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function DailyDietCard({
  recipeName,
  calories,
  protein = 0,
  carbs = 0,
  fat = 0,
  time,
  onPress,
  onDelete,
}: DailyDietCardProps) {
  const renderRightActions = () => {
    if (!onDelete) return null;
    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Trash2 size={20} color={Colors.surface} strokeWidth={2} />
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={[commonStyles.card, styles.container]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.recipeName} numberOfLines={1}>
            {recipeName}
          </Text>
          {time && (
            <View style={styles.timeContainer}>
              <Clock size={14} color={Colors.textSecondary} strokeWidth={2} />
              <Text style={styles.timeText}>{time}</Text>
            </View>
          )}
        </View>

        {/* 칼로리와 영양소 정보 (가로 배치) */}
        <View style={styles.infoRow}>
          {/* 칼로리 정보 */}
          <View style={styles.caloriesContainer}>
            <Flame size={16} color={Colors.meat} strokeWidth={2} />
            <Text style={styles.caloriesText}>{calories}</Text>
            <Text style={styles.caloriesUnit}>kcal</Text>
          </View>

          {/* 영양소 누적 그래프 */}
          {(protein > 0 || carbs > 0 || fat > 0) && (
            <View style={styles.nutritionContainer}>
              <View style={styles.nutritionBar}>
                {protein > 0 && (
                  <View
                    style={[
                      styles.nutritionSegment,
                      {
                        width: `${(protein / (protein + carbs + fat)) * 100}%`,
                        backgroundColor: Colors.primary,
                      },
                    ]}
                  />
                )}
                {carbs > 0 && (
                  <View
                    style={[
                      styles.nutritionSegment,
                      {
                        width: `${(carbs / (protein + carbs + fat)) * 100}%`,
                        backgroundColor: Colors.warning,
                      },
                    ]}
                  />
                )}
                {fat > 0 && (
                  <View
                    style={[
                      styles.nutritionSegment,
                      {
                        width: `${(fat / (protein + carbs + fat)) * 100}%`,
                        backgroundColor: Colors.secondary,
                      },
                    ]}
                  />
                )}
              </View>
              <View style={styles.nutritionLabels}>
                {protein > 0 && (
                  <View style={styles.nutritionLabelItem}>
                    <View
                      style={[
                        styles.nutritionColorDot,
                        { backgroundColor: Colors.primary },
                      ]}
                    />
                    <Text style={styles.nutritionLabelText}>단백질</Text>
                  </View>
                )}
                {carbs > 0 && (
                  <View style={styles.nutritionLabelItem}>
                    <View
                      style={[
                        styles.nutritionColorDot,
                        { backgroundColor: Colors.warning },
                      ]}
                    />
                    <Text style={styles.nutritionLabelText}>탄수화물</Text>
                  </View>
                )}
                {fat > 0 && (
                  <View style={styles.nutritionLabelItem}>
                    <View
                      style={[
                        styles.nutritionColorDot,
                        { backgroundColor: Colors.secondary },
                      ]}
                    />
                    <Text style={styles.nutritionLabelText}>지방</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recipeName: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: "row",
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: Colors.meat + "10",
    borderRadius: 8,
    minWidth: 80,
  },
  caloriesText: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.meat,
  },
  caloriesUnit: {
    fontSize: FontSizes.xs,
    color: Colors.meat,
    fontWeight: "500",
  },
  nutritionContainer: {
    flex: 1,
  },
  nutritionBar: {
    flexDirection: "row",
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginBottom: 6,
    overflow: "hidden",
  },
  nutritionSegment: {
    height: "100%",
  },
  nutritionLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nutritionLabelItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutritionColorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nutritionLabelText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  rightActionContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 4,
    marginRight: 16,
  },
  deleteButton: {
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    color: Colors.surface,
    fontSize: FontSizes.sm,
    fontWeight: "600",
    marginTop: 4,
  },
});
