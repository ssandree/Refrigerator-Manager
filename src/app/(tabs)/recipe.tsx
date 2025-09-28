import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import RecipeCard from "../../components/RecipeCard";
import RecipeResearch from "../../components/RecipeResearch";
import { mockRecipes } from "../../data/mockRecipes";
import { Colors } from "../../styles/common";

export default function RecipeScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [slideAnim] = useState(new Animated.Value(Dimensions.get('window').height));
  
  // 상세 필터 상태
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [includeExpiring, setIncludeExpiring] = useState<boolean>(false);
  const [selectedCookingTimes, setSelectedCookingTimes] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [calorieRange, setCalorieRange] = useState<[number, number]>([0, 1000]);


  // 모달 애니메이션 함수들
  const showModal = () => {
    setShowFilterModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowFilterModal(false);
    });
  };

  // 재료 토글 함수
  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  // 요리 시간 토글 함수
  const toggleCookingTime = (time: string) => {
    setSelectedCookingTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  // 난이도 토글 함수
  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  // 필터 초기화
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedIngredients([]);
    setIncludeExpiring(false);
    setSelectedCookingTimes([]);
    setSelectedDifficulties([]);
    setCalorieRange([0, 1000]);
  };

  // 필터링된 레시피 목록
  const filteredRecipes = mockRecipes.filter(recipe => {
    // 검색어 필터
    if (searchQuery && !recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 재료 필터 (tags를 통해 간접적으로 필터링)
    if (selectedIngredients.length > 0) {
      const hasRequiredIngredient = selectedIngredients.some(ingredient => 
        recipe.tags.some(tag => tag.toLowerCase().includes(ingredient.toLowerCase()))
      );
      if (!hasRequiredIngredient) return false;
    }

    // 마감기한 임박 재료 포함 여부 (임시로 모든 레시피가 해당한다고 가정)
    if (includeExpiring) {
      // 실제로는 냉장고 데이터와 연동해야 함
    }

    // 요리 시간 필터
    if (selectedCookingTimes.length > 0) {
      const matchesTime = selectedCookingTimes.some(time => {
        const timeCategory = time.split(" ")[0];
        if (timeCategory === "짧음" && recipe.time <= 30) return true;
        if (timeCategory === "중간" && recipe.time > 30 && recipe.time <= 60) return true;
        if (timeCategory === "긴" && recipe.time > 60) return true;
        return false;
      });
      if (!matchesTime) return false;
    }

    // 난이도 필터
    if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(recipe.difficulty)) {
      return false;
    }

    // 열량 필터 (임시로 모든 레시피가 해당한다고 가정)
    if (recipe.calories < calorieRange[0] || recipe.calories > calorieRange[1]) {
      return false;
    }

    return true;
  });


  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>레시피</Text>
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

      {/* 검색 및 필터 섹션 */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>🔍 레시피 검색</Text>
        
        {/* 검색창 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="레시피 이름으로 검색..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        {/* 선택된 필터 조건 캐러셀 */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsContainer}
          contentContainerStyle={styles.filterChipsContent}
        >
          {/* 재료 필터 칩 */}
          {selectedIngredients.length > 0 && (
            <TouchableOpacity 
              style={styles.filterChip} 
              onPress={showModal}
            >
              <Text style={styles.filterChipText}>
                🥬 재료 {selectedIngredients.length}개
              </Text>
            </TouchableOpacity>
          )}

          {/* 요리 시간 필터 칩 */}
          {selectedCookingTimes.length > 0 && (
            <TouchableOpacity 
              style={styles.filterChip} 
              onPress={showModal}
            >
              <Text style={styles.filterChipText}>
                ⏰ {selectedCookingTimes.map(time => time.split(" ")[0]).join(", ")}
              </Text>
            </TouchableOpacity>
          )}

          {/* 난이도 필터 칩 */}
          {selectedDifficulties.length > 0 && (
            <TouchableOpacity 
              style={styles.filterChip} 
              onPress={showModal}
            >
              <Text style={styles.filterChipText}>
                🎯 {selectedDifficulties.join(", ")}
              </Text>
            </TouchableOpacity>
          )}

          {/* 열량 필터 칩 */}
          {(calorieRange[0] > 0 || calorieRange[1] < 1000) && (
            <TouchableOpacity 
              style={styles.filterChip} 
              onPress={showModal}
            >
              <Text style={styles.filterChipText}>
                🔥 {calorieRange[0]}-{calorieRange[1]}kcal
              </Text>
            </TouchableOpacity>
          )}

          {/* 임박재료 필터 칩 */}
          {includeExpiring && (
            <TouchableOpacity 
              style={styles.filterChip} 
              onPress={showModal}
            >
              <Text style={styles.filterChipText}>
                ⚠️ 임박재료
              </Text>
            </TouchableOpacity>
          )}

          {/* 상세 필터 설정 버튼 */}
          <TouchableOpacity style={styles.addFilterButton} onPress={showModal}>
            <Text style={styles.addFilterButtonText}>+ 필터 추가</Text>
          </TouchableOpacity>
        </ScrollView>


      </View>

      {/* 레시피 목록 */}
      <ScrollView style={styles.recipesList} contentContainerStyle={styles.recipesListContent}>
        <Text style={styles.resultsCount}>
          {filteredRecipes.length}개의 레시피를 찾았습니다
        </Text>
        
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onPress={() => console.log("레시피 클릭:", recipe.recipeName)}
            onFavoriteToggle={() => console.log("즐겨찾기 토글:", recipe.recipeName)}
          />
        ))}

        {filteredRecipes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              선택한 조건에 맞는 레시피가 없습니다.
            </Text>
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={clearAllFilters}
            >
              <Text style={styles.clearFiltersText}>필터 초기화</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 상세 필터 모달 */}
      <RecipeResearch
        visible={showFilterModal}
        onClose={hideModal}
        slideAnim={slideAnim}
        selectedIngredients={selectedIngredients}
        onToggleIngredient={toggleIngredient}
        includeExpiring={includeExpiring}
        onToggleExpiring={() => setIncludeExpiring(!includeExpiring)}
        selectedCookingTimes={selectedCookingTimes}
        onToggleCookingTime={toggleCookingTime}
        selectedDifficulties={selectedDifficulties}
        onToggleDifficulty={toggleDifficulty}
        calorieRange={calorieRange}
        onSetCalorieRange={setCalorieRange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // 헤더
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
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
  filterSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 12,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterChipsContainer: {
    marginBottom: 12,
  },
  filterChipsContent: {
    paddingHorizontal: 4,
    alignItems: "center",
  },
  filterChip: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  filterChipText: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "500",
  },
  addFilterButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#388E3C",
  },
  addFilterButtonText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  recipesList: {
    flex: 1,
    paddingTop: 8,
  },
  recipesListContent: {
    paddingBottom: 20, // 하단 여백
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    marginBottom: 16,
  },
  clearFiltersButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
