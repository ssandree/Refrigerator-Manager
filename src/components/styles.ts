import { StyleSheet } from 'react-native';
import { Colors, FontSizes, commonStyles } from '../styles/common';

export { Colors };

export const componentsStyles = StyleSheet.create({
  // Header 컴포넌트
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.header,
    borderBottomWidth: 1,
    borderBottomColor: Colors.headerBorder,
  },
  headerTitle: {
    fontSize: FontSizes['2xl'],
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    ...commonStyles.shadow,
  },
  foodCardImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  foodCardImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  foodCardExpiryBadge: {
    position: 'absolute',
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
    fontWeight: 'bold',
  },
  foodCardInfoSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  foodCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  foodCardName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  foodCardActions: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodCardCategoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  foodCardCategoryText: {
    fontSize: FontSizes.xs,
    color: Colors.surface,
    fontWeight: '600',
  },
  foodCardStorageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: '100%',
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
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeCardStats: {
    flexDirection: 'row',
    gap: 16,
  },
  recipeCardStat: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dailyDietCardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  dailyDietCardTotalLabel: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.text,
  },
  dailyDietCardTotalCalories: {
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
});

// RecipeCard Styles
export const recipeCardStyles = StyleSheet.create({
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
    flexDirection: "row",
    height: 150,
  },
  imageContainer: {
    position: "relative",
    width: 110,
    height: 110,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  favoriteBtn: {
    padding: 4,
  },
  infoSection: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
    lineHeight: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    color: "#1976D2",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingVertical: 4,
    backgroundColor: "#F8F9FA",
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  statText: {
    fontSize: 10,
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
    gap: 2,
    flex: 1,
  },
  ingredientText: {
    fontSize: 10,
    color: "#666",
  },
  difficultyTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
