import { StyleSheet } from "react-native";
import { Colors } from "../styles/colors";
import { ColorObjects, commonStyles, FontSizes } from "../styles/common";

export const indexStyles = StyleSheet.create({
  container: {
    ...commonStyles.centerContainer,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: FontSizes["4xl"],
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: ColorObjects.primary[500],
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: Colors.border,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: FontSizes.xl,
    fontWeight: "600",
  },
});
