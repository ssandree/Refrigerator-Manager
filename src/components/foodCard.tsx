import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ingredient } from "../data/mockFood";
import { IngredientCategoryColor } from "../enums/ingredientCategory";
import { StorageLocationIcon } from "../enums/storageLocation";
import { Colors, FontSizes, commonStyles } from '../styles/common';
interface FoodCardProps {
  ingredient: Ingredient;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FoodCard({
  ingredient,
  selectable = false,
  selected = false,
  onSelect,
  onPress,
  onEdit,
  onDelete,
}: FoodCardProps) {

  // 유통기한 임박 확인 함수 (7일 이내)
  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const date = new Date(expiryDate);
    const diff = (date.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diff <= 7; 
  };

  const expiringSoon = isExpiringSoon(ingredient.expiryDate);

  return (
    <TouchableOpacity 
      style={[
        styles.foodCardContainer,
        selectable && selected && styles.selectedCard
      ]} 
      onPress={selectable ? onSelect : onPress}
    >
      {/* 카테고리 상단 바 */}
      <View
        style={[
          styles.categoryBar,
          { backgroundColor: IngredientCategoryColor[ingredient.category] },
        ]}
      />
      
      {/* 유통기한 임박 표시 테두리 */}
      {expiringSoon && (
        <View style={styles.expiryBorder} />
      )}
      
      {/* 선택 상태 표시 */}
      {selectable && (
        <View style={styles.selectionIndicator}>
          <Ionicons 
            name={selected ? "checkmark-circle" : "ellipse-outline"} 
            size={20} 
            color={selected ? Colors.primary[500] : Colors.textSecondary} 
          />
        </View>
      )}

      {/* 상단 행: 사진과 저장위치 */}
      <View style={styles.topRow}>
        <View style={styles.foodCardImageContainer}>
          <Image source={require("../assets/images/tomato.jpg")} style={styles.foodCardImage} />
        </View>
        <View style={styles.storageIconContainer}>
          <Ionicons
            name={StorageLocationIcon[ingredient.storageLocation] as any}
            size={16}
            color={Colors.textSecondary}
          />
        </View>
      </View>

      {/* 하단 행: 재료 정보와 액션 버튼들 */}
      <View style={styles.bottomRow}>
        <View style={styles.foodCardInfoSection}>
          <Text style={styles.foodCardName} numberOfLines={1}>
            {ingredient.name}
          </Text>
          <Text style={styles.foodCardQuantity}>
            {ingredient.quantity}개 · {ingredient.weight}
          </Text>
          <Text style={styles.foodCardExpiryDate}>
            {ingredient.expiryDate}까지
          </Text>
        </View>
        <View style={styles.foodCardActions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.foodCardActionBtn}>
              <Ionicons name="create-outline" size={12} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.foodCardActionBtn}>
              <Ionicons name="trash-outline" size={12} color={Colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  foodCardContainer: {
    ...commonStyles.card,
    position: 'relative',
    marginVertical: 0,
    marginHorizontal: 0,
    overflow: 'hidden',
    padding: 12,
    height: 120,
    minHeight: 120,
    maxHeight: 120,
  },
  categoryBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6, // 바 두께 (원하는 만큼 조정 가능)
    borderTopLeftRadius: 8,  // 카드 라운드와 맞추기
    borderTopRightRadius: 8,
  },
  expiryBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: Colors.warning,
    borderRadius: 8,
    pointerEvents: "none",
  },
  foodCardExpiryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  foodCardExpiryText: {
    color: Colors.surface,
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  topRow: { // 사진이랑 아이콘
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 2,
  },
  foodCardImageContainer: {
    position: 'relative',
  },
  foodCardImage: {
    width: 35,
    height: 35,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
  },
  storageIconContainer: {
    padding: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
  },
  foodCardInfoSection: {
    flex: 1,
    marginRight: 8,
    justifyContent: 'space-between',
  },
  foodCardName: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  foodCardQuantity: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 1,
  },
  foodCardExpiryDate: {
    fontSize: FontSizes.xs,
    color: Colors.textTertiary,
  },
  foodCardActions: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  foodCardActionBtn: {
    padding: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  selectionIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 3,
  },
});
