import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, FontSizes } from "../../../styles/common";

interface OnboardingTitleProps {
  title: string;
  subtitle?: string;
  limitText?: string;
  center?: boolean;
}

export const OnboardingTitle: React.FC<OnboardingTitleProps> = ({
  title,
  subtitle,
  limitText,
  center = true,
}) => {
  return (
    <View>
      <Text style={[styles.title, center && styles.center]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, center && styles.center]}>
          {subtitle}
        </Text>
      ) : null}
      {limitText ? (
        <Text style={[styles.limitText, center && styles.center]}>
          {limitText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: FontSizes["2xl"],
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    marginBottom: 12,
    color: Colors.textSecondary,
  },
  limitText: {
    fontSize: FontSizes.base,
    color: Colors.textTertiary,
    marginBottom: 24,
  },
  center: {
    textAlign: "center",
  },
});

export default OnboardingTitle;
