import { Flame, Heart, UtensilsCrossed } from "lucide-react-native";
import { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFavoriteRecipeStore } from "../../../stores/useFavoriteRecipeStore";
import { useHealthGoalStore } from "../../../stores/useHealthGoalStore";
import { Colors, FontSizes } from "../../../styles/common";
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
  const selectedGoals = useHealthGoalStore((state) => state.selectedGoals);

  const handleFavoriteToggle = () => {
    toggleFavorite(recipe);
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  // 사용자가 선택한 건강 목표와 일치하는 matchedGoals만 필터링 (최대 3개)
  const matchedGoalTags = useMemo(() => {
    if (!recipe.matchedGoals || !selectedGoals.length) return [];

    const selectedGoalIds = new Set(selectedGoals.map((g) => g.id));
    return recipe.matchedGoals
      .filter((mg) => selectedGoalIds.has(mg.id))
      .slice(0, 3)
      .map((mg) => {
        const goal = selectedGoals.find((g) => g.id === mg.id);
        return {
          id: mg.id,
          title: goal?.title || mg.title,
        };
      });
  }, [recipe.matchedGoals, selectedGoals]);

  return (
    <TouchableOpacity style={recipeCardStyles.container} onPress={onPress}>
      {/* 이미지 (왼쪽) */}
      <View style={recipeCardStyles.imageContainer}>
        <Image
          source={
            recipe.imageUrl
              ? { uri: recipe.imageUrl }
              : require("../../../assets/images/tomato.jpg")
          }
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
        {/* 통계 정보 */}
        <View style={recipeCardStyles.statsContainer}>
          <View style={recipeCardStyles.statItem}>
            <Flame size={14} color={Colors.meat} strokeWidth={2} />
            <Text style={recipeCardStyles.statText}>
              {recipe.calories}칼로리
            </Text>
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
        {/* 건강 목표 태그 */}
        {matchedGoalTags.length > 0 && (
          <View style={styles.goalTagsContainer}>
            {matchedGoalTags.map((tag) => (
              <View key={tag.id} style={styles.goalTag}>
                <Text style={styles.goalTagText}>{tag.title}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  goalTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  goalTag: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  goalTagText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: "600",
  },
});
