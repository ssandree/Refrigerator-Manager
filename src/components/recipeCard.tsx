import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Recipe } from "../data/mockRecipes";

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  onFavoriteToggle?: () => void;
}

export default function RecipeCard({
  recipe,
  onPress,
  onFavoriteToggle,
}: RecipeCardProps) {
  const getHealthColor = (healthGoal: number) => {
    if (healthGoal >= 80) return "#4CAF50";
    if (healthGoal >= 60) return "#FF9800";
    return "#F44336";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움": return "#4CAF50";
      case "보통": return "#FF9800";
      case "어려움": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* 이미지 */}
      <View style={styles.imageContainer}>
        <Image source={require("../assets/images/tomato.jpg")} style={styles.image} />
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={onFavoriteToggle}
        >
          <Ionicons
            name={recipe.isFavorite ? "heart" : "heart-outline"}
            size={20}
            color={recipe.isFavorite ? "#FF6B6B" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>

      {/* 정보 섹션 */}
      <View style={styles.infoSection}>
        <Text style={styles.recipeName} numberOfLines={1}>
          {recipe.recipeName}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        {/* 태그 */}
        <View style={styles.tagsContainer}>
          {recipe.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* 통계 정보 */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={14} color="#FF6B6B" />
            <Text style={styles.statText}>{recipe.calories}칼로리</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={14} color="#4CAF50" />
            <Text style={styles.statText}>{recipe.time}분</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="fitness-outline" size={14} color={getHealthColor(recipe.healthGoal)} />
            <Text style={styles.statText}>{recipe.healthGoal}%</Text>
          </View>
        </View>

        {/* 하단 정보 */}
        <View style={styles.footer}>
          <View style={styles.ingredientInfo}>
            <Ionicons name="restaurant-outline" size={14} color="#666" />
            <Text style={styles.ingredientText}>
              {recipe.ingredientsOwned}/{recipe.totalIngredients} 재료 보유
            </Text>
          </View>
          <View style={[styles.difficultyTag, { backgroundColor: getDifficultyColor(recipe.difficulty) }]}>
            <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
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
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 15,
    padding: 6,
  },
  infoSection: {
    padding: 12,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ingredientInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  ingredientText: {
    fontSize: 12,
    color: "#666",
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
