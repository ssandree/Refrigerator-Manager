import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface RecipeResearchProps {
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

const availableIngredients = ["토마토", "양파", "당근", "감자", "고기", "생선", "치즈", "계란", "우유", "버터"];
const cookingTimes = ["짧음 (30분 이하)", "중간 (30분-1시간)", "긴 (1시간 이상)"];
const difficulties = ["쉬움", "보통", "어려움"];

export default function RecipeResearch({
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
}: RecipeResearchProps) {
  const [localCalorieRange, setLocalCalorieRange] = useState<[number, number]>(calorieRange);
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);
  const screenWidth = Dimensions.get('window').width - 40; // 패딩 제외
  const sliderWidth = screenWidth - 40; // 좌우 여백 제외

  const updateCalorieRange = (newRange: [number, number]) => {
    setLocalCalorieRange(newRange);
    onSetCalorieRange(newRange);
  };

  // calorieRange prop이 변경될 때 localCalorieRange 업데이트
  useEffect(() => {
    setLocalCalorieRange(calorieRange);
  }, [calorieRange]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const x = evt.nativeEvent.locationX;
      const minPosition = (localCalorieRange[0] / 1000) * sliderWidth;
      const maxPosition = (localCalorieRange[1] / 1000) * sliderWidth;
      
      // 어느 썸에 더 가까운지 판단
      const distanceToMin = Math.abs(x - minPosition);
      const distanceToMax = Math.abs(x - maxPosition);
      
      if (distanceToMin < distanceToMax) {
        setActiveThumb('min');
      } else {
        setActiveThumb('max');
      }
    },
    onPanResponderMove: (evt) => {
      if (!activeThumb) return;
      
      const x = evt.nativeEvent.locationX;
      const newValue = Math.max(0, Math.min(1000, (x / sliderWidth) * 1000));
      
      if (activeThumb === 'min') {
        const newMax = Math.max(newValue + 50, localCalorieRange[1]);
        updateCalorieRange([Math.round(newValue / 10) * 10, newMax]);
      } else {
        const newMin = Math.min(newValue - 50, localCalorieRange[0]);
        updateCalorieRange([newMin, Math.round(newValue / 10) * 10]);
      }
    },
    onPanResponderRelease: () => {
      setActiveThumb(null);
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>상세 검색 기준 설정</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* 재료 선택 */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>
                  재료 선택 {selectedIngredients.length > 0 && `(${selectedIngredients.length}개)`}
                </Text>
                <View style={styles.ingredientsGrid}>
                  {availableIngredients.map((ingredient) => (
                    <TouchableOpacity
                      key={ingredient}
                      style={[
                        styles.ingredientButton,
                        selectedIngredients.includes(ingredient) 
                          ? styles.ingredientButtonSelected 
                          : styles.ingredientButtonUnselected
                      ]}
                      onPress={() => onToggleIngredient(ingredient)}
                    >
                      <Text style={[
                        styles.ingredientButtonText,
                        selectedIngredients.includes(ingredient) 
                          ? styles.ingredientButtonTextSelected 
                          : styles.ingredientButtonTextUnselected
                      ]}>
                        {ingredient}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 마감기한 임박 재료 포함 여부 */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>
                  마감기한 임박 재료 {includeExpiring && "✓"}
                </Text>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={onToggleExpiring}
                >
                  <View style={[
                    styles.checkbox,
                    includeExpiring ? styles.checkboxChecked : styles.checkboxUnchecked
                  ]}>
                    {includeExpiring && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>마감기한이 임박한 재료를 포함한 레시피만 보기</Text>
                </TouchableOpacity>
              </View>

              {/* 요리 시간 */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>
                  요리 시간 {selectedCookingTimes.length > 0 && `(${selectedCookingTimes.length}개)`}
                </Text>
                <View style={styles.optionsContainer}>
                  {cookingTimes.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.optionButton,
                        selectedCookingTimes.includes(time) ? styles.optionButtonSelected : styles.optionButtonUnselected
                      ]}
                      onPress={() => onToggleCookingTime(time)}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        selectedCookingTimes.includes(time) ? styles.optionButtonTextSelected : styles.optionButtonTextUnselected
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 난이도 */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>
                  난이도 {selectedDifficulties.length > 0 && `(${selectedDifficulties.length}개)`}
                </Text>
                <View style={styles.optionsContainer}>
                  {difficulties.map((diff) => (
                    <TouchableOpacity
                      key={diff}
                      style={[
                        styles.optionButton,
                        selectedDifficulties.includes(diff) ? styles.optionButtonSelected : styles.optionButtonUnselected
                      ]}
                      onPress={() => onToggleDifficulty(diff)}
                    >
                      <Text style={[
                        styles.optionButtonText,
                        selectedDifficulties.includes(diff) ? styles.optionButtonTextSelected : styles.optionButtonTextUnselected
                      ]}>
                        {diff}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 열량 범위 */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>열량 범위 (kcal)</Text>
                <View style={styles.calorieRangeContainer}>
                  <Text style={styles.calorieRangeText}>
                    {localCalorieRange[0]} - {localCalorieRange[1]} kcal
                  </Text>
                  
                  {/* 듀얼 슬라이더 */}
                  <View style={styles.dualSliderContainer}>
                    <View style={styles.sliderTrack} {...panResponder.panHandlers}>
                      {/* 선택된 범위 표시 */}
                      <View 
                        style={[
                          styles.sliderRange,
                          {
                            left: `${(localCalorieRange[0] / 1000) * 100}%`,
                            width: `${((localCalorieRange[1] - localCalorieRange[0]) / 1000) * 100}%`
                          }
                        ]}
                      />
                      
                      {/* 최소값 썸 */}
                      <View
                        style={[
                          styles.sliderThumb,
                          styles.sliderThumbMin,
                          {
                            left: `${(localCalorieRange[0] / 1000) * 100}%`,
                            backgroundColor: activeThumb === 'min' ? '#1976D2' : '#4CAF50'
                          }
                        ]}
                      />
                      
                      {/* 최대값 썸 */}
                      <View
                        style={[
                          styles.sliderThumb,
                          styles.sliderThumbMax,
                          {
                            left: `${(localCalorieRange[1] / 1000) * 100}%`,
                            backgroundColor: activeThumb === 'max' ? '#1976D2' : '#4CAF50'
                          }
                        ]}
                      />
                    </View>
                    
                    {/* 범위 라벨 */}
                    <View style={styles.sliderLabels}>
                      <Text style={styles.sliderLabel}>0</Text>
                      <Text style={styles.sliderLabel}>500</Text>
                      <Text style={styles.sliderLabel}>1000</Text>
                    </View>
                  </View>

                  {/* 빠른 설정 버튼들 */}
                  <View style={styles.rangeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.rangeButton,
                        localCalorieRange[0] === 0 && localCalorieRange[1] === 300 && styles.rangeButtonActive
                      ]}
                      onPress={() => updateCalorieRange([0, 300])}
                    >
                      <Text style={[
                        styles.rangeButtonText,
                        localCalorieRange[0] === 0 && localCalorieRange[1] === 300 && styles.rangeButtonTextActive
                      ]}>낮음 (0-300)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.rangeButton,
                        localCalorieRange[0] === 300 && localCalorieRange[1] === 600 && styles.rangeButtonActive
                      ]}
                      onPress={() => updateCalorieRange([300, 600])}
                    >
                      <Text style={[
                        styles.rangeButtonText,
                        localCalorieRange[0] === 300 && localCalorieRange[1] === 600 && styles.rangeButtonTextActive
                      ]}>보통 (300-600)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.rangeButton,
                        localCalorieRange[0] === 600 && localCalorieRange[1] === 1000 && styles.rangeButtonActive
                      ]}
                      onPress={() => updateCalorieRange([600, 1000])}
                    >
                      <Text style={[
                        styles.rangeButtonText,
                        localCalorieRange[0] === 600 && localCalorieRange[1] === 1000 && styles.rangeButtonTextActive
                      ]}>높음 (600-1000)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.applyButton} onPress={onClose}>
                <Text style={styles.applyButtonText}>적용하기</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 12,
  },
  ingredientsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ingredientButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  ingredientButtonSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  ingredientButtonUnselected: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  ingredientButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  ingredientButtonTextSelected: {
    color: "#FFFFFF",
  },
  ingredientButtonTextUnselected: {
    color: "#666",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  checkboxUnchecked: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#2D2D2D",
    flex: 1,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  optionButtonUnselected: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  optionButtonTextSelected: {
    color: "#FFFFFF",
  },
  optionButtonTextUnselected: {
    color: "#666",
  },
  calorieRangeContainer: {
    marginBottom: 16,
  },
  calorieRangeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
    textAlign: "center",
    marginBottom: 12,
  },
  rangeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  rangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  rangeButtonText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  rangeButtonActive: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  rangeButtonTextActive: {
    color: "#FFFFFF",
  },
  dualSliderContainer: {
    marginVertical: 20,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    position: "relative",
    marginBottom: 10,
  },
  sliderRange: {
    position: "absolute",
    top: 0,
    height: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  sliderThumb: {
    position: "absolute",
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderThumbMin: {
    marginLeft: -10,
  },
  sliderThumbMax: {
    marginLeft: -10,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 10,
    color: "#666",
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  applyButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});


