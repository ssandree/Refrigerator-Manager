import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../../styles/common";

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: object;
}

/**
 * 필터 칩 컴포넌트
 * 선택 가능한 필터 옵션을 표시하는 칩
 */
export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected, style]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: Colors.textLight,
  },
});
