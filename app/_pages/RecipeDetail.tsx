import { router, Stack, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
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
import { useDateStore } from "../../src/stores/useDateStore";
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
  const mealLoading = useMealStore((s) => s.isLoading);
  const mealError = useMealStore((s) => s.error);
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
        // sourceUrl이 있으면 바로 웹뷰 열기
        if (localRecipe.sourceUrl) {
          WebBrowser.openBrowserAsync(localRecipe.sourceUrl);
        }
        return;
      }

      // 로컬에 없으면 서버에서 가져오기
      const fetchedRecipe = await fetchRecipeById(recipeId);
      if (fetchedRecipe) {
        setRecipe(fetchedRecipe);
        // sourceUrl이 있으면 바로 웹뷰 열기
        if (fetchedRecipe.sourceUrl) {
          WebBrowser.openBrowserAsync(fetchedRecipe.sourceUrl);
        }
      }
    };

    loadRecipe();
  }, [recipeId, fetchRecipeById, getRecipeById]);

  const handleRegisterMeal = async () => {
    if (!recipe) {
      Alert.alert("오류", "레시피 정보를 찾을 수 없습니다.");
      return;
    }

    // POST /meals API 호출
    const success = await addMeal({
      recipeId: recipe.id,
      foodIds: [],
      quantity: "1인분",
      consumedAt: useDateStore.getState().now.toISOString(),
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
    } else if (mealError) {
      // 에러는 useStoreWithError가 토스트로 표시하므로 여기서는 추가 처리 불필요
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
            contentContainerStyle={styles.contentContainer}
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

                {/* 영양 성분 섹션 */}
                <View style={styles.nutritionSection}>
                  <Text style={styles.sectionTitle}>영양 성분</Text>
                  <View style={styles.nutritionGrid}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>칼로리</Text>
                      <Text style={styles.nutritionValue}>
                        {recipe.calories ?? 0}
                        <Text style={styles.nutritionUnit}> kcal</Text>
                      </Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>단백질</Text>
                      <Text style={styles.nutritionValue}>
                        {recipe.protein ?? 0}
                        <Text style={styles.nutritionUnit}> g</Text>
                      </Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>탄수화물</Text>
                      <Text style={styles.nutritionValue}>
                        {recipe.carbohydrates ?? 0}
                        <Text style={styles.nutritionUnit}> g</Text>
                      </Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>지방</Text>
                      <Text style={styles.nutritionValue}>
                        {recipe.fat ?? 0}
                        <Text style={styles.nutritionUnit}> g</Text>
                      </Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>비타민 C</Text>
                      <Text style={styles.nutritionValue}>
                        {recipe.vitamin_c ?? 0}
                        <Text style={styles.nutritionUnit}> mg</Text>
                      </Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>비타민 D</Text>
                      <Text style={styles.nutritionValue}>
                        {recipe.vitamin_d ?? 0}
                        <Text style={styles.nutritionUnit}> µg</Text>
                      </Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>아연</Text>
                      <Text style={styles.nutritionValue}>
                        {recipe.zinc ?? 0}
                        <Text style={styles.nutritionUnit}> mg</Text>
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 플로팅 버튼을 위한 여백 */}
                <View style={styles.bottomSpacer} />
              </>
            ) : null}
          </ScrollView>

          {/* 플로팅 버튼 */}
          {recipe && (
            <View style={styles.floatingButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.floatingButton,
                  mealLoading && styles.floatingButtonDisabled,
                ]}
                onPress={handleRegisterMeal}
                disabled={mealLoading}
              >
                <Text style={styles.floatingButtonText}>
                  {mealLoading ? "등록 중..." : "식사로 등록하기"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 60, // 뒤로 버튼과 균형을 맞추기 위한 공간
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, // 플로팅 버튼을 위한 여백
  },
  title: {
    fontSize: FontSizes["3xl"],
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 24,
  },
  nutritionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
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
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nutritionLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.text,
  },
  nutritionUnit: {
    fontSize: FontSizes.sm,
    fontWeight: "400",
    color: Colors.textSecondary,
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
  bottomSpacer: {
    height: 20,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingButtonDisabled: {
    opacity: 0.6,
  },
  floatingButtonText: {
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
