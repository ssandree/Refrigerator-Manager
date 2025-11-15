import { router, Stack } from "expo-router";
import React, { useMemo, useState } from "react";
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
import { useStoreError } from "../../src/hooks/useStoreError";
import { useMealStore } from "../../src/stores/useMealStore";
import { Colors, FontSizes } from "../../src/styles/common";

export default function RegisterMeal() {
  const addMeal = useMealStore((s) => s.addMeal);
  const mealStore = useMealStore((s) => ({
    error: s.error,
    clearError: s.clearError,
  }));
  const { clearError } = mealStore;

  useStoreError(mealStore);

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack" | undefined
  >();
  const [quantity, setQuantity] = useState<string>("1인분");
  const [consumedAt, setConsumedAt] = useState<string>(todayStr);
  const [foodName, setFoodName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const onSave = () => {
    if (!quantity || !consumedAt) {
      Alert.alert("오류", "수량과 섭취일을 입력해주세요.");
      return;
    }

    const nowStr = new Date().toISOString().split("T")[0];
    // 표시용: 리스트에서 음식명을 우선 보여주기 위해 notes에 음식명과 메모를 합쳐 저장
    const combinedNotes = foodName
      ? notes
        ? `${foodName} - ${notes}`
        : foodName
      : notes || undefined;

    // 에러 상태 초기화
    clearError();

    // 식단 추가
    const success = addMeal({
      id: Date.now().toString(),
      recipe: null,
      ingredients: [],
      quantity,
      consumedAt,
      registeredAt: nowStr,
      notes: combinedNotes,
      mealType,
    });

    // 성공 시 화면 이동 (에러는 store에서 처리되고 useStoreError 훅이 토스트로 표시함)
    if (success) {
      router.replace("/(tabs)/Meal");
    }
  };

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
            <Text style={styles.headerTitle}>식사 등록</Text>
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
              <TextInput
                style={styles.textInput}
                value={foodName}
                onChangeText={setFoodName}
                placeholder="예: 된장찌개, 닭가슴살 샐러드"
                placeholderTextColor={Colors.textSecondary}
              />
              <Text style={styles.helperText}>최근 본 레시피</Text>
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

            {/* 저장 버튼 */}
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveButtonText}>저장</Text>
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
  helperText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 6,
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
});
