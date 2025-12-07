import { StyleSheet } from "react-native";
import { Colors, createShadowStyle } from "../styles/common";

export { Colors };

const recipeCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
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
    height: 120,
  },
  imageContainer: {
    position: "relative",
    paddingLeft: 6,
    width: 110,
    height: 120, // container 높이와 동일하게 맞춤
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "90%",
    height: "75%",
    borderRadius: 10,
    backgroundColor: Colors.backgroundLight,
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
    height: 100, // imageContainer 높이와 동일하게 맞춤
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
    alignItems: "center",
    gap: 8,
    borderRadius: 6,
    paddingRight: 8,
    paddingBottom: 5,
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
});
