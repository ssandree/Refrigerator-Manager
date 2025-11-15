import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStoreError } from "../../src/hooks/useStoreError";
import { useMealStore } from "../../src/stores/useMealStore";
import { useRecipeStore } from "../../src/stores/useRecipeStore";
import { Colors, FontSizes } from "../../src/styles/common";

export default function RecipeDetail() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const recipeId = params?.id;
  const name = params?.name ?? "알 수 없는 레시피";

  const getRecipeById = useRecipeStore((s) => s.getRecipeById);
  const recipe = recipeId ? getRecipeById(recipeId) : undefined;

  const addMeal = useMealStore((s) => s.addMeal);
  const mealStore = useMealStore((s) => ({
    error: s.error,
    clearError: s.clearError,
  }));

  useStoreError(mealStore);

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const handleRegisterMeal = () => {
    if (!recipe) {
      Alert.alert("오류", "레시피 정보를 찾을 수 없습니다.");
      return;
    }

    mealStore.clearError();

    const success = addMeal({
      id: Date.now().toString(),
      recipe: recipe,
      ingredients: [],
      quantity: "1인분",
      consumedAt: todayStr,
      registeredAt: todayStr,
      notes: undefined,
      mealType: undefined,
    });

    if (success) {
      Alert.alert("성공", "식사가 등록되었습니다.", [
        {
          text: "확인",
          onPress: () => router.replace("/(tabs)/Meal"),
        },
      ]);
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
            <Text style={styles.headerTitle}>레시피 상세</Text>
            <View style={styles.headerRightPlaceholder} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>{name}</Text>
            {recipe && (
              <>
                <View style={styles.infoSection}>
                  <Text style={styles.label}>칼로리</Text>
                  <Text style={styles.infoText}>{recipe.calories}kcal</Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.label}>조리 시간</Text>
                  <Text style={styles.infoText}>{recipe.time}분</Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.label}>난이도</Text>
                  <Text style={styles.infoText}>{recipe.difficulty}</Text>
                </View>
                {recipe.description && (
                  <View style={styles.infoSection}>
                    <Text style={styles.label}>설명</Text>
                    <Text style={styles.infoText}>{recipe.description}</Text>
                  </View>
                )}
              </>
            )}

            {/* 식사 등록 버튼 */}
            {recipe && (
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegisterMeal}
              >
                <Text style={styles.registerButtonText}>식사로 등록하기</Text>
              </TouchableOpacity>
            )}
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
  title: {
    fontSize: FontSizes["3xl"],
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  registerButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
    color: Colors.surface,
  },
});
