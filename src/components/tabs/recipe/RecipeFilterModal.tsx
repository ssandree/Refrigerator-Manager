import React, { useMemo } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFridgeStore } from "../../../stores/useFoodStore";
import { Colors } from "../../../styles/common";
import { FilterChip } from "./FilterChip";

interface RecipeFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void; // 필터 적용 버튼 클릭 시 호출
  slideAnim: Animated.Value;

  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;

  includeExpiring: boolean;
  onToggleExpiring: () => void;

  calorieRange: [number, number];
  onSetCalorieRange: (range: [number, number]) => void;
}

export default function RecipeFilterModal(props: RecipeFilterModalProps) {
  const {
    visible,
    onClose,
    onApply,
    slideAnim,
    selectedIngredients,
    onToggleIngredient,
    includeExpiring,
    onToggleExpiring,
    calorieRange,
    onSetCalorieRange,
  } = props;

  const foods = useFridgeStore((s) => s.foods);

  // 냉장고 재료에서 이름을 유니크하게 추출
  const foodNames = useMemo(() => {
    const names = foods.map((food) => food.name).filter(Boolean) as string[];
    return Array.from(new Set(names));
  }, [foods]);

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
            showsVerticalScrollIndicator={false}
          >
            {/* 재료 선택 */}
            <Text style={styles.sectionTitle}>재료</Text>
            <View style={styles.chipsRow}>
              {foodNames.map((name) => (
                <FilterChip
                  key={name}
                  label={name}
                  selected={selectedIngredients.includes(name)}
                  onPress={() => onToggleIngredient(name)}
                />
              ))}
              {foodNames.length === 0 && (
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

            {/* 열량 범위 (듀얼 슬라이더) */}
            <Text style={styles.sectionTitle}>열량(kcal)</Text>
            <DualRangeSlider
              min={0}
              max={15000}
              step={10}
              values={calorieRange}
              onChange={onSetCalorieRange}
            />
          </ScrollView>

          {/* 적용 버튼 */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                onApply();
                onClose();
              }}
            >
              <Text style={styles.applyButtonText}>적용</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  values: [number, number];
  onChange: (range: [number, number]) => void;
}

function DualRangeSlider({
  min,
  max,
  step = 1,
  values,
  onChange,
}: DualRangeSliderProps) {
  const [width, setWidth] = React.useState(0);
  const [leftVal, setLeftVal] = React.useState(values[0]);
  const [rightVal, setRightVal] = React.useState(values[1]);

  // 터치 시작 시점의 초기 위치를 저장
  const leftStartX = React.useRef(0);
  const rightStartX = React.useRef(0);
  // 현재 드래그 중인 썸(thumb) 추적: 'left' | 'right' | null
  const draggingThumb = React.useRef<"left" | "right" | null>(null);
  // 최신 값을 ref로 추적 (onPanResponderRelease에서 사용)
  const latestLeftVal = React.useRef(leftVal);
  const latestRightVal = React.useRef(rightVal);

  React.useEffect(() => {
    setLeftVal(values[0]);
    setRightVal(values[1]);
    latestLeftVal.current = values[0];
    latestRightVal.current = values[1];
  }, [values]);

  const clampValue = React.useCallback(
    (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v)),
    []
  );

  const snapToStep = React.useCallback(
    (v: number) => Math.round(v / step) * step,
    [step]
  );

  const valueToX = React.useCallback(
    (v: number) => {
      if (width <= 0) return 0;
      return ((v - min) / (max - min || 1)) * width;
    },
    [min, max, width]
  );

  const xToValue = React.useCallback(
    (x: number) => {
      if (width <= 0) return min;
      const clampedX = clampValue(x, 0, width);
      const raw = min + (clampedX / width) * (max - min);
      const snapped = snapToStep(raw);
      return clampValue(snapped, min, max);
    },
    [clampValue, snapToStep, width, min, max]
  );

  const leftResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderGrant: () => {
          draggingThumb.current = "left";
          leftStartX.current = valueToX(latestLeftVal.current);
        },
        onPanResponderMove: (_, gesture) => {
          if (width <= 0) return;
          const newX = leftStartX.current + gesture.dx;
          const newLeft = clampValue(
            xToValue(newX),
            min,
            latestRightVal.current
          );
          // UI만 즉시 업데이트 (API 호출 없음)
          setLeftVal(newLeft);
          latestLeftVal.current = newLeft;
        },
        onPanResponderRelease: () => {
          // 터치를 놓았을 때만 onChange 호출 (API 호출)
          if (draggingThumb.current === "left") {
            onChange([latestLeftVal.current, latestRightVal.current]);
            draggingThumb.current = null;
          }
        },
        onPanResponderTerminate: () => {
          // 터치가 중단되었을 때도 onChange 호출
          if (draggingThumb.current === "left") {
            onChange([latestLeftVal.current, latestRightVal.current]);
            draggingThumb.current = null;
          }
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [clampValue, valueToX, xToValue, min, width, onChange]
  );

  const rightResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderGrant: () => {
          draggingThumb.current = "right";
          rightStartX.current = valueToX(latestRightVal.current);
        },
        onPanResponderMove: (_, gesture) => {
          if (width <= 0) return;
          const newX = rightStartX.current + gesture.dx;
          const newRight = clampValue(
            xToValue(newX),
            latestLeftVal.current,
            max
          );
          // UI만 즉시 업데이트 (API 호출 없음)
          setRightVal(newRight);
          latestRightVal.current = newRight;
        },
        onPanResponderRelease: () => {
          // 터치를 놓았을 때만 onChange 호출 (API 호출)
          if (draggingThumb.current === "right") {
            onChange([latestLeftVal.current, latestRightVal.current]);
            draggingThumb.current = null;
          }
        },
        onPanResponderTerminate: () => {
          // 터치가 중단되었을 때도 onChange 호출
          if (draggingThumb.current === "right") {
            onChange([latestLeftVal.current, latestRightVal.current]);
            draggingThumb.current = null;
          }
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [clampValue, valueToX, xToValue, max, width, onChange]
  );

  const leftX = valueToX(leftVal);
  const rightX = valueToX(rightVal);
  const fillLeft = Math.min(leftX, rightX);
  const fillRight = Math.max(leftX, rightX);

  return (
    <View style={styles.rangeContainer}>
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeText}>하한: {leftVal}</Text>
        <Text style={styles.rangeText}>상한: {rightVal}</Text>
      </View>
      <View
        style={styles.rangeTrack}
        onLayout={(e: any) => setWidth(e.nativeEvent.layout.width)}
      >
        <View
          style={[
            styles.rangeFill,
            { left: fillLeft, width: fillRight - fillLeft },
          ]}
        />
        <View
          {...leftResponder.panHandlers}
          style={[styles.thumb, { left: Math.max(0, leftX - 10) }]}
        />
        <View
          {...rightResponder.panHandlers}
          style={[styles.thumb, { left: Math.max(0, rightX - 10) }]}
        />
      </View>
    </View>
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
    paddingTop: 16,
    paddingBottom: 16,
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  rangeContainer: {
    marginTop: 6,
    paddingHorizontal: 4,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rangeTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    position: "relative",
  },
  rangeFill: {
    position: "absolute",
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  thumb: {
    position: "absolute",
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
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
  rangeText: {
    color: Colors.textPrimary,
    fontWeight: "600",
    marginRight: 12,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
});
