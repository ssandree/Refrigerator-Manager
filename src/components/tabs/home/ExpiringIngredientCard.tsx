import { tabsStyles } from "@/styles/tabs";
import { router } from "expo-router";
import { AlertTriangle, CheckCircle } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  FoodCategory,
  FoodCategoryColor,
} from "../../../enums/ingredientCategory";
import { useDateStore } from "../../../stores/useDateStore";
import { Colors, FontSizes } from "../../../styles/common";
import { Food } from "../../../types/food";
import { parseKoreaDate } from "../../../utils/dateUtils";

interface ExpiringIngredientCardProps {
  food: Food & { daysLeft: number };
}

function ExpiringIngredientCard({ food }: ExpiringIngredientCardProps) {
  const getChipBackgroundColor = (days: number) => {
    if (days <= 1) return Colors.error;
    if (days <= 2) return Colors.warning;
    return Colors.secondary;
  };

  const getChipTextColor = (days: number) => {
    return Colors.textLight;
  };

  const getCategoryImage = () => {
    const categoryImageMap: Record<FoodCategory, any> = {
      [FoodCategory.MEAT]: require("../../../../assets/foods/MEAT.png"),
      [FoodCategory.FISH]: require("../../../../assets/foods/FISH.png"),
      [FoodCategory.VEGETABLE]: require("../../../../assets/foods/VEGETABLE.png"),
      [FoodCategory.FRUIT]: require("../../../../assets/foods/FRUIT.png"),
      [FoodCategory.DAIRY]: require("../../../../assets/foods/DAIRY.png"),
      [FoodCategory.GRAIN]: require("../../../../assets/foods/GRAIN.png"),
      [FoodCategory.SEASONING]: require("../../../../assets/foods/SEASONING.png"),
      [FoodCategory.NOODLE]: require("../../../../assets/foods/NOODLE.png"),
      [FoodCategory.SIDE]: require("../../../../assets/foods/SIDE.png"),
      [FoodCategory.SEAFOOD]: require("../../../../assets/foods/SEAFOOD.png"),
      [FoodCategory.NUT]: require("../../../../assets/foods/NUT.png"),
      [FoodCategory.BREAD]: require("../../../../assets/foods/BREAD.png"),
      [FoodCategory.RICE_CAKE]: require("../../../../assets/foods/RICE_CAKE.png"),
      [FoodCategory.SAUCE]: require("../../../../assets/foods/SAUCE.png"),
      [FoodCategory.FROZEN]: require("../../../../assets/foods/FROZEN.png"),
      [FoodCategory.DRINK]: require("../../../../assets/foods/DRINK.png"),
      [FoodCategory.INSTANT]: require("../../../../assets/foods/INSTANT.png"),
      [FoodCategory.OTHER]: require("../../../../assets/foods/OTHER.png"),
    };
    return (
      categoryImageMap[food.category] ||
      require("../../../../assets/foods/OTHER.png")
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push({
          pathname: "/(tabs)/Recipe",
          params: { q: food.name },
        } as { pathname: string; params?: Record<string, string> });
      }}
    >
      {/* 카테고리 상단 바 */}
      <View
        style={[
          styles.categoryBar,
          { backgroundColor: FoodCategoryColor[food.category] },
        ]}
      />

      {/* 카테고리 이미지 */}
      <View style={styles.imageContainer}>
        <Image
          source={getCategoryImage()}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* 재료 이름 */}
      <Text style={styles.name} numberOfLines={1}>
        {food.name}
      </Text>

      {/* 개수, 무게 */}
      <Text style={styles.quantity}>
        {(() => {
          const parts: string[] = [];
          if (food.quantity !== null && food.quantity !== undefined) {
            parts.push(`${food.quantity}개`);
          }
          if (food.weight !== null && food.weight !== undefined) {
            parts.push(food.weight);
          }
          return parts.length > 0 ? parts.join(" · ") : "정보 없음";
        })()}
      </Text>

      {/* D-x일 칩 */}
      <View
        style={[
          styles.chipContainer,
          { backgroundColor: getChipBackgroundColor(food.daysLeft) },
        ]}
      >
        <AlertTriangle
          size={12}
          color={getChipTextColor(food.daysLeft)}
          strokeWidth={2.5}
        />
        <Text
          style={[styles.chipText, { color: getChipTextColor(food.daysLeft) }]}
        >
          D-{food.daysLeft}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

interface ExpiringIngredientSectionProps {
  ingredients: Food[];
}

export default function ExpiringIngredientSection({
  ingredients,
}: ExpiringIngredientSectionProps) {
  // 한국 시간 기준 오늘 날짜
  const todayISO = useDateStore((state) => state.todayISO);

  // 3일 이하 임박 재료 필터링
  const getExpiringFoods = (): (Food & { daysLeft: number })[] => {
    // 한국 시간 기준으로 오늘 날짜 파싱 (시간은 00:00:00으로 설정)
    const today = parseKoreaDate(todayISO);
    today.setUTCHours(0, 0, 0, 0);

    return ingredients
      .map((food) => {
        const expiryDateStr = food.expiryDate;
        if (!expiryDateStr) {
          return null;
        }

        // 한국 시간 기준으로 유통기한 날짜 파싱 (시간은 00:00:00으로 설정)
        const expiryDate = parseKoreaDate(expiryDateStr);
        expiryDate.setUTCHours(0, 0, 0, 0);

        if (Number.isNaN(expiryDate.getTime())) {
          return null;
        }

        // 날짜 차이 계산 (밀리초를 일로 변환)
        const diffMs = expiryDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return { ...food, daysLeft };
      })
      .filter(
        (
          food
        ): food is Food & {
          daysLeft: number;
        } => !!food && food.daysLeft <= 3 && food.daysLeft >= 0
      );
  };

  const expiringFoods = getExpiringFoods();

  return (
    <View style={[tabsStyles.section, { marginBottom: 24 }]}>
      <Text style={tabsStyles.sectionTitle}>⚠️ 임박 재료</Text>
      <Text style={styles.subtitle}>
        재료를 클릭하면 레시피 검색으로 이동합니다
      </Text>
      {expiringFoods.length === 0 ? (
        <View
          style={{
            padding: 24,
            alignItems: "center",
            backgroundColor: Colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: Colors.borderLight,
          }}
        >
          <CheckCircle size={48} color={Colors.primary} strokeWidth={1.5} />
          <Text
            style={{
              fontSize: FontSizes.base,
              color: Colors.textPrimary,
              marginTop: 12,
              marginBottom: 8,
              fontWeight: "600",
            }}
          >
            모든 재료가 신선합니다! 🎉
          </Text>
          <Text
            style={{
              fontSize: FontSizes.sm,
              color: Colors.textSecondary,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            유통기한이 3일 이내인 재료가 없습니다
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/Fridge")}
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: Colors.surface,
                fontSize: FontSizes.base,
                fontWeight: "600",
              }}
            >
              냉장고 보기
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {expiringFoods.map((food) => (
            <ExpiringIngredientCard key={food.id} food={food} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 12,
  },
  card: {
    width: "31%", // 3열 그리드 (gap 고려)
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 10,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 140,
    marginBottom: 12,
  },
  categoryBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  imageContainer: {
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: "center",
  },
  quantity: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  chipContainer: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    alignSelf: "center",
  },
  chipText: {
    fontSize: 10,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
});
