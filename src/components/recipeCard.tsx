import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useFavoriteRecipes } from "../contexts/FavoriteRecipeContext";
import { Recipe } from "../data/mockRecipes";
import { recipeCardStyles } from "./styles";

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
  const { isFavorite, toggleFavorite } = useFavoriteRecipes();
  const isRecipeFavorite = isFavorite(recipe.id);

  const handleFavoriteToggle = () => {
    toggleFavorite(recipe);
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };
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
    <TouchableOpacity style={recipeCardStyles.container} onPress={onPress}>
      {/* 이미지 (왼쪽) */}
      <View style={recipeCardStyles.imageContainer}>
        <Image source={require("../assets/images/tomato.jpg")} style={recipeCardStyles.image} />
      </View>

      {/* 정보 섹션 (오른쪽) */}
      <View style={recipeCardStyles.infoSection}>
        <View style={recipeCardStyles.titleRow}>
          <Text style={recipeCardStyles.recipeName} numberOfLines={1}>
            {recipe.recipeName}
          </Text>
          <TouchableOpacity
            style={recipeCardStyles.favoriteBtn}
            onPress={handleFavoriteToggle}
          >
            <Ionicons
              name={isRecipeFavorite ? "heart" : "heart-outline"}
              size={18}
              color={isRecipeFavorite ? "#FF6B6B" : "#999"}
            />
          </TouchableOpacity>
        </View>
        <Text style={recipeCardStyles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

 

        {/* 통계 정보 */}
        <View style={recipeCardStyles.statsContainer}>
          <View style={recipeCardStyles.statItem}>
            <Ionicons name="flame-outline" size={12} color="#FF6B6B" />
            <Text style={recipeCardStyles.statText}>{recipe.calories}칼로리</Text>
          </View>
          <View style={recipeCardStyles.statItem}>
            <Ionicons name="time-outline" size={12} color="#4CAF50" />
            <Text style={recipeCardStyles.statText}>{recipe.time}분</Text>
          </View>
          <View style={recipeCardStyles.statItem}>
            <Ionicons name="fitness-outline" size={12} color={getHealthColor(recipe.healthGoal)} />
            <Text style={recipeCardStyles.statText}>{recipe.healthGoal}%</Text>
          </View>
        </View>

        {/* 하단 정보 */}
        <View style={recipeCardStyles.footer}>
          <View style={recipeCardStyles.ingredientInfo}>
            <Ionicons name="restaurant-outline" size={12} color="#666" />
            <Text style={recipeCardStyles.ingredientText}>
              {recipe.ingredientsOwned}/{recipe.totalIngredients} 재료 보유
            </Text>
          </View>
          <View style={[recipeCardStyles.difficultyTag, { backgroundColor: getDifficultyColor(recipe.difficulty) }]}>
            <Text style={recipeCardStyles.difficultyText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

