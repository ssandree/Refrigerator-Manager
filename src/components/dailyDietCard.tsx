import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DailyDietCardProps {
  recipeName: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  time?: string;
  onPress?: () => void;
}

export default function DailyDietCard({
  recipeName,
  calories,
  protein = 0,
  carbs = 0,
  fat = 0,
  time,
  onPress,
}: DailyDietCardProps) {
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.recipeName} numberOfLines={1}>
          {recipeName}
        </Text>
        {time && (
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.timeText}>{time}</Text>
          </View>
        )}
      </View>

      {/* 칼로리와 영양소 정보 (가로 배치) */}
      <View style={styles.infoRow}>
        {/* 칼로리 정보 */}
        <View style={styles.caloriesContainer}>
          <Ionicons name="flame" size={16} color="#FF6B6B" />
          <Text style={styles.caloriesText}>{calories}</Text>
          <Text style={styles.caloriesUnit}>kcal</Text>
        </View>

        {/* 영양소 누적 그래프 */}
        {(protein > 0 || carbs > 0 || fat > 0) && (
          <View style={styles.nutritionContainer}>
            <View style={styles.nutritionBar}>
              {protein > 0 && (
                <View style={[styles.nutritionSegment, { width: `${(protein / (protein + carbs + fat)) * 100}%`, backgroundColor: "#4CAF50" }]} />
              )}
              {carbs > 0 && (
                <View style={[styles.nutritionSegment, { width: `${(carbs / (protein + carbs + fat)) * 100}%`, backgroundColor: "#FF9800" }]} />
              )}
              {fat > 0 && (
                <View style={[styles.nutritionSegment, { width: `${(fat / (protein + carbs + fat)) * 100}%`, backgroundColor: "#2196F3" }]} />
              )}
            </View>
            <View style={styles.nutritionLabels}>
              {protein > 0 && (
                <View style={styles.nutritionLabelItem}>
                  <View style={[styles.nutritionColorDot, { backgroundColor: "#4CAF50" }]} />
                  <Text style={styles.nutritionLabelText}>단백질</Text>
                </View>
              )}
              {carbs > 0 && (
                <View style={styles.nutritionLabelItem}>
                  <View style={[styles.nutritionColorDot, { backgroundColor: "#FF9800" }]} />
                  <Text style={styles.nutritionLabelText}>탄수화물</Text>
                </View>
              )}
              {fat > 0 && (
                <View style={styles.nutritionLabelItem}>
                  <View style={[styles.nutritionColorDot, { backgroundColor: "#2196F3" }]} />
                  <Text style={styles.nutritionLabelText}>지방</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    minWidth: 80,
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  caloriesUnit: {
    fontSize: 10,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  nutritionContainer: {
    flex: 1,
  },
  nutritionBar: {
    flexDirection: "row",
    height: 8,
    backgroundColor: "#E0E0E0",
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
    gap: 4,
  },
  nutritionColorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nutritionLabelText: {
    fontSize: 10,
    color: "#666",
  },
});
