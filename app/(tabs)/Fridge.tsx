import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Edit3, Trash2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Modal,
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
import ProfileCircle from "../../src/components/ProfileCircle";
import QuickFoodAdd from "../../src/components/QuickFoodAdd";
import {
  IngredientCategory,
  IngredientCategoryLabel,
} from "../../src/enums/ingredientCategory";
import {
  StorageLocation,
  StorageLocationLabel,
} from "../../src/enums/storageLocation";
import { useAutoLoadData } from "../../src/hooks/useAutoLoadData";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useToggleArray } from "../../src/hooks/useToggleArray";
import { useFridgeStore } from "../../src/stores/useFridgeStore";
import { Colors, FontSizes, commonStyles } from "../../src/styles/common";
import { isExpiringSoon } from "../../src/utils/expiryUtils";

export default function FridgeScreen() {
  const ingredients = useFridgeStore((s) => s.ingredients);
  const loadIngredients = useFridgeStore((s) => s.loadIngredients);
  const isLoading = useFridgeStore((s) => s.isLoading);

  useStoreWithError(useFridgeStore);
  useAutoLoadData(ingredients, isLoading, loadIngredients);

  const [selectedCategories, setSelectedCategories] = useState<
    IngredientCategory[]
  >([]);
  const [selectedStorage, setSelectedStorage] = useState<
    StorageLocation | "ALL"
  >("ALL");

  // 새로 추가된 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    string | null
  >(null);

  // 카테고리 토글 함수
  const toggleCategory = useToggleArray(setSelectedCategories);

  // 현재 보관 위치에 따른 필터링 (useMemo로 최적화)
  const currentStorageIngredients = useMemo(() => {
    return ingredients.filter((ingredient) => {
      return (
        selectedStorage === "ALL" ||
        ingredient.storageLocation === selectedStorage
      );
    });
  }, [ingredients, selectedStorage]);

  // 필터링된 재료 (useMemo로 최적화)
  const filteredIngredients = useMemo(() => {
    return currentStorageIngredients.filter((ingredient) => {
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
  }, [
    currentStorageIngredients,
    selectedCategories,
    searchQuery,
    showExpiringOnly,
  ]);

  // 임박한 재료 개수 계산 (useMemo로 최적화)
  const expiringCount = useMemo(() => {
    return currentStorageIngredients.filter((ingredient) =>
      isExpiringSoon(ingredient.expiryDate)
    ).length;
  }, [currentStorageIngredients]);

  // 재료 선택 토글
  const toggleIngredientSelect = useToggleArray(setSelectedIngredients);

  // 재료 수정 페이지로 이동
  const handleEditIngredient = (ingredientId: string) => {
    setActionModalVisible(false);
    router.push({
      pathname: "/_pages/RegisterFood",
      params: { ingredientId },
    });
  };

  // 재료 삭제 처리
  const handleDeleteIngredient = (ingredientId: string) => {
    setActionModalVisible(false);
    const removeIngredient = useFridgeStore.getState().removeIngredient;
    removeIngredient(ingredientId);
  };

  // 길게 누르기 핸들러
  const handleLongPress = (ingredientId: string) => {
    setSelectedIngredientId(ingredientId);
    setActionModalVisible(true);
  };

  // 재료 카드 클릭 핸들러 (선택 토글)
  const handleIngredientPress = (ingredientId: string) => {
    toggleIngredientSelect(ingredientId);
  };

  // 레시피 검색 버튼 클릭 핸들러
  const handleRecipeSearch = () => {
    if (selectedIngredients.length === 0) return;

    // 선택된 재료 ID를 이름으로 변환
    const selectedIngredientNames = selectedIngredients
      .map((id) => {
        const ingredient = ingredients.find((ing) => ing.id === id);
        return ingredient?.name;
      })
      .filter(Boolean) as string[];

    // Recipe 화면으로 이동하면서 선택된 재료를 파라미터로 전달
    router.push({
      pathname: "/(tabs)/Recipe",
      params: {
        ingredients: JSON.stringify(selectedIngredientNames),
      },
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
              onPress={() => router.push("/_pages/Notifications")}
            >
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
            <ProfileCircle
              size={40}
              onPress={() => router.push("/(tabs)/MyInfo")}
            />
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
                    selectable={true}
                    selected={selectedIngredients.includes(ingredient.id)}
                    onSelect={() => handleIngredientPress(ingredient.id)}
                    onPress={() => handleIngredientPress(ingredient.id)}
                    onLongPress={() => handleLongPress(ingredient.id)}
                    isExpiringSoon={isExpiringSoon(ingredient.expiryDate)}
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
        {selectedIngredients.length > 0 && (
          <TouchableOpacity
            style={styles.recipeButton}
            onPress={handleRecipeSearch}
          >
            <Text style={styles.recipeButtonText}>
              {selectedIngredients.length}개 재료로 레시피 검색
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {selectedIngredients.length === 0 && <QuickFoodAdd />}

      {/* 액션 모달 */}
      <Modal
        visible={actionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActionModalVisible(false)}
        >
          <View style={styles.actionModal}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if (selectedIngredientId) {
                  handleEditIngredient(selectedIngredientId);
                }
              }}
            >
              <Edit3 size={20} color={Colors.primary} strokeWidth={2} />
              <Text style={styles.actionButtonText}>수정</Text>
            </TouchableOpacity>
            <View style={styles.actionDivider} />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if (selectedIngredientId) {
                  handleDeleteIngredient(selectedIngredientId);
                }
              }}
            >
              <Trash2 size={20} color={Colors.error} strokeWidth={2} />
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                삭제
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionModal: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 150,
    ...commonStyles.shadow,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  actionButtonText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  deleteButtonText: {
    color: Colors.error,
  },
  actionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
});
