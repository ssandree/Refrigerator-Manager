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
import { useFridgeStore } from "../../../stores/useFridgeStore";
import { Colors } from "../../../styles/common";
import { FilterChip } from "./FilterChip";

interface RecipeFilterModalProps {
  visible: boolean;
  onClose: () => void;
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
    slideAnim,
    selectedIngredients,
    onToggleIngredient,
    includeExpiring,
    onToggleExpiring,
    calorieRange,
    onSetCalorieRange,
  } = props;

  const foods = useFridgeStore((s) => s.foods);

  // 냉장고 재료에서 이름을 유니크하게 추출 (name 필드 가정)
  const foodNames = useMemo(() => {
    const names = foods.map((i: any) => i.name).filter(Boolean) as string[];
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
              max={5000}
              step={10}
              values={calorieRange}
              onChange={onSetCalorieRange}
            />
          </ScrollView>
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

  React.useEffect(() => {
    setLeftVal(values[0]);
    setRightVal(values[1]);
  }, [values]);

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));
  const snap = (v: number) => Math.round(v / step) * step;
  const valueToX = (v: number) => {
    if (width <= 0) return 0;
    return ((v - min) / (max - min)) * width;
  };
  const xToValue = (x: number) => {
    if (width <= 0) return min;
    const raw = min + (clamp(x, 0, width) / width) * (max - min);
    return clamp(snap(raw), min, max);
  };

  const leftResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // 터치 시작 시점의 초기 X 위치 저장
        leftStartX.current = valueToX(leftVal);
      },
      onPanResponderMove: (_, g) => {
        if (width <= 0) return;
        // 초기 위치 + 이동 거리로 새로운 위치 계산
        const newX = leftStartX.current + g.dx;
        const newLeft = clamp(xToValue(newX), min, rightVal);
        setLeftVal(newLeft);
        onChange([newLeft, rightVal]);
      },
    })
  ).current;

  const rightResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // 터치 시작 시점의 초기 X 위치 저장
        rightStartX.current = valueToX(rightVal);
      },
      onPanResponderMove: (_, g) => {
        if (width <= 0) return;
        // 초기 위치 + 이동 거리로 새로운 위치 계산
        const newX = rightStartX.current + g.dx;
        const newRight = clamp(xToValue(newX), leftVal, max);
        setRightVal(newRight);
        onChange([leftVal, newRight]);
      },
    })
  ).current;

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
});
