import React, { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Colors, FontSizes } from "../styles/common";

// Primary Button
interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        primaryStyles.button,
        disabled && primaryStyles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          primaryStyles.buttonText,
          disabled && primaryStyles.buttonTextDisabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const primaryStyles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: Colors.textTertiary,
  },
});

// Secondary Button
interface SecondaryButtonProps {
  label?: string;
  leftIcon?: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  label,
  leftIcon,
  onPress,
  disabled,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        secondaryStyles.button,
        disabled && secondaryStyles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={secondaryStyles.contentRow}>
        {leftIcon ? <View style={secondaryStyles.icon}>{leftIcon}</View> : null}
        {label ? (
          <Text
            style={[
              secondaryStyles.buttonText,
              disabled && secondaryStyles.buttonTextDisabled,
            ]}
          >
            {label}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const secondaryStyles = StyleSheet.create({
  button: {
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 6,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: "500",
  },
  buttonTextDisabled: {
    color: Colors.textTertiary,
  },
});

// Outlined Button
interface OutlinedButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const OutlinedButton: React.FC<OutlinedButtonProps> = ({
  label,
  onPress,
  disabled,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        outlinedStyles.button,
        disabled && outlinedStyles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          outlinedStyles.buttonText,
          disabled && outlinedStyles.buttonTextDisabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const outlinedStyles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: Colors.textTertiary,
  },
});

export default { PrimaryButton, SecondaryButton, OutlinedButton };
