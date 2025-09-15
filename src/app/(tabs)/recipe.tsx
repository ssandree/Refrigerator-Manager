import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RecipeCard from "../../components/RecipeCard";
import { mockRecipes } from "../../data/mockRecipes";

export default function RecipeScreen() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const searchTags = ["한식", "중식", "일식", "양식", "디저트", "간식", "메인요리", "국물요리"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 태그 필터링된 레시피 목록
  const filteredRecipes = mockRecipes.filter(recipe => {
    if (selectedTags.length === 0) return true;
    return selectedTags.some(tag => recipe.tags.includes(tag));
  });

  return (
    <View style={styles.container}>
      {/* 검색 및 필터 섹션 */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>🔍 레시피 검색</Text>
        
        {/* 태그 필터 */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
        >
          {searchTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                selectedTags.includes(tag) ? styles.tagButtonSelected : styles.tagButtonUnselected
              ]}
              onPress={() => toggleTag(tag)}
            >
              <Text style={[
                styles.tagButtonText,
                selectedTags.includes(tag) ? styles.tagButtonTextSelected : styles.tagButtonTextUnselected
              ]}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 선택된 태그 표시 */}
        {selectedTags.length > 0 && (
          <View style={styles.selectedTagsContainer}>
            <Text style={styles.selectedTagsLabel}>선택된 필터:</Text>
            <View style={styles.selectedTags}>
              {selectedTags.map((tag) => (
                <View key={tag} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => toggleTag(tag)}>
                    <Text style={styles.removeTagText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* 레시피 목록 */}
      <ScrollView style={styles.recipesList}>
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
              onPress={() => setSelectedTags([])}
            >
              <Text style={styles.clearFiltersText}>필터 초기화</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBE8",
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
  tagsContainer: {
    marginBottom: 12,
  },
  tagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagButtonSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  tagButtonUnselected: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  tagButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tagButtonTextSelected: {
    color: "#FFFFFF",
  },
  tagButtonTextUnselected: {
    color: "#666",
  },
  selectedTagsContainer: {
    marginTop: 8,
  },
  selectedTagsLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  selectedTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  selectedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedTagText: {
    fontSize: 12,
    color: "#1976D2",
    marginRight: 4,
  },
  removeTagText: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "bold",
  },
  recipesList: {
    flex: 1,
    paddingTop: 8,
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
