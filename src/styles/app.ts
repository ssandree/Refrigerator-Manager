import { StyleSheet } from "react-native";
import { Colors } from "./colors";
import {
  ColorObjects,
  commonStyles,
  createShadowStyle,
  FontSizes,
} from "./common";

const indexButtonShadow = createShadowStyle({
  color: Colors.border,
  opacity: 0.25,
  radius: 3.84,
  elevation: 5,
});

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
    ...indexButtonShadow,
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: FontSizes.xl,
    fontWeight: "600",
  },
});
