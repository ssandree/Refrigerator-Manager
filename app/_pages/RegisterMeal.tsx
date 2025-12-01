import { router, Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useDateStore } from "../../src/stores/useDateStore";
import { Meal, useMealStore } from "../../src/stores/useMealStore";
import { useRecipeStore } from "../../src/stores/useRecipeStore";
import { Colors, FontSizes } from "../../src/styles/common";
import { Recipe } from "../../src/types/recipe";
import { toKoreaDateISO } from "../../src/utils/dateUtils";

export default function RegisterMeal() {
  const { mealId } = useLocalSearchParams<{ mealId: string }>();
  const addMeal = useMealStore((s) => s.addMeal);
  const updateMeal = useMealStore((s) => s.updateMeal);
  const getMealById = useMealStore((s) => s.getMealById);
  const fetchMealById = useMealStore((s) => s.fetchMealById);
  const meals = useMealStore((s) => s.meals);
  const { clearError } = useStoreWithError(useMealStore);
  const searchRecipes = useRecipeStore((s) => s.searchRecipes);
  // searchRecipes 함수 참조를 useRef로 저장하여 안정적인 참조 유지
  const searchRecipesRef = useRef(searchRecipes);
  searchRecipesRef.current = searchRecipes;

  // 한국 시간 기준 오늘 날짜를 전역 스토어에서 가져옴
  const todayStr = useDateStore((s) => s.todayISO);

  const [meal, setMeal] = useState<Meal | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack" | undefined
  >();
  const [quantity, setQuantity] = useState<string>("1인분");
  const [consumedAt, setConsumedAt] = useState<string>(todayStr);
  const [foodName, setFoodName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // 영양 정보 상태
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbohydrates, setCarbohydrates] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [sodium, setSodium] = useState<string>("");
  const [vitaminC, setVitaminC] = useState<string>("");
  const [vitaminD, setVitaminD] = useState<string>("");
  const [zinc, setZinc] = useState<string>("");

  // 레시피 검색 (debounce)
  useEffect(() => {
    if (!foodName || foodName.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        // useRef를 통해 안정적인 함수 참조 사용
        const results = await searchRecipesRef.current(foodName.trim(), 10); // limit=10으로 고정
        setSearchResults(results);
        setShowSearchResults(results.length > 0);
      } catch (error) {
        setSearchResults([]);
        setShowSearchResults(false);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
    // searchRecipes를 의존성 배열에서 제거하고 useRef 사용으로 안정적인 참조 유지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foodName]);

  // 레시피 선택 핸들러
  const handleSelectRecipe = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setFoodName(recipe.recipeName);
    setShowSearchResults(false);

    // 레시피의 영양 정보를 자동으로 입력
    if (recipe.calories !== null) setCalories(String(recipe.calories));
    if (recipe.protein !== null) setProtein(String(recipe.protein));
    if (recipe.carbohydrates !== null)
      setCarbohydrates(String(recipe.carbohydrates));
    if (recipe.fat !== null) setFat(String(recipe.fat));
    if (recipe.sodium !== null) setSodium(String(recipe.sodium));
    if (recipe.vitamin_c !== null) setVitaminC(String(recipe.vitamin_c));
    if (recipe.vitamin_d !== null) setVitaminD(String(recipe.vitamin_d));
    if (recipe.zinc !== null) setZinc(String(recipe.zinc));
  }, []);

  // mealId가 있으면 수정 모드로 동작
  const formatDateInputValue = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value.split("T")[0] ?? value;
    }
    return toKoreaDateISO(date);
  };

  useEffect(() => {
    if (!mealId) return;

    // 1차: 스토어에서 이미 로드된 식단을 찾기
    const foundMeal = getMealById(mealId);
    if (foundMeal) {
      setMeal(foundMeal);
      setMealType(foundMeal.mealType ?? undefined);
      setQuantity(foundMeal.quantity ?? "1인분");
      setConsumedAt(formatDateInputValue(foundMeal.consumedAt));
      // notes에서 음식명과 메모 분리 (간단한 파싱)
      const notesStr = foundMeal.notes || "";
      if (notesStr.includes(" - ")) {
        const [name, ...rest] = notesStr.split(" - ");
        setFoodName(name);
        setNotes(rest.join(" - "));
      } else {
        setFoodName(notesStr);
        setNotes("");
      }
      // 영양 정보 초기화 (현재는 notes에 저장되지 않으므로 빈 값)
      setCalories("");
      setProtein("");
      setCarbohydrates("");
      setFat("");
      setSodium("");
      setVitaminC("");
      setVitaminD("");
      setZinc("");
      return;
    }

    // 2차: 스토어에 없으면 서버에서 단건 조회
    (async () => {
      const remoteMeal = await fetchMealById(mealId);
      if (!remoteMeal) {
        Alert.alert("오류", "식사를 찾을 수 없습니다.", [
          {
            text: "확인",
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)/Meal");
              }
            },
          },
        ]);
        return;
      }

      setMeal(remoteMeal);
      setMealType(remoteMeal.mealType ?? undefined);
      setQuantity(remoteMeal.quantity ?? "1인분");
      setConsumedAt(formatDateInputValue(remoteMeal.consumedAt));
      const notesStr = remoteMeal.notes || "";
      if (notesStr.includes(" - ")) {
        const [name, ...rest] = notesStr.split(" - ");
        setFoodName(name);
        setNotes(rest.join(" - "));
      } else {
        setFoodName(notesStr);
        setNotes("");
      }
      // 영양 정보 초기화 (현재는 notes에 저장되지 않으므로 빈 값)
      setCalories("");
      setProtein("");
      setCarbohydrates("");
      setFat("");
      setSodium("");
      setVitaminC("");
      setVitaminD("");
      setZinc("");
    })();
  }, [mealId, getMealById, fetchMealById]);

  const toISODateTime = (value: string) => {
    if (!value) {
      return useDateStore.getState().now.toISOString();
    }
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      const fallback = new Date(value);
      return Number.isNaN(fallback.getTime())
        ? useDateStore.getState().now.toISOString()
        : fallback.toISOString();
    }
    return parsed.toISOString();
  };

  const onSave = async () => {
    if (!quantity || !consumedAt) {
      Alert.alert("오류", "수량과 섭취일을 입력해주세요.");
      return;
    }

    // 표시용: 리스트에서 음식명을 우선 보여주기 위해 notes에 음식명과 메모를 합쳐 저장
    const combinedNotes = foodName
      ? notes
        ? `${foodName} - ${notes}`
        : foodName
      : notes || undefined;

    // 에러 상태 초기화
    clearError();

    const isEditMode = !!mealId && !!meal;

    const consumedAtISO = toISODateTime(consumedAt);

    if (isEditMode) {
      // 수정 모드: PUT API 호출
      const success = await updateMeal(meal!.id, {
        quantity: quantity || null,
        notes: combinedNotes || null,
        mealType: mealType ?? null,
      });

      if (success) {
        Alert.alert("성공", "식사 정보가 성공적으로 수정되었습니다!", [
          {
            text: "확인",
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)/Meal");
              }
            },
          },
        ]);
      }
    } else {
      // 추가 모드: POST API 호출
      const success = await addMeal({
        recipeId: selectedRecipe?.id || null,
        foodIds: [],
        quantity: quantity || null,
        consumedAt: consumedAtISO,
        notes: combinedNotes || null,
        mealType: mealType ?? null,
      });

      // 성공 시 화면 이동 (에러는 store에서 처리되고 useStoreError 훅이 토스트로 표시함)
      if (success) {
        router.replace("/(tabs)/Meal");
      }
    }
  };

  // 수정 모드인데 meal이 로드되지 않았으면 로딩 표시
  const isEditMode = !!mealId;
  if (isEditMode && !meal) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <LoadingSpinner message="식사 정보를 불러오는 중..." fullScreen />
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
                  router.replace("/(tabs)/Meal");
                }
              }}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {mealId ? "식사 수정" : "식사 등록"}
            </Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* 식사 유형 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>식사 유형</Text>
              <View style={styles.row}>
                {[
                  { key: "breakfast", label: "아침" },
                  { key: "lunch", label: "점심" },
                  { key: "dinner", label: "저녁" },
                  { key: "snack", label: "간식" },
                ].map((m) => (
                  <TouchableOpacity
                    key={m.key}
                    style={[
                      styles.choiceButton,
                      mealType === (m.key as typeof mealType) &&
                        styles.choiceSelected,
                    ]}
                    onPress={() => setMealType(m.key as typeof mealType)}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        mealType === (m.key as typeof mealType) &&
                          styles.choiceTextSelected,
                      ]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 음식 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>음식</Text>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.textInput}
                  value={foodName}
                  onChangeText={(text) => {
                    setFoodName(text);
                    setSelectedRecipe(null); // 입력 변경 시 선택 해제
                  }}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  placeholder="예: 된장찌개, 닭가슴살 샐러드"
                  placeholderTextColor={Colors.textSecondary}
                />
                {showSearchResults && searchResults.length > 0 && (
                  <View style={styles.searchResultsContainer}>
                    {isSearching && (
                      <View style={styles.searchResultItem}>
                        <Text style={styles.searchResultText}>검색 중...</Text>
                      </View>
                    )}
                    <FlatList
                      data={searchResults}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.searchResultItem}
                          onPress={() => handleSelectRecipe(item)}
                        >
                          <Text style={styles.searchResultText}>
                            {item.recipeName}
                          </Text>
                          {item.calories !== null && (
                            <Text style={styles.searchResultSubtext}>
                              {item.calories} kcal
                            </Text>
                          )}
                        </TouchableOpacity>
                      )}
                      style={styles.searchResultsList}
                      nestedScrollEnabled
                    />
                  </View>
                )}
              </View>
              {selectedRecipe && (
                <Text style={styles.selectedRecipeText}>
                  ✓ 레시피 선택됨: {selectedRecipe.recipeName}
                </Text>
              )}
            </View>

            {/* 수량 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>수량 *</Text>
              <TextInput
                style={styles.textInput}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="예: 1인분, 200g"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            {/* 섭취일 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>섭취일 *</Text>
              <TextInput
                style={styles.textInput}
                value={consumedAt}
                onChangeText={setConsumedAt}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>

            {/* 메모 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>메모</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="메모를 입력하세요"
                placeholderTextColor={Colors.textSecondary}
                multiline
              />
            </View>

            {/* 영양 정보 섹션 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>영양 정보</Text>

              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>칼로리 (kcal)</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={calories}
                    onChangeText={setCalories}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>단백질 (g)</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={protein}
                    onChangeText={setProtein}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>탄수화물 (g)</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={carbohydrates}
                    onChangeText={setCarbohydrates}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>지방 (g)</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={fat}
                    onChangeText={setFat}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>나트륨 (mg)</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={sodium}
                    onChangeText={setSodium}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>비타민 C (mg)</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={vitaminC}
                    onChangeText={setVitaminC}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>비타민 D (μg)</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={vitaminD}
                    onChangeText={setVitaminD}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>아연 (mg)</Text>
                  <TextInput
                    style={styles.nutritionInput}
                    value={zinc}
                    onChangeText={setZinc}
                    placeholder="0"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* 저장 버튼 */}
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>
                {mealId ? "수정 완료" : "저장"}
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
  headerRightPlaceholder: {
    width: 32,
    height: 32,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  choiceButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  choiceSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  choiceText: {
    fontSize: FontSizes.base,
    color: Colors.text,
  },
  choiceTextSelected: {
    color: Colors.surface,
    fontWeight: "700",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
    color: Colors.surface,
  },
  section: {
    marginTop: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  nutritionItem: {
    width: "48%",
    marginBottom: 12,
  },
  nutritionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  nutritionInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: FontSizes.base,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  searchContainer: {
    position: "relative",
  },
  searchResultsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchResultsList: {
    maxHeight: 200,
  },
  searchResultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  searchResultText: {
    fontSize: FontSizes.base,
    color: Colors.text,
    fontWeight: "500",
  },
  searchResultSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  selectedRecipeText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    marginTop: 8,
    fontWeight: "500",
  },
});
