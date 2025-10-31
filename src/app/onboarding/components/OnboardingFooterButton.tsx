import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, FontSizes } from "../../../styles/common";

interface OnboardingFooterButtonProps {
  label: string; // 다음 버튼 레이블
  onPress: () => void; // 다음 버튼 액션
  disabled?: boolean; // 다음 버튼 비활성화 여부
  prevLabel?: string; // 이전 버튼 레이블 (기본: '이전')
  onPressPrev?: () => void; // 이전 버튼 액션
  prevDisabled?: boolean; // 이전 버튼 비활성화 여부
}

export const OnboardingFooterButton: React.FC<OnboardingFooterButtonProps> = ({
  label,
  onPress,
  disabled,
  prevLabel = "이전",
  onPressPrev,
  prevDisabled,
}) => {
  return (
    <View style={styles.footer}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.secondaryButton,
            prevDisabled && styles.secondaryButtonDisabled,
          ]}
          onPress={onPressPrev}
          disabled={prevDisabled}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              prevDisabled && styles.secondaryButtonTextDisabled,
            ]}
          >
            {prevLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={onPress}
          disabled={disabled}
        >
          <Text
            style={[styles.buttonText, disabled && styles.buttonTextDisabled]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.surface,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonDisabled: {
    opacity: 0.6,
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
  secondaryButtonTextDisabled: {
    color: Colors.textTertiary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSizes.xl,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: Colors.textTertiary,
  },
});

export default OnboardingFooterButton;
