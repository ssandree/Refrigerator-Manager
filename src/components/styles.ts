import { StyleSheet } from "react-native";
import {
  Colors,
  FontSizes,
  commonStyles,
  createShadowStyle,
} from "../styles/common";

export { Colors };

const recipeCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

export const componentsStyles = StyleSheet.create({
  // Header 컴포넌트
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.header,
    borderBottomWidth: 1,
    borderBottomColor: Colors.headerBorder,
  },
  headerLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes["2xl"],
    fontWeight: "bold",
    color: Colors.text,
  },
  headerRightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  headerIconBtn: {
    padding: 5,
  },
  headerProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  // FoodCard 컴포넌트
  foodCardContainer: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    ...commonStyles.shadow,
  },
  foodCardImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  foodCardImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.backgroundDark,
  },
  foodCardExpiryBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: Colors.error,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  foodCardExpiryText: {
    color: Colors.surface,
    fontSize: FontSizes.xs,
    fontWeight: "bold",
  },
  foodCardInfoSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  foodCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  foodCardName: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  foodCardActions: {
    flexDirection: "row",
    gap: 4,
  },
  foodCardActionBtn: {
    padding: 4,
  },
  foodCardDetails: {
    marginBottom: 8,
  },
  foodCardQuantity: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  foodCardExpiryDate: {
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
  },
  foodCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodCardCategoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  foodCardCategoryText: {
    fontSize: FontSizes.xs,
    color: Colors.surface,
    fontWeight: "600",
  },
  foodCardStorageInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  foodCardStorageText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  // RecipeCard 컴포넌트
  recipeCardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    ...commonStyles.shadow,
  },
  recipeCardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.border,
  },
  recipeCardContent: {
    padding: 16,
  },
  recipeCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  recipeCardDescription: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  recipeCardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeCardStats: {
    flexDirection: "row",
    gap: 16,
  },
  recipeCardStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recipeCardStatText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  recipeCardLikeButton: {
    padding: 4,
  },

  // DailyDietCard 컴포넌트
  dailyDietCardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  dailyDietCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dailyDietCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
  },
  dailyDietCardTime: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  dailyDietCardItems: {
    marginTop: 8,
  },
  dailyDietCardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  dailyDietCardItemName: {
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  dailyDietCardItemCalories: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  dailyDietCardTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  dailyDietCardTotalLabel: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.text,
  },
  dailyDietCardTotalCalories: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },
});

// RecipeCard Styles
export const recipeCardStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    ...recipeCardShadow,
    overflow: "hidden",
    flexDirection: "row",
    height: 100,
  },
  imageContainer: {
    position: "relative",
    width: 110,
    height: 100, // container 높이와 동일하게 맞춤
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "90%",
    height: "90%",
    borderRadius: 10,
    backgroundColor: Colors.backgroundDark,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    paddingVertical: 6,
  },
  favoriteBtn: {
    padding: 4,
  },
  infoSection: {
    flex: 1,
    padding: 12,
    height: 150, // imageContainer 높이와 동일하게 맞춤
    justifyContent: "flex-start", // space-between 대신 flex-start로 변경
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 4,
    borderRadius: 6,
    paddingRight: 8,
    paddingVertical: 6,
    marginTop: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  statText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  difficultyTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 9,
    color: Colors.textLight,
    fontWeight: "600",
  },
});
