import { tabsStyles } from "@/styles/tabs";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, createShadowStyle } from "../../../styles/common";
import { Recipe } from "../../../types/recipe";
import LoadingSpinner from "../../LoadingSpinner";

interface RecipeCardData {
  id: string;
  name: string;
  desc: string;
  calories: number;
  time: number;
  owned: string;
  imageUrl: string;
}

interface RecipeRecommandProps {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
}

export default function RecipeRecommand({
  recipes,
  isLoading,
  error,
}: RecipeRecommandProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 상위 8개 레시피 데이터 변환
  const data = useMemo<RecipeCardData[]>(() => {
    return recipes.slice(0, 8).map((recipe: Recipe) => ({
      id: recipe.id,
      name: recipe.recipeName,
      desc: recipe.description || "",
      calories: recipe.calories,
      time: recipe.time ?? 0,
      owned: `${recipe.totalIngredients || 0} 재료`,
      imageUrl: recipe.imageUrl || "",
    }));
  }, [recipes]);

  const screenWidth = Dimensions.get("window").width;
  const cardHorizontalMargin = 12;
  const sidePadding = 16; // section 좌우 padding과 맞춤
  const cardWidth = (screenWidth - sidePadding * 2) * 0.85; // 카드 가로 길이를 줄임 (85%)
  const cardHeight = 280; // 카드 높이 증가

  if (isLoading && data.length === 0) {
    return (
      <View style={tabsStyles.section}>
        <Text style={tabsStyles.sectionTitle}>🍽️ 오늘의 레시피</Text>
        <LoadingSpinner message="레시피를 불러오는 중..." size="small" />
      </View>
    );
  }

  if (error && data.length === 0) {
    return (
      <View style={tabsStyles.section}>
        <Text style={tabsStyles.sectionTitle}>🍽️ 오늘의 레시피</Text>
        <Text style={{ color: Colors.textSecondary, textAlign: "center" }}>
          {error}
        </Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={tabsStyles.section}>
        <Text style={tabsStyles.sectionTitle}>🍽️ 오늘의 레시피</Text>
        <Text style={{ color: Colors.textSecondary, textAlign: "center" }}>
          추천할 레시피가 없습니다
        </Text>
      </View>
    );
  }

  return (
    <View style={tabsStyles.section}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={tabsStyles.sectionTitle}>🍽️ 오늘의 레시피</Text>
        {data.length > 0 && (
          <Text
            style={{
              fontSize: 12,
              color: Colors.textSecondary,
              fontWeight: "500",
            }}
          >
            {currentIndex + 1}/{data.length}
          </Text>
        )}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item: RecipeCardData, index: number) =>
          item.id || `recipe-${index}`
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(
            offsetX / (cardWidth + cardHorizontalMargin)
          );
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
        renderItem={({
          item,
          index,
        }: {
          item: RecipeCardData;
          index: number;
        }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.recipeCard,
              {
                width: cardWidth,
                height: cardHeight,
                marginRight: cardHorizontalMargin,
              },
            ]}
            onPress={() => {
              router.push({
                pathname: "/_pages/RecipeDetail",
                params: { id: item.id, name: item.name },
              });
            }}
          >
            {/* 이미지 영역 */}
            <View style={styles.imageContainer}>
              <Image
                source={require("../../../assets/images/tomato.jpg")}
                style={styles.recipeImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={Colors.primary}
                  />
                  <Text style={styles.badgeText}>{item.owned}</Text>
                </View>
              </View>
            </View>

            {/* 정보 영역 */}
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>{item.name}</Text>
              <Text style={styles.recipeDescription} numberOfLines={2}>
                {item.desc}
              </Text>
              <View style={styles.recipeStats}>
                <View style={styles.statItem}>
                  <Ionicons name="flame" size={18} color={Colors.error} />
                  <Text style={styles.statText}>{item.calories}kcal</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={18} color={Colors.primary} />
                  <Text style={styles.statText}>{item.time}분</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* 인디케이터 */}
      {data.length > 1 && (
        <View style={styles.indicatorContainer}>
          {data.map((item, index) => (
            <View
              key={`indicator-${item.id}-${index}`}
              style={[
                styles.indicator,
                index === currentIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const cardShadow = createShadowStyle({
  opacity: 0.15,
  radius: 8,
  elevation: 8,
});

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: "hidden",
    ...cardShadow,
  },
  imageContainer: {
    width: "100%",
    height: 200, // 재료 보유 태그 영역까지 포함하도록 높이 증가
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  badgeContainer: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    ...cardShadow,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  recipeInfo: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  recipeName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  recipeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  recipeStats: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
  },
  indicatorActive: {
    width: 20,
    backgroundColor: Colors.primary,
  },
});
