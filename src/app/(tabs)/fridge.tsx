import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FoodCard from "../../components/FoodCard";
import { mockIngredients } from "../../data/mockFood";
import { IngredientCategory, IngredientCategoryLabel } from "../../enums/ingredientCategory";
import { StorageLocation, StorageLocationLabel } from "../../enums/storageLocation";

export default function FridgeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | "ALL">("ALL");
  const [selectedStorage, setSelectedStorage] = useState<StorageLocation>(StorageLocation.FRIDGE);

  // 현재 보관 위치에 따른 재료 필터링
  const currentStorageIngredients = mockIngredients.filter(ingredient => 
    ingredient.storageLocation === selectedStorage
  );

  // 카테고리별 재료 개수 계산
  const getCategoryCount = (category: IngredientCategory) => {
    return currentStorageIngredients.filter(ingredient => ingredient.category === category).length;
  };

  // 재료가 있는 카테고리만 필터링
  const availableCategories = Object.values(IngredientCategory).filter(category => 
    getCategoryCount(category) > 0
  );

  // 카테고리 옵션 (재료가 있는 것만)
  const categoryOptions = [
    { key: "ALL", label: "전체", count: currentStorageIngredients.length },
    ...availableCategories.map(category => ({
      key: category,
      label: IngredientCategoryLabel[category],
      count: getCategoryCount(category)
    }))
  ];

  // 카테고리 필터링된 재료 목록
  const filteredIngredients = currentStorageIngredients.filter(ingredient => {
    return selectedCategory === "ALL" || ingredient.category === selectedCategory;
  });

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>냉장고</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={require("../../assets/images/tomato.jpg")} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 보관 위치 탭 */}
      <View style={styles.storageTabs}>
        {Object.values(StorageLocation).map((storage) => {
          const count = mockIngredients.filter(ingredient => ingredient.storageLocation === storage).length;
          return (
            <TouchableOpacity
              key={storage}
              style={[
                styles.storageTab,
                selectedStorage === storage && styles.storageTabActive
              ]}
              onPress={() => setSelectedStorage(storage)}
            >
              <Text style={[
                styles.storageTabText,
                selectedStorage === storage && styles.storageTabTextActive
              ]}>
                {StorageLocationLabel[storage]} {count}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 카테고리 섹션 */}
      <View style={styles.categorySection}>
        <Text style={styles.categoryTitle}>카테고리</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
          contentContainerStyle={styles.categoryFilterContent}
        >
          {categoryOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.categoryButton,
                selectedCategory === option.key && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(option.key as IngredientCategory | "ALL")}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === option.key && styles.categoryButtonTextActive
              ]}>
                {option.label} {option.count}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 재료 목록 */}
      <ScrollView style={styles.ingredientsList} contentContainerStyle={styles.ingredientsGrid}>
        {filteredIngredients.length > 0 ? (
          filteredIngredients.map((ingredient) => (
            <View key={ingredient.id} style={styles.foodCardContainer}>
              <FoodCard
                ingredient={ingredient}
                onPress={() => console.log("재료 클릭:", ingredient.name)}
                onEdit={() => console.log("재료 수정:", ingredient.name)}
                onDelete={() => console.log("재료 삭제:", ingredient.name)}
              />
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {selectedCategory === "ALL" 
                ? `${StorageLocationLabel[selectedStorage]}에 재료가 없습니다.`
                : `${IngredientCategoryLabel[selectedCategory]} 재료가 없습니다.`
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 추가 버튼 */}
      <TouchableOpacity style={styles.addButton}  onPress={() => router.push("../screens/fridgeRegister")}>
        <Text style={styles.addButtonText}>+ 재료 추가</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBE8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationButton: {
    padding: 8,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  storageTabs: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  storageTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  storageTabActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  storageTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  storageTabTextActive: {
    color: "#FFFFFF",
  },
  categorySection: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoryFilter: {
    maxHeight: 50,
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  categoryButtonTextActive: {
    color: "#FFFFFF",
  },
  ingredientsList: {
    flex: 1,
    paddingTop: 8,
  },
  ingredientsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  foodCardContainer: {
    width: "50%",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
