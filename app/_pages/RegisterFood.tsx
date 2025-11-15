import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { Ingredient } from "../../src/data/mockFood";
import {
  IngredientCategory,
  IngredientCategoryLabel,
} from "../../src/enums/ingredientCategory";
import {
  StorageLocation,
  StorageLocationLabel,
} from "../../src/enums/storageLocation";
import { useStoreError } from "../../src/hooks/useStoreError";
import { useFridgeStore } from "../../src/stores/useFridgeStore";
import { Colors, FontSizes } from "../../src/styles/common";

export default function EditFood() {
  const { ingredientId } = useLocalSearchParams<{ ingredientId: string }>();

  // URL 파라미터로 받은 ingredientId로 실제 재료 정보 찾기
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const ingredients = useFridgeStore((s) => s.ingredients);
  const getIngredientById = useFridgeStore((s) => s.getIngredientById);
  const updateIngredient = useFridgeStore((s) => s.updateIngredient);
  const removeIngredient = useFridgeStore((s) => s.removeIngredient);
  const fridgeStore = useFridgeStore((s) => ({
    error: s.error,
    clearError: s.clearError,
  }));

  useStoreError(fridgeStore);

  useEffect(() => {
    if (ingredientId) {
      const foundIngredient = getIngredientById(ingredientId);
      if (foundIngredient) {
        setIngredient(foundIngredient);
      } else {
        Alert.alert("오류", "재료를 찾을 수 없습니다.", [
          { text: "확인", onPress: () => router.back() },
        ]);
      }
    }
  }, [ingredientId, ingredients, getIngredientById]);

  const [formData, setFormData] = useState<Partial<Ingredient>>({});

  // ingredient가 로드되면 formData 초기화
  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        category: ingredient.category,
        quantity: ingredient.quantity,
        weight: ingredient.weight,
        purchaseDate: ingredient.purchaseDate,
        expiryDate: ingredient.expiryDate,
        storageLocation: ingredient.storageLocation,
        alertBeforeDays: ingredient.alertBeforeDays,
      });
    }
  }, [ingredient]);

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showStoragePicker, setShowStoragePicker] = useState(false);

  const handleInputChange = (
    field: keyof Ingredient,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // 카테고리가 변경되면 보관 위치와 유통기한 자동 설정
      if (field === "category") {
        const category = value as IngredientCategory;
        const today = new Date();
        const expiryDate = new Date(today);

        // 카테고리별 보관 위치 설정
        let storageLocation: StorageLocation;
        if (
          [
            IngredientCategory.MEAT,
            IngredientCategory.FISH,
            IngredientCategory.VEGETABLE,
            IngredientCategory.FRUIT,
            IngredientCategory.DAIRY,
            IngredientCategory.SIDE,
            IngredientCategory.SAUCE,
          ].includes(category)
        ) {
          storageLocation = StorageLocation.FRIDGE;
        } else if (
          [
            IngredientCategory.RICE_CAKE,
            IngredientCategory.FROZEN,
            IngredientCategory.INSTANT,
          ].includes(category)
        ) {
          storageLocation = StorageLocation.FREEZER;
        } else {
          storageLocation = StorageLocation.ROOM_TEMP;
        }

        // 카테고리별 유통기한 설정
        switch (category) {
          case IngredientCategory.MEAT:
            expiryDate.setDate(today.getDate() + 3);
            break;
          case IngredientCategory.FISH:
            expiryDate.setDate(today.getDate() + 2);
            break;
          case IngredientCategory.VEGETABLE:
            expiryDate.setDate(today.getDate() + 7);
            break;
          case IngredientCategory.FRUIT:
            expiryDate.setDate(today.getDate() + 7);
            break;
          case IngredientCategory.DAIRY:
            expiryDate.setDate(today.getDate() + 14);
            break;
          case IngredientCategory.DRINK:
            expiryDate.setDate(today.getDate() + 14);
            break;
          default:
            expiryDate.setDate(today.getDate() + 30);
        }

        newData.storageLocation = storageLocation;
        newData.expiryDate = expiryDate.toISOString().split("T")[0];
      }

      return newData;
    });
  };

  const handleSave = () => {
    // 필수 필드 검증
    if (!formData.name || !formData.weight || !formData.expiryDate) {
      Alert.alert("오류", "모든 필수 항목을 입력해주세요.");
      return;
    }

    // 에러 상태 초기화
    clearError();

    // 전역 상태 업데이트
    const success = updateIngredient(ingredient!.id, {
      name: formData.name!,
      category: formData.category!,
      quantity: formData.quantity!,
      weight: formData.weight!,
      purchaseDate: formData.purchaseDate!,
      expiryDate: formData.expiryDate!,
      storageLocation: formData.storageLocation!,
      alertBeforeDays: formData.alertBeforeDays!,
    });

    // 성공 시 메시지 표시 (에러는 store에서 처리되고 useStoreError 훅이 토스트로 표시함)
    if (success) {
      Alert.alert("성공", "재료 정보가 성공적으로 수정되었습니다!", [
        {
          text: "확인",
          onPress: () => router.back(),
        },
      ]);
    }
  };

  const handleDelete = () => {
    Alert.alert("재료 삭제", "정말로 이 재료를 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          // 에러 상태 초기화
          clearError();
          // 재료 삭제
          const success = removeIngredient(ingredient!.id);
          // 성공 시 메시지 표시 (에러는 store에서 처리되고 useStoreError 훅이 토스트로 표시함)
          if (success) {
            Alert.alert("삭제 완료", "재료가 삭제되었습니다.", [
              {
                text: "확인",
                onPress: () => router.back(),
              },
            ]);
          }
        },
      },
    ]);
  };

  // ingredient가 로드되지 않았으면 로딩 표시
  if (!ingredient) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <LoadingSpinner message="재료 정보를 불러오는 중..." fullScreen />
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>재료 수정</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* 재료명 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>재료명 *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(value) => handleInputChange("name", value)}
                placeholder="재료명을 입력하세요"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            {/* 카테고리 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>카테고리 *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <Text style={styles.pickerButtonText}>
                  {IngredientCategoryLabel[formData.category!]}
                </Text>
                <Text style={styles.pickerArrow}>▼</Text>
              </TouchableOpacity>

              {showCategoryPicker && (
                <View style={styles.pickerContainer}>
                  {Object.values(IngredientCategory).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.pickerOption,
                        formData.category === category &&
                          styles.pickerOptionSelected,
                      ]}
                      onPress={() => {
                        handleInputChange("category", category);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          formData.category === category &&
                            styles.pickerOptionTextSelected,
                        ]}
                      >
                        {IngredientCategoryLabel[category]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 수량 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>수량 *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.quantity?.toString()}
                onChangeText={(value) =>
                  handleInputChange("quantity", parseInt(value) || 1)
                }
                placeholder="수량을 입력하세요"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            {/* 무게/용량 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>무게/용량 *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.weight}
                onChangeText={(value) => handleInputChange("weight", value)}
                placeholder="예: 500g, 1L, 1kg"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            {/* 구매일 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>구매일 *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.purchaseDate}
                onChangeText={(value) =>
                  handleInputChange("purchaseDate", value)
                }
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            {/* 유통기한 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>유통기한 *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.expiryDate}
                onChangeText={(value) => handleInputChange("expiryDate", value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            {/* 보관 위치 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>보관 위치 *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowStoragePicker(!showStoragePicker)}
              >
                <Text style={styles.pickerButtonText}>
                  {StorageLocationLabel[formData.storageLocation!]}
                </Text>
                <Text style={styles.pickerArrow}>▼</Text>
              </TouchableOpacity>

              {showStoragePicker && (
                <View style={styles.pickerContainer}>
                  {Object.values(StorageLocation).map((location) => (
                    <TouchableOpacity
                      key={location}
                      style={[
                        styles.pickerOption,
                        formData.storageLocation === location &&
                          styles.pickerOptionSelected,
                      ]}
                      onPress={() => {
                        handleInputChange("storageLocation", location);
                        setShowStoragePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          formData.storageLocation === location &&
                            styles.pickerOptionTextSelected,
                        ]}
                      >
                        {StorageLocationLabel[location]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* 알림 설정 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>유통기한 알림 (일 전)</Text>
              <TextInput
                style={styles.textInput}
                value={formData.alertBeforeDays?.toString()}
                onChangeText={(value) =>
                  handleInputChange("alertBeforeDays", parseInt(value) || 3)
                }
                placeholder="3"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            {/* 저장 버튼 */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>수정 완료</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: FontSizes.xl,
    color: Colors.text,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.text,
    flex: 1,
    textAlign: "center",
  },
  deleteButton: {
    padding: 8,
    marginRight: -8,
  },
  deleteButtonText: {
    fontSize: FontSizes.base,
    color: Colors.error,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: FontSizes.base,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
  },
  pickerButtonText: {
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  pickerArrow: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  pickerContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    overflow: "hidden",
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.primary,
  },
  pickerOptionText: {
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  pickerOptionTextSelected: {
    color: Colors.surface,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
    color: Colors.surface,
  },
});
