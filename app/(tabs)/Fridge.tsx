import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FoodCard from "../../src/components/FoodCard";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import QuickFoodAdd from "../../src/components/QuickFoodAdd";
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

export default function FridgeScreen() {
  const ingredients = useFridgeStore((s) => s.ingredients);
  const loadIngredients = useFridgeStore((s) => s.loadIngredients);
  const isLoading = useFridgeStore((s) => s.isLoading);
  const fridgeStore = useFridgeStore((s) => ({
    error: s.error,
    clearError: s.clearError,
  }));

  useStoreError(fridgeStore);

  useEffect(() => {
    if (ingredients.length === 0 && !isLoading) {
      loadIngredients(false);
    }
  }, [ingredients.length, isLoading, loadIngredients]);

  const [selectedCategories, setSelectedCategories] = useState<
    IngredientCategory[]
  >([]);
  const [selectedStorage, setSelectedStorage] = useState<
    StorageLocation | "ALL"
  >("ALL");

  // 새로 추가된 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);
  const [recipeMode, setRecipeMode] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);

  // 유통기한 임박 확인 함수 (7일 이내)
  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const date = new Date(expiryDate);
    const diff = (date.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diff <= 7;
  };

  // 현재 보관 위치에 따른 필터링
  const currentStorageIngredients = ingredients.filter((ingredient) => {
    return (
      selectedStorage === "ALL" ||
      ingredient.storageLocation === selectedStorage
    );
  });

  // 카테고리 토글 함수
  const toggleCategory = (category: IngredientCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // 필터링된 재료
  const filteredIngredients = currentStorageIngredients.filter((ingredient) => {
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(ingredient.category);
    const matchSearch = ingredient.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchExpiry =
      !showExpiringOnly || isExpiringSoon(ingredient.expiryDate);
    return matchCategory && matchSearch && matchExpiry;
  });

  // 임박한 재료 개수 계산
  const expiringCount = currentStorageIngredients.filter((ingredient) =>
    isExpiringSoon(ingredient.expiryDate)
  ).length;

  // 재료 선택 토글
  const toggleIngredientSelect = (id: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 재료 수정 페이지로 이동
  const handleEditIngredient = (ingredientId: string) => {
    router.push({
      pathname: "../../_pages/EditFood",
      params: { ingredientId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>냉장고</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setRecipeMode(!recipeMode)}
            >
              <Ionicons
                name={recipeMode ? "close-circle" : "restaurant"}
                size={24}
                color={recipeMode ? Colors.primary : "#333"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={require("../../src/assets/images/tomato.jpg")}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 검색 & 필터 */}
        <View style={styles.filterBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="재료 검색"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={[
              styles.filterButton,
              showExpiringOnly && styles.filterButtonActive,
            ]}
            onPress={() => setShowExpiringOnly(!showExpiringOnly)}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={showExpiringOnly ? "#fff" : "#333"}
            />
            <Text
              style={[
                styles.filterButtonText,
                showExpiringOnly && styles.filterButtonTextActive,
              ]}
            >
              임박 {expiringCount > 0 && `(${expiringCount})`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 보관 위치 탭 */}
        <View style={styles.storageTabs}>
          {["ALL", ...Object.values(StorageLocation)].map((storage) => {
            const count =
              storage === "ALL"
                ? ingredients.length
                : ingredients.filter((i) => i.storageLocation === storage)
                    .length;
            return (
              <TouchableOpacity
                key={storage}
                style={[
                  styles.storageTab,
                  selectedStorage === storage && styles.storageTabActive,
                ]}
                onPress={() =>
                  setSelectedStorage(storage as StorageLocation | "ALL")
                }
              >
                <Text
                  style={[
                    styles.storageTabText,
                    selectedStorage === storage && styles.storageTabTextActive,
                  ]}
                >
                  {storage === "ALL"
                    ? "전체"
                    : StorageLocationLabel[storage as StorageLocation]}{" "}
                  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 카테고리 섹션 */}
        <View style={styles.categoryFilter}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => setIsCategoryExpanded(!isCategoryExpanded)}
          >
            <Text style={styles.categoryHeaderText}>
              카테고리{" "}
              {selectedCategories.length > 0 &&
                `(${selectedCategories.length}개 선택)`}
            </Text>
            <Ionicons
              name={isCategoryExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          {isCategoryExpanded && (
            <View style={styles.categoryTextContainer}>
              {Object.values(IngredientCategory).map((category, index) => (
                <React.Fragment key={category}>
                  <TouchableOpacity onPress={() => toggleCategory(category)}>
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategories.includes(category) &&
                          styles.categoryTextSelected,
                      ]}
                    >
                      {IngredientCategoryLabel[category]}
                    </Text>
                  </TouchableOpacity>
                  {index < Object.values(IngredientCategory).length - 1 && (
                    <Text style={styles.categorySeparator}>|</Text>
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        {/* 재료 목록 */}
        {isLoading ? (
          <LoadingSpinner message="재료를 불러오는 중..." fullScreen />
        ) : (
          <ScrollView
            style={styles.ingredientsList}
            contentContainerStyle={styles.ingredientsGrid}
          >
            {filteredIngredients.length > 0 ? (
              filteredIngredients.map((ingredient) => (
                <View key={ingredient.id} style={styles.foodCardContainer}>
                  <FoodCard
                    ingredient={ingredient}
                    selectable={recipeMode} // FoodCard에 selectable prop 추가 필요
                    selected={selectedIngredients.includes(ingredient.id)}
                    onSelect={() => toggleIngredientSelect(ingredient.id)}
                    onPress={() => console.log("재료 클릭:", ingredient.name)}
                    onEdit={() => handleEditIngredient(ingredient.id)}
                    onDelete={() => console.log("재료 삭제:", ingredient.name)}
                  />
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>재료가 없습니다.</Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* 레시피 검색 버튼 */}
        {recipeMode && selectedIngredients.length > 0 && (
          <TouchableOpacity
            style={styles.recipeButton}
            onPress={() => console.log("레시피 검색:", selectedIngredients)}
          >
            <Text style={styles.recipeButtonText}>
              {selectedIngredients.length}개 재료로 레시피 검색
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {!(recipeMode && selectedIngredients.length > 0) && <QuickFoodAdd />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconButton: { padding: 8 },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  profileImage: { width: "100%", height: "100%" },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  filterButtonTextActive: { color: "#fff" },
  storageTabs: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  storageTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 4,
    borderBottomColor: "transparent",
  },
  storageTabActive: { borderBottomColor: Colors.primary },
  storageTabText: {
    fontSize: FontSizes.base,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  storageTabTextActive: { color: Colors.primary, fontWeight: "600" },
  categoryFilter: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryHeaderText: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  categoryTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  categoryText: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    fontWeight: "400",
    paddingVertical: 4,
  },
  categoryTextSelected: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  categorySeparator: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginHorizontal: 8,
  },
  ingredientsList: { flex: 1, paddingTop: 8 },
  ingredientsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  foodCardContainer: { width: "48%", marginBottom: 12 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: FontSizes.lg,
    color: Colors.textTertiary,
    textAlign: "center",
  },
  recipeButton: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: "center",
  },
  recipeButtonText: {
    color: "#fff",
    fontSize: FontSizes.lg,
    fontWeight: "bold",
  },
});
