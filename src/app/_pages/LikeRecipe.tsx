import { router, Stack } from "expo-router";
import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RecipeCard from "../../components/RecipeCard";
import { useFavoriteRecipeStore } from "../../stores/useFavoriteRecipeStore";
import { Colors, FontSizes } from "../../styles/common";

export default function LikeRecipe() {
  const favoriteRecipes = useFavoriteRecipeStore(
    (state) => state.favoriteRecipes
  );

  const renderRecipeCard = ({ item }: { item: any }) => (
    <RecipeCard
      recipe={item}
      onPress={() => {
        router.push({
          pathname: "/_pages/RecipeDetail",
          params: { id: item.id, name: item.recipeName },
        });
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
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← 뒤로</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>좋아요한 레시피</Text>
            <View style={styles.headerRight} />
          </View>

          {/* 좋아요한 레시피 리스트 */}
          {favoriteRecipes.length === 0 ? (
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
