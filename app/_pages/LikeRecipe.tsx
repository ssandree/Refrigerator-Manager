import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import RecipeCard from "../../src/components/tabs/recipe/RecipeCard";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useFavoriteRecipeStore } from "../../src/stores/useFavoriteRecipeStore";
import { Colors, FontSizes } from "../../src/styles/common";
import { Recipe } from "../../src/types/recipe";

export default function LikeRecipe() {
  const favoriteRecipes = useFavoriteRecipeStore(
    (state) => state.favoriteRecipes
  );
  const isLoading = useFavoriteRecipeStore((state) => state.isLoading);
  const loadFavorites = useFavoriteRecipeStore((state) => state.loadFavorites);
  const toggleFavorite = useFavoriteRecipeStore(
    (state) => state.toggleFavorite
  );
  const [refreshing, setRefreshing] = useState(false);

  useStoreWithError(useFavoriteRecipeStore);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadFavorites(true);
    } finally {
      setRefreshing(false);
    }
  }, [loadFavorites]);

  useEffect(() => {
    loadFavorites(true);
  }, [loadFavorites]);

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onPress={() => {
        router.push({
          pathname: "/_pages/RecipeDetail",
          params: { id: item.id, name: item.recipeName },
        });
      }}
      onFavoriteToggle={async () => {
        await toggleFavorite(item);
        await loadFavorites(true);
      }}
    />
  );

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
                  router.replace("/(tabs)/MyInfo");
                }
              }}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>좋아요한 레시피</Text>
            <View style={styles.headerRight} />
          </View>

          {/* 좋아요한 레시피 리스트 */}
          {isLoading && favoriteRecipes.length === 0 ? (
            <LoadingSpinner
              message="좋아요한 레시피를 불러오는 중..."
              fullScreen
            />
          ) : favoriteRecipes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                아직 좋아요한 레시피가 없어요
              </Text>
              <Text style={styles.emptyDescription}>
                레시피를 둘러보고 마음에 드는 레시피에 하트를 눌러보세요!
              </Text>
            </View>
          ) : (
            <FlatList
              data={favoriteRecipes}
              renderItem={renderRecipeCard}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
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
    width: 40, // 뒤로 버튼과 균형을 맞추기 위한 공간
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
