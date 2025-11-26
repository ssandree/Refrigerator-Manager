import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useMealStore } from "../../src/stores/useMealStore";
import { useRecipeStore } from "../../src/stores/useRecipeStore";
import { Colors, FontSizes } from "../../src/styles/common";
import { Recipe } from "../../src/types/recipe";

export default function RecipeDetail() {
  const params = useLocalSearchParams<{ id?: string; name?: string }>();
  const recipeId = params?.id;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const fetchRecipeById = useRecipeStore((s) => s.fetchRecipeById);
  const getRecipeById = useRecipeStore((s) => s.getRecipeById);
  const isLoading = useRecipeStore((s) => s.isLoading);
  const error = useRecipeStore((s) => s.error);

  const addMeal = useMealStore((s) => s.addMeal);
  useStoreWithError(useMealStore);
  useStoreWithError(useRecipeStore);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!recipeId) {
        return;
      }

      // 먼저 로컬 스토어에서 확인
      const localRecipe = getRecipeById(recipeId);
      if (localRecipe) {
        setRecipe(localRecipe);
        return;
      }

      // 로컬에 없으면 서버에서 가져오기
      const fetchedRecipe = await fetchRecipeById(recipeId);
      if (fetchedRecipe) {
        setRecipe(fetchedRecipe);
      }
    };

    loadRecipe();
  }, [recipeId, fetchRecipeById, getRecipeById]);

  const handleRegisterMeal = async () => {
    if (!recipe) {
      Alert.alert("오류", "레시피 정보를 찾을 수 없습니다.");
      return;
    }

    const success = await addMeal({
      recipeId: recipe.id,
      foodIds: [],
      quantity: "1인분",
      consumedAt: new Date().toISOString(),
      notes: recipe.recipeName,
      mealType: null,
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
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/Recipe");
                }
              }}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>레시피 상세</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {isLoading && !recipe ? (
              <LoadingSpinner message="레시피를 불러오는 중..." />
            ) : error && !recipe ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : recipe ? (
              <>
                <Text style={styles.title}>{recipe.recipeName}</Text>
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

                {/* 식사 등록 버튼 */}
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleRegisterMeal}
                >
                  <Text style={styles.registerButtonText}>식사로 등록하기</Text>
                </TouchableOpacity>
              </>
            ) : null}
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
  },
  backButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 60, // 뒤로 버튼과 균형을 맞추기 위한 공간
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
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: FontSizes.base,
    color: Colors.error,
    textAlign: "center",
  },
});
