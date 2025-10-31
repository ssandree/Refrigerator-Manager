import Slider from "@react-native-community/slider";
import React, { useMemo } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFridgeStore } from "../../../stores/useFridgeStore";
import { Colors } from "../../../styles/common";

interface RecipeFilterModalProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;

  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;

  includeExpiring: boolean;
  onToggleExpiring: () => void;

  selectedCookingTimes: string[];
  onToggleCookingTime: (time: string) => void;

  selectedDifficulties: string[];
  onToggleDifficulty: (difficulty: string) => void;

  calorieRange: [number, number];
  onSetCalorieRange: (range: [number, number]) => void;
}

// 간단한 선택 옵션들 (기존 Recipe.tsx 로직과 호환되는 라벨)
const COOKING_TIME_OPTIONS = ["짧음 (≤30분)", "중간 (31-60분)", "긴 (60분+)"];
const DIFFICULTY_OPTIONS = ["쉬움", "보통", "어려움"];

export default function RecipeFilterModal(props: RecipeFilterModalProps) {
  const {
    visible,
    onClose,
    slideAnim,
    selectedIngredients,
    onToggleIngredient,
    includeExpiring,
    onToggleExpiring,
    selectedCookingTimes,
    onToggleCookingTime,
    selectedDifficulties,
    onToggleDifficulty,
    calorieRange,
    onSetCalorieRange,
  } = props;

  const ingredients = useFridgeStore((s) => s.ingredients);

  // 냉장고 재료에서 이름을 유니크하게 추출 (name 필드 가정)
  const ingredientNames = useMemo(() => {
    const names = ingredients
      .map((i: any) => i.name)
      .filter(Boolean) as string[];
    return Array.from(new Set(names));
  }, [ingredients]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>필터 설정</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentInner}
          >
            {/* 재료 선택 */}
            <Text style={styles.sectionTitle}>재료</Text>
            <View style={styles.chipsRow}>
              {ingredientNames.map((name) => {
                const selected = selectedIngredients.includes(name);
                return (
                  <TouchableOpacity
                    key={name}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => onToggleIngredient(name)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {ingredientNames.length === 0 && (
                <Text style={styles.emptyText}>
                  냉장고에 등록된 재료가 없습니다.
                </Text>
              )}
            </View>

            {/* 임박 재료 포함 */}
            <Text style={styles.sectionTitle}>임박 재료</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.toggle, includeExpiring && styles.toggleOn]}
                onPress={onToggleExpiring}
              >
                <Text
                  style={[
                    styles.toggleText,
                    includeExpiring && styles.toggleTextOn,
                  ]}
                >
                  {includeExpiring ? "포함 중" : "미포함"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 요리 시간 */}
            <Text style={styles.sectionTitle}>요리 시간</Text>
            <View style={styles.chipsRow}>
              {COOKING_TIME_OPTIONS.map((opt) => {
                const selected = selectedCookingTimes.includes(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => onToggleCookingTime(opt)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 난이도 */}
            <Text style={styles.sectionTitle}>난이도</Text>
            <View style={styles.chipsRow}>
              {DIFFICULTY_OPTIONS.map((opt) => {
                const selected = selectedDifficulties.includes(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => onToggleDifficulty(opt)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 열량 범위 (슬라이더) */}
            <Text style={styles.sectionTitle}>열량(kcal)</Text>
            <View style={styles.sliderRow}>
              <Text style={styles.rangeText}>하한: {calorieRange[0]}</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={calorieRange[1]}
                step={10}
                value={calorieRange[0]}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.border}
                thumbTintColor={Colors.primary}
                onValueChange={(v: number) =>
                  onSetCalorieRange([
                    Math.min(Math.round(v), calorieRange[1]),
                    calorieRange[1],
                  ])
                }
              />
            </View>
            <View style={styles.sliderRow}>
              <Text style={styles.rangeText}>상한: {calorieRange[1]}</Text>
              <Slider
                style={styles.slider}
                minimumValue={calorieRange[0]}
                maximumValue={2000}
                step={10}
                value={calorieRange[1]}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.border}
                thumbTintColor={Colors.primary}
                onValueChange={(v: number) =>
                  onSetCalorieRange([
                    calorieRange[0],
                    Math.max(Math.round(v), calorieRange[0]),
                  ])
                }
              />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 12,
  },
  contentInner: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  toggleOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  toggleText: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  toggleTextOn: {
    color: Colors.textLight,
  },
  emptyText: {
    color: Colors.textTertiary,
  },
  rangeBtn: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  rangeBtnText: {
    color: Colors.textLight,
    fontWeight: "600",
  },
  rangeText: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  slider: {
    flex: 1,
  },
});
