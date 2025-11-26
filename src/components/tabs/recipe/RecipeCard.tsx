import { Flame, Heart, Target, UtensilsCrossed } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useFavoriteRecipeStore } from "../../../stores/useFavoriteRecipeStore";
import { Colors } from "../../../styles/common";
import { Recipe } from "../../../types/recipe";
import { recipeCardStyles } from "../../styles";

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
  const isFavorite = useFavoriteRecipeStore((state) => state.isFavorite);
  const toggleFavorite = useFavoriteRecipeStore(
    (state) => state.toggleFavorite
  );
  const isRecipeFavorite = isFavorite(recipe.id);

  const handleFavoriteToggle = () => {
    toggleFavorite(recipe);
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };
  const getHealthColor = (healthGoal?: number | null) => {
    const normalized = typeof healthGoal === "number" ? healthGoal : 0;
    if (normalized >= 80) return Colors.success;
    if (normalized >= 60) return Colors.warning;
    return Colors.error;
  };

  return (
    <TouchableOpacity style={recipeCardStyles.container} onPress={onPress}>
      {/* 이미지 (왼쪽) */}
      <View style={recipeCardStyles.imageContainer}>
        <Image
          source={require("../../../assets/images/tomato.jpg")}
          style={recipeCardStyles.image}
        />
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
            <Heart
              size={20}
              color={isRecipeFavorite ? Colors.meat : Colors.textTertiary}
              fill={isRecipeFavorite ? Colors.meat : "none"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
        <Text style={recipeCardStyles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        {/* 통계 정보 */}
        <View style={recipeCardStyles.statsContainer}>
          <View style={recipeCardStyles.statItem}>
            <Flame size={14} color={Colors.meat} strokeWidth={2} />
            <Text style={recipeCardStyles.statText}>
              {recipe.calories}칼로리
            </Text>
          </View>
          <View style={recipeCardStyles.statItem}>
            <Target
              size={14}
              color={getHealthColor(recipe.healthGoal)}
              strokeWidth={2}
            />
            <Text style={recipeCardStyles.statText}>{recipe.healthGoal}%</Text>
          </View>
          <View style={recipeCardStyles.statItem}>
            <UtensilsCrossed
              size={14}
              color={Colors.textSecondary}
              strokeWidth={2}
            />
            <Text style={recipeCardStyles.statText}>
              {recipe.ingredientsOwned}/{recipe.totalIngredients} 재료 보유
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
