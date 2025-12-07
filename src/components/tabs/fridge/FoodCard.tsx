import { CheckCircle2, Circle } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  FoodCategory,
  FoodCategoryColor,
} from "../../../enums/ingredientCategory";
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

      {/* 1-2행: 사진과 정보 */}
      <View style={styles.contentRow}>
        {/* 1열: 사진 (2행에 걸침) */}
        <View style={styles.foodCardImageContainer}>
          <Image
            source={getCategoryImage()}
            style={styles.foodCardImage}
            resizeMode="contain"
          />
        </View>

        {/* 2열: 이름과 상세 정보 */}
        <View style={styles.foodCardInfoSection}>
          {/* 1행: 이름 */}
          <View style={styles.nameRow}>
            <Text style={styles.foodCardName} numberOfLines={1}>
              {food.name}
            </Text>
          </View>
          {/* 2행: 개수, 무게, 보관장소 */}
          <Text style={styles.foodCardQuantity}>
            {food.quantity}개 · {food.weight} · {getStorageEmoji()}
          </Text>
        </View>
      </View>

      {/* 3행: 유통기한 */}
      <View style={styles.expiryRow}>
        <Text style={styles.foodCardExpiryDate}>{food.expiryDate}까지</Text>
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
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 2,
    marginBottom: 6,
    flex: 1,
  },
  foodCardImageContainer: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  foodCardImage: {
    width: 50,
    height: "100%",
    borderRadius: 6,
  },
  foodCardInfoSection: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 5,
  },
  expiryRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
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
    marginTop: 4,
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
