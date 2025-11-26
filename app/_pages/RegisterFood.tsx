import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import {
  FoodCategory,
  FoodCategoryLabel,
} from "../../src/enums/ingredientCategory";
import {
  StorageLocation,
  StorageLocationLabel,
} from "../../src/enums/storageLocation";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useDateStore } from "../../src/stores/useDateStore";
import { useFridgeStore } from "../../src/stores/useFoodStore";
import { Colors, FontSizes } from "../../src/styles/common";
import { Food } from "../../src/types/food";
import { addDaysInKorea } from "../../src/utils/dateUtils";
import { logger } from "../../src/utils/logger";

export default function EditFood() {
  const { ingredientId } = useLocalSearchParams<{ ingredientId: string }>();

  // URL 파라미터로 받은 ingredientId로 실제 재료 정보 찾기
  const [food, setFood] = useState<Food | null>(null);
  const foods = useFridgeStore((s) => s.foods);
  const getFoodById = useFridgeStore((s) => s.getFoodById);
  const addFood = useFridgeStore((s) => s.addFood);
  const updateFood = useFridgeStore((s) => s.updateFood);
  const removeFood = useFridgeStore((s) => s.removeFood);
  const clearError = useFridgeStore((s) => s.clearError);

  useStoreWithError(useFridgeStore);

  useEffect(() => {
    if (ingredientId) {
      const foundFood = getFoodById(ingredientId);
      if (foundFood) {
        setFood(foundFood);
      } else {
        Alert.alert("오류", "재료를 찾을 수 없습니다.", [
          {
            text: "확인",
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)/Fridge");
              }
            },
          },
        ]);
      }
    }
  }, [ingredientId, foods, getFoodById]);

  const [formData, setFormData] = useState<Partial<Food>>({});

  // 한국 시간 기준 오늘 날짜를 전역 스토어에서 가져옴
  const todayISO = useDateStore((s) => s.todayISO);

  // food가 로드되면 formData 초기화
  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name,
        category: food.category,
        quantity: food.quantity,
        weight: food.weight,
        purchaseDate: food.purchaseDate,
        expiryDate: food.expiryDate,
        storageLocation: food.storageLocation,
        alertBeforeDays: food.alertBeforeDays,
      });
    } else {
      // 새로 추가하는 경우 구매일을 오늘 날짜로 기본 설정
      setFormData((prev) => ({
        ...prev,
        purchaseDate: prev.purchaseDate || todayISO,
      }));
    }
  }, [food, todayISO]);

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showStoragePicker, setShowStoragePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleInputChange = (
    field: keyof Food,
    value: string | number | null
  ) => {
    setFormData((prev: Partial<Food>) => {
      const newData = { ...prev, [field]: value };

      // 카테고리가 변경되면 보관 위치와 유통기한 자동 설정
      if (field === "category") {
        const category = value as FoodCategory;

        // 카테고리별 보관 위치 설정
        let storageLocation: StorageLocation;
        if (
          [
            FoodCategory.MEAT,
            FoodCategory.FISH,
            FoodCategory.VEGETABLE,
            FoodCategory.FRUIT,
            FoodCategory.DAIRY,
            FoodCategory.SIDE,
            FoodCategory.SAUCE,
          ].includes(category)
        ) {
          storageLocation = StorageLocation.FRIDGE;
        } else if (
          [
            FoodCategory.RICE_CAKE,
            FoodCategory.FROZEN,
            FoodCategory.INSTANT,
          ].includes(category)
        ) {
          storageLocation = StorageLocation.FREEZER;
        } else {
          storageLocation = StorageLocation.ROOM_TEMP;
        }

        // 카테고리별 유통기한 설정 (한국 시간 기준)
        const todayISO = useDateStore.getState().todayISO;
        let daysToAdd = 30;
        switch (category) {
          case FoodCategory.MEAT:
            daysToAdd = 3;
            break;
          case FoodCategory.FISH:
            daysToAdd = 2;
            break;
          case FoodCategory.VEGETABLE:
            daysToAdd = 7;
            break;
          case FoodCategory.FRUIT:
            daysToAdd = 7;
            break;
          case FoodCategory.DAIRY:
            daysToAdd = 14;
            break;
          case FoodCategory.DRINK:
            daysToAdd = 14;
            break;
          default:
            daysToAdd = 30;
        }

        newData.storageLocation = storageLocation;
        newData.expiryDate = addDaysInKorea(todayISO, daysToAdd);
      }

      return newData;
    });
  };

  const handleSave = async () => {
    // 필수 필드 검증
    if (!formData.name || !formData.weight || !formData.expiryDate) {
      Alert.alert("오류", "모든 필수 항목을 입력해주세요.");
      return;
    }

    // 에러 상태 초기화
    clearError();

    const isEditMode = !!ingredientId && !!food;
    setIsSaving(true);

    try {
      if (isEditMode) {
        const payload: Partial<Food> = {
          name: formData.name!,
          category: formData.category!,
          quantity: formData.quantity ?? null,
          weight: formData.weight!,
          purchaseDate: formData.purchaseDate ?? null,
          expiryDate: formData.expiryDate!,
          storageLocation: formData.storageLocation!,
          alertBeforeDays: formData.alertBeforeDays ?? null,
        };

        const success = await updateFood(food!.id, payload);
        if (success) {
          Alert.alert("성공", "재료 정보가 성공적으로 수정되었습니다!", [
            {
              text: "확인",
              onPress: () => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/Fridge");
                }
              },
            },
          ]);
        }
      } else {
        const payload: Omit<Food, "id"> = {
          imageUrl: null,
          name: formData.name!,
          category: formData.category!,
          quantity: formData.quantity ?? null,
          weight: formData.weight!,
          registeredAt: todayISO,
          purchaseDate: formData.purchaseDate || todayISO,
          expiryDate: formData.expiryDate!,
          storageLocation: formData.storageLocation!,
          alertBeforeDays: formData.alertBeforeDays ?? 3,
        };

        const success = await addFood(payload);
        if (success) {
          Alert.alert("성공", "재료가 성공적으로 추가되었습니다!", [
            {
              text: "확인",
              onPress: () => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/Fridge");
                }
              },
            },
          ]);
        }
      }
    } catch (error) {
      logger.error("Food save failed:", error);
      Alert.alert(
        "오류",
        error instanceof Error
          ? error.message
          : "재료 저장 중 문제가 발생했습니다."
      );
    } finally {
      setIsSaving(false);
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
        onPress: async () => {
          if (!food) return;
          setIsDeleting(true);
          try {
            clearError();
            const success = await removeFood(food.id);
            if (success) {
              Alert.alert("삭제 완료", "재료가 삭제되었습니다.", [
                {
                  text: "확인",
                  onPress: () => {
                    if (router.canGoBack()) {
                      router.back();
                    } else {
                      router.replace("/(tabs)/Fridge");
                    }
                  },
                },
              ]);
            }
          } catch (error) {
            logger.error("Food delete failed:", error);
            Alert.alert(
              "오류",
              error instanceof Error
                ? error.message
                : "재료 삭제 중 문제가 발생했습니다."
            );
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  // 수정 모드인데 food가 로드되지 않았으면 로딩 표시
  const isEditMode = !!ingredientId;
  if (isEditMode && !food) {
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
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/Fridge");
                }
              }}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditMode ? "재료 수정" : "재료 추가"}
            </Text>
            {isEditMode && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
            )}
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
                  {formData.category
                    ? FoodCategoryLabel[formData.category]
                    : "카테고리를 선택하세요"}
                </Text>
                <Text style={styles.pickerArrow}>▼</Text>
              </TouchableOpacity>

              {showCategoryPicker && (
                <View style={styles.pickerContainer}>
                  {Object.values(FoodCategory).map((category) => (
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
                        {FoodCategoryLabel[category]}
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
                value={formData.quantity?.toString() || ""}
                onChangeText={(value) =>
                  handleInputChange("quantity", value ? parseInt(value) : null)
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
                value={formData.weight || ""}
                onChangeText={(value) =>
                  handleInputChange("weight", value || null)
                }
                placeholder="예: 500g, 1L, 1kg"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            {/* 구매일 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>구매일 *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.purchaseDate || ""}
                onChangeText={(value) =>
                  handleInputChange("purchaseDate", value || null)
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
                value={formData.expiryDate || ""}
                onChangeText={(value) =>
                  handleInputChange("expiryDate", value || null)
                }
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
                  {formData.storageLocation
                    ? StorageLocationLabel[formData.storageLocation]
                    : "보관 위치를 선택하세요"}
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
                value={formData.alertBeforeDays?.toString() || ""}
                onChangeText={(value) =>
                  handleInputChange(
                    "alertBeforeDays",
                    value ? parseInt(value) : null
                  )
                }
                placeholder="3"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            {/* 저장 버튼 */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                (isSaving || isDeleting) && styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={isSaving || isDeleting}
            >
              <Text style={styles.saveButtonText}>
                {isSaving
                  ? "저장 중..."
                  : ingredientId
                  ? "수정 완료"
                  : "추가 완료"}
              </Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: "600",
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
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
    color: Colors.surface,
  },
});
