import { tabsStyles } from "@/styles/tabs";
import { useMemo, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../styles/common";
import { Recipe } from "../../../types/recipe";
import LoadingSpinner from "../../LoadingSpinner";
import HomeRecipeCard from "./HomeRecipeCard";

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

  // 상위 8개 레시피 데이터
  const data = useMemo<Recipe[]>(() => {
    return recipes.slice(0, 8);
  }, [recipes]);

  const screenWidth = Dimensions.get("window").width;
  const cardHorizontalMargin = 12;
  const sidePadding = 16; // section 좌우 padding과 맞춤
  const cardWidth = (screenWidth - sidePadding * 2) * 0.7; // 카드 가로 길이를 줄임 (70%)
  const cardHeight = 200; // 카드 높이 (이미지만 표시)

  // 카드를 중앙에 배치하기 위한 패딩 계산
  // 첫 번째 카드가 중앙에 오도록 좌측 패딩 설정
  const centerPadding = (screenWidth - cardWidth) / 2 - sidePadding;
  const snapInterval = cardWidth + cardHorizontalMargin;

  // 각 카드가 중앙에 올 때의 오프셋 계산
  const snapOffsets = useMemo(() => {
    return data.map((_, index) => {
      // 첫 번째 카드: centerPadding만큼 오프셋
      // 이후 카드들: 이전 오프셋 + snapInterval
      return centerPadding + index * snapInterval;
    });
  }, [data, centerPadding, snapInterval]);

  if (isLoading && data.length === 0) {
    return (
      <View style={[tabsStyles.section, { marginBottom: 24 }]}>
        <Text style={tabsStyles.sectionTitle}>🍽️ 오늘의 레시피</Text>
        <LoadingSpinner message="레시피를 불러오는 중..." size="small" />
      </View>
    );
  }

  if (error && data.length === 0) {
    return (
      <View style={[tabsStyles.section, { marginBottom: 24 }]}>
        <Text style={tabsStyles.sectionTitle}>🍽️ 오늘의 레시피</Text>
        <Text style={{ color: Colors.textSecondary, textAlign: "center" }}>
          {error}
        </Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={[tabsStyles.section, { marginBottom: 24 }]}>
        <Text style={tabsStyles.sectionTitle}>🍽️ 오늘의 레시피</Text>
        <Text style={{ color: Colors.textSecondary, textAlign: "center" }}>
          추천할 레시피가 없습니다
        </Text>
      </View>
    );
  }

  return (
    <View style={[tabsStyles.section, { marginBottom: 24 }]}>
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
        keyExtractor={(item: Recipe, index: number) =>
          item.id || `recipe-${index}`
        }
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToOffsets={snapOffsets}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: centerPadding,
          paddingRight: centerPadding,
        }}
        onScroll={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          // 가장 가까운 snap offset 찾기
          let closestIndex = 0;
          let minDistance = Math.abs(offsetX - snapOffsets[0]);
          snapOffsets.forEach((offset, index) => {
            const distance = Math.abs(offsetX - offset);
            if (distance < minDistance) {
              minDistance = distance;
              closestIndex = index;
            }
          });
          setCurrentIndex(closestIndex);
        }}
        scrollEventThrottle={16}
        renderItem={({ item }: { item: Recipe }) => (
          <HomeRecipeCard
            recipe={item}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            marginRight={cardHorizontalMargin}
          />
        )}
      />

      {/* 인디케이터 - 양 끝 제외 */}
      {data.length > 0 && (
        <View style={styles.indicatorContainer}>
          {data.map((item, index) => {
            return (
              <View
                key={`indicator-${item.id}-${index}`}
                style={[
                  styles.indicator,
                  index === currentIndex && styles.indicatorActive,
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
