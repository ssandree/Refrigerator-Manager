import { router } from "expo-router";
import { Flame, Target, UtensilsCrossed } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, createShadowStyle } from "../../../styles/common";
import { Recipe } from "../../../types/recipe";

interface HomeRecipeCardProps {
  recipe: Recipe;
  cardWidth: number;
  cardHeight: number;
  marginRight: number;
}

const cardShadow = createShadowStyle({
  opacity: 0.15,
  radius: 8,
  elevation: 8,
});

export default function HomeRecipeCard({
  recipe,
  cardWidth,
  cardHeight,
  marginRight,
}: HomeRecipeCardProps) {
  const handlePress = () => {
    router.push({
      pathname: "/_pages/RecipeDetail",
      params: { id: recipe.id, name: recipe.recipeName },
    });
  };

  const getHealthColor = (healthGoal?: number | null) => {
    const normalized = typeof healthGoal === "number" ? healthGoal : 0;
    if (normalized >= 80) return Colors.success;
    if (normalized >= 60) return Colors.warning;
    return Colors.error;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.recipeCard,
        {
          width: cardWidth,
          height: cardHeight,
          marginRight,
        },
      ]}
      onPress={handlePress}
    >
      {/* 이미지 영역 */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/images/tomato.jpg")}
          style={styles.recipeImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
        {/* 오버레이 위에 레시피 이름 표시 */}
        <View style={styles.titleOverlay}>
          <Text style={styles.overlayTitle} numberOfLines={2}>
            {recipe.recipeName}
          </Text>
        </View>

        {/* 태그들 - 오른쪽 정렬 */}
        <View style={styles.tagsContainer}>
          {/* 재료 태그 */}
          <View style={styles.tag}>
            <UtensilsCrossed
              size={12}
              color={Colors.textSecondary}
              strokeWidth={2}
            />
            <Text style={styles.tagText}>
              {recipe.ingredientsOwned ?? 0}/{recipe.totalIngredients ?? 0} 재료
            </Text>
          </View>

          {/* 칼로리 태그 */}
          <View style={styles.tag}>
            <Flame size={12} color={Colors.meat} strokeWidth={2} />
            <Text style={styles.tagText}>{recipe.calories}칼로리</Text>
          </View>

          {/* 목표 적합도 태그 */}
          {recipe.healthGoal !== null && recipe.healthGoal !== undefined && (
            <View style={styles.tag}>
              <Target
                size={12}
                color={getHealthColor(recipe.healthGoal)}
                strokeWidth={2}
              />
              <Text style={styles.tagText}>{recipe.healthGoal}%</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    ...cardShadow,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  titleOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 12,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.surface,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tagsContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    alignItems: "flex-end",
    gap: 6,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    ...cardShadow,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
});
