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

      {/* 칼로리 정보 */}
      <View style={styles.caloriesContainer}>
        <Ionicons name="flame" size={20} color="#FF6B6B" />
        <Text style={styles.caloriesText}>{calories} 칼로리</Text>
      </View>

      {/* 영양소 정보 */}
      {(protein > 0 || carbs > 0 || fat > 0) && (
        <View style={styles.nutritionContainer}>
          {protein > 0 && (
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>단백질</Text>
              <Text style={styles.nutritionValue}>{protein}g</Text>
            </View>
          )}
          {carbs > 0 && (
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>탄수화물</Text>
              <Text style={styles.nutritionValue}>{carbs}g</Text>
            </View>
          )}
          {fat > 0 && (
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>지방</Text>
              <Text style={styles.nutritionValue}>{fat}g</Text>
            </View>
          )}
        </View>
      )}

      {/* 하단 액션 */}
      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>섭취 완료</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#999" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
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
    marginBottom: 12,
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
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  nutritionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  nutritionItem: {
    alignItems: "center",
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
});
