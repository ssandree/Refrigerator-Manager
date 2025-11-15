import { StyleSheet } from "react-native";
import { Colors, FontSizes, commonStyles } from "./common";

export { Colors };

export const screensStyles = StyleSheet.create({
  // 화면 공통
  container: {
    ...commonStyles.container,
  },
  content: {
    flex: 1,
    padding: 16,
  },

  // 냉장고 등록 화면
  fridgeRegisterContainer: {
    ...commonStyles.container,
  },
  formSection: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...commonStyles.shadow,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: FontSizes.base,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    ...commonStyles.input,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.surface,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    ...commonStyles.button,
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    flex: 1,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },

  // 식단 등록 화면
  stomachRegisterContainer: {
    ...commonStyles.container,
  },
  mealCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mealTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
  },
  mealTime: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  mealItems: {
    marginTop: 8,
  },
  mealItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  mealItemName: {
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  mealItemCalories: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  // 레시피 상세 화면
  recipeDetailContainer: {
    ...commonStyles.container,
  },
  recipeImage: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.border,
  },
  recipeContent: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: FontSizes["3xl"],
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  metaItem: {
    alignItems: "center",
  },
  metaValue: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.primary,
  },
  metaLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  ingredientsSection: {
    marginBottom: 20,
  },
  ingredientsTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  ingredientName: {
    fontSize: FontSizes.base,
    color: Colors.text,
    flex: 1,
  },
  ingredientAmount: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  instructionsSection: {
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  instructionStep: {
    flexDirection: "row",
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.primary,
    marginRight: 12,
    minWidth: 24,
  },
  stepText: {
    fontSize: FontSizes.base,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },

  // 좋아요 레시피 화면
  likeRecipeContainer: {
    ...commonStyles.container,
  },
  recipeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  recipeCard: {
    width: "48%",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    ...commonStyles.shadow,
  },
  recipeCardImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: Colors.border,
  },
  recipeCardContent: {
    padding: 12,
  },
  recipeCardTitle: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  recipeCardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeCardTime: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  likeButton: {
    padding: 4,
  },

  // 업적 배지 화면
  badgeContainer: {
    ...commonStyles.container,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  badgeItem: {
    width: "48%",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    ...commonStyles.shadow,
  },
  badgeIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  badgeProgress: {
    marginTop: 8,
    width: "100%",
  },

  // 주간 달성 화면
  weeklyAchieveContainer: {
    ...commonStyles.container,
  },
  weekSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    marginBottom: 16,
  },
  weekButton: {
    padding: 8,
  },
  weekText: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
  },
  achievementCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  achievementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
  },
  achievementStatus: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: "500",
  },
  achievementDescription: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  achievementProgress: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    minWidth: 50,
    textAlign: "right",
  },
});
