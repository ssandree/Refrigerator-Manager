import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Colors, FontSizes } from "../../styles/common";

interface OnboardingProgressProps {
  current: 1 | 2 | 3;
  style?: StyleProp<ViewStyle>;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  current,
  style,
}) => {
  return (
    <View style={[styles.progress, style]}>
      <Text style={current === 1 ? styles.dotActive : styles.dotInactive}>
        ●
      </Text>
      <Text style={current === 2 ? styles.dotActive : styles.dotInactive}>
        ●
      </Text>
      <Text style={current === 3 ? styles.dotActive : styles.dotInactive}>
        ●
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progress: {
    flexDirection: "row",
    marginBottom: 30,
    alignItems: "flex-start",
  },
  dotActive: {
    fontSize: FontSizes.base,
    marginRight: 8,
    color: Colors.textPrimary,
  },
  dotInactive: {
    fontSize: FontSizes.base,
    marginRight: 8,
    color: Colors.textTertiary,
  },
});

export default OnboardingProgress;

