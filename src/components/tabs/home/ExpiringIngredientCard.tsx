import { tabsStyles } from "@/styles/tabs";
import { router } from "expo-router";
import { AlertTriangle, Bell, CheckCircle, ChefHat } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SecondaryButton } from "../../../components/Buttons";
import { Food } from "../../../data/mockFood";
import { useFridgeStore } from "../../../stores/useFridgeStore";
import { Colors, commonStyles, FontSizes } from "../../../styles/common";

interface ExpiringIngredientCardProps {
  name: string;
  daysLeft: number;
}

function ExpiringIngredientCard({
  name,
  daysLeft,
}: ExpiringIngredientCardProps) {
  const getChipBackgroundColor = (days: number) => {
    if (days <= 1) return Colors.error;
    if (days <= 2) return Colors.warning;
    return Colors.secondary;
  };

  const getChipTextColor = (days: number) => {
    return Colors.textLight;
  };

  const handleRecipeRecommend = () => {
    router.push({
      pathname: "/(tabs)/Recipe",
      params: { q: name },
    } as { pathname: string; params?: Record<string, string> });
  };

  const handleResetAlert = () => {
    // 알림 재설정 로직 구현 필요
  };

  return (
    <View style={[tabsStyles.expiringItem, commonStyles.card]}>
      {/* 상단: 재료명과 남은 일수 칩 */}
      <View style={styles.headerContainer}>
        <Text style={[tabsStyles.expiringName, styles.ingredientName]}>
          {name}
        </Text>
        <View
          style={[
            styles.chipContainer,
            { backgroundColor: getChipBackgroundColor(daysLeft) },
          ]}
        >
          <AlertTriangle
            size={14}
            color={getChipTextColor(daysLeft)}
            strokeWidth={2.5}
          />
          <Text
            style={[styles.chipText, { color: getChipTextColor(daysLeft) }]}
          >
            D-{daysLeft}
          </Text>
        </View>
      </View>

      {/* 하단: 버튼들 */}
      <View style={styles.buttonContainer}>
        <SecondaryButton
          onPress={handleRecipeRecommend}
          leftIcon={
            <ChefHat size={16} color={Colors.primary} strokeWidth={2} />
          }
        />
        <SecondaryButton
          onPress={handleResetAlert}
          leftIcon={<Bell size={16} color={Colors.secondary} strokeWidth={2} />}
        />
      </View>
    </View>
  );
}

export default function ExpiringIngredientSection() {
  const foods = useFridgeStore((s) => s.foods);

  // 3일 이하 임박 재료 필터링
  const getExpiringFoods = (): (Food & { daysLeft: number })[] => {
    const today = new Date();
    return foods
      .map((food) => {
        const expiryDate = new Date(food.expiryDate);
        const daysLeft = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { ...food, daysLeft };
      })
      .filter((food) => food.daysLeft <= 3 && food.daysLeft >= 0);
  };

  const expiringFoods = getExpiringFoods();

  return (
    <View style={tabsStyles.section}>
      <Text style={tabsStyles.sectionTitle}>⚠️ 임박 재료</Text>
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
        <View style={tabsStyles.expiringContainer}>
          {expiringFoods.map((food) => (
            <ExpiringIngredientCard
              key={food.id}
              name={food.name}
              daysLeft={food.daysLeft}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  chipContainer: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 40,
    justifyContent: "center",
  },
  chipText: {
    fontSize: 10,
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
});
