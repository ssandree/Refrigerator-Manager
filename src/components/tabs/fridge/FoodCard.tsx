import { CheckCircle2, Circle } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FoodCategoryColor } from "../../../enums/ingredientCategory";
import { StorageLocation } from "../../../enums/storageLocation";
import { Colors, FontSizes, commonStyles } from "../../../styles/common";
import { Food } from "../../../types/food";

interface FoodCardProps {
  food: Food;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onPress?: () => void;
  onLongPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isExpiringSoon?: boolean;
}

export default function FoodCard({
  food,
  selectable = false,
  selected = false,
  onSelect,
  onPress,
  onLongPress,
  onEdit,
  onDelete,
  isExpiringSoon = false,
}: FoodCardProps) {
  const getStorageEmoji = () => {
    switch (food.storageLocation) {
      case StorageLocation.FRIDGE:
        return "🧊";
      case StorageLocation.FREEZER:
        return "❄️";
      case StorageLocation.ROOM_TEMP:
        return "🌡️";
      default:
        return "📦";
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.foodCardContainer,
        selectable && selected && styles.selectedCard,
      ]}
      onPress={selectable ? onSelect : onPress}
      onLongPress={onLongPress}
    >
      {/* 카테고리 상단 바 */}
      <View
        style={[
          styles.categoryBar,
          { backgroundColor: FoodCategoryColor[food.category] },
        ]}
      />

      {/* 선택 상태 및 임박 표시 */}
      {(selectable || isExpiringSoon) && (
        <View style={styles.selectionIndicator}>
          {isExpiringSoon && <Text style={styles.expiryWarning}>⚠️</Text>}
          {selectable && (
            <View style={styles.selectionCircle}>
              {selected ? (
                <CheckCircle2
                  size={22}
                  color={Colors.primary}
                  strokeWidth={2.5}
                />
              ) : (
                <Circle
                  size={22}
                  color={Colors.textSecondary}
                  strokeWidth={2}
                />
              )}
            </View>
          )}
        </View>
      )}

      {/* 상단 행: 사진과 저장위치 */}
      <View style={styles.topRow}>
        <View style={styles.foodCardImageContainer}>
          <Image
            source={require("../../../assets/images/tomato.jpg")}
            style={styles.foodCardImage}
          />
        </View>
      </View>

      {/* 하단 행: 재료 정보 */}
      <View style={styles.bottomRow}>
        <View style={styles.foodCardInfoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.foodCardName} numberOfLines={1}>
              {food.name}
            </Text>
          </View>
          <Text style={styles.foodCardQuantity}>
            {food.quantity}개 · {food.weight} · {getStorageEmoji()}
          </Text>
          <Text style={styles.foodCardExpiryDate}>{food.expiryDate}까지</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  foodCardContainer: {
    ...commonStyles.card,
    borderRadius: 6,
    position: "relative",
    marginVertical: 0,
    marginHorizontal: 0,
    overflow: "hidden",
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
    borderTopLeftRadius: 6, // 카드 라운드와 맞추기
    borderTopRightRadius: 6,
  },
  foodCardExpiryBadge: {
    position: "absolute",
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
    fontWeight: "bold",
  },
  topRow: {
    // 사진이랑 아이콘
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 2,
  },
  foodCardImageContainer: {
    position: "relative",
  },
  foodCardImage: {
    width: 35,
    height: 35,
    borderRadius: 6,
    // backgroundColor: Colors.backgroundDark,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flex: 1,
  },
  foodCardInfoSection: {
    flex: 1,
    marginRight: 8,
    justifyContent: "space-between",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  foodCardName: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
  },
  expiryWarning: {
    fontSize: FontSizes.base,
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
  selectedCard: {
    backgroundColor: "#E8F5E9", // 연한 초록색 배경
  },
  selectionIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  selectionCircle: {
    marginLeft: 4,
  },
  storageEmoji: {
    fontSize: FontSizes.lg,
  },
});
