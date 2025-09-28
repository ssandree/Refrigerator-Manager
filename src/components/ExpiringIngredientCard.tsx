import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { tabsStyles } from "../app/(tabs)/styles";
import { Ingredient, mockIngredients } from "../data/mockFood";
import { Colors } from "../styles/common";

interface ExpiringIngredientCardProps {
  name: string;
  daysLeft: number;
}

function ExpiringIngredientCard({ name, daysLeft }: ExpiringIngredientCardProps) {

  const getChipBackgroundColor = (days: number) => {
    if (days <= 1) return Colors.error;
    if (days <= 2) return Colors.warning;
    return Colors.secondary[500];
  };

  const getChipTextColor = (days: number) => {
    return "#FFFFFF";
  };

  const handleRecipeRecommend = () => {
    console.log(`${name}을 사용한 레시피 추천`);
    // TODO: 레시피 추천 로직 구현
  };

  const handleResetAlert = () => {
    console.log(`${name} 알림 재설정`);
    // TODO: 알림 재설정 로직 구현
  };

  return (
    <View style={[tabsStyles.expiringItem, styles.cardContainer]}>
      {/* 상단: 재료명과 남은 일수 칩 */}
      <View style={styles.headerContainer}>
        <Text style={[tabsStyles.expiringName, styles.ingredientName]}>
          {name}
        </Text>
        <View style={[styles.chipContainer, { backgroundColor: getChipBackgroundColor(daysLeft) }]}>
          <Ionicons 
            name="warning" 
            size={14} 
            color={getChipTextColor(daysLeft)} 
            style={styles.chipIcon}
          />
          <Text style={[styles.chipText, { color: getChipTextColor(daysLeft) }]}>
            D-{daysLeft}
          </Text>
        </View>
      </View>

      {/* 하단: 버튼들 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleRecipeRecommend}
        >
          <Ionicons name="restaurant-outline" size={16} color={Colors.primary[600]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleResetAlert}
        >
          <Ionicons name="notifications-outline" size={16} color={Colors.secondary[600]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ExpiringIngredientSection() {
  // 3일 이하 임박 재료 필터링
  const getExpiringIngredients = (): (Ingredient & { daysLeft: number })[] => {
    const today = new Date();
    return mockIngredients
      .map((ingredient) => {
        const expiryDate = new Date(ingredient.expiryDate);
        const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return { ...ingredient, daysLeft };
      })
      .filter((ingredient) => ingredient.daysLeft <= 3 && ingredient.daysLeft >= 0);
  };

  const expiringIngredients = getExpiringIngredients();

  if (expiringIngredients.length === 0) {
    return null;
  }

  return (
    <View style={tabsStyles.section}>
      <Text style={tabsStyles.sectionTitle}>⚠️ 임박 재료</Text>
      <View style={tabsStyles.expiringContainer}>
        {expiringIngredients.map((ingredient) => (
          <ExpiringIngredientCard
            key={ingredient.id}
            name={ingredient.name}
            daysLeft={ingredient.daysLeft}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 12,
  },
  chipContainer: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 40,
    justifyContent: 'center',
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 6,
  },
});
