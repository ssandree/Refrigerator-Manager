import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ingredient } from "../data/mockFood";
import { IngredientCategoryColor } from "../enums/ingredientCategory";
import { StorageLocationIcon } from "../enums/storageLocation";

interface FoodCardProps {
  ingredient: Ingredient;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function FoodCard({
  ingredient,
  onPress,
  onEdit,
  onDelete,
}: FoodCardProps) {
  const isExpiringSoon = () => {
    const today = new Date();
    const expiryDate = new Date(ingredient.expiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= ingredient.alertBeforeDays;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* 이미지 */}
      <View style={styles.imageContainer}>
        <Image source={require("../assets/images/tomato.jpg")} style={styles.image} />
        {isExpiringSoon() && (
          <View style={styles.expiryBadge}>
            <Text style={styles.expiryText}>임박</Text>
          </View>
        )}
      </View>

      {/* 정보 섹션 */}
      <View style={styles.infoSection}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {ingredient.name}
          </Text>
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
                <Ionicons name="create-outline" size={16} color="#666" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.quantity}>
            {ingredient.quantity}개 · {ingredient.weight}
          </Text>
          <Text style={styles.expiryDate}>
            유통기한: {ingredient.expiryDate}
          </Text>
        </View>

        <View style={styles.footer}>
          <View
            style={[
              styles.categoryTag,
              { backgroundColor: IngredientCategoryColor[ingredient.category] },
            ]}
          >
            <Text style={styles.categoryText}>{ingredient.category}</Text>
          </View>
          <View style={styles.storageInfo}>
            <Ionicons
              name={StorageLocationIcon[ingredient.storageLocation] as any}
              size={14}
              color="#666"
            />
            <Text style={styles.storageText}>
              {ingredient.storageLocation}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  expiryBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  expiryText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  infoSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
    flex: 1,
    marginRight: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 4,
  },
  actionBtn: {
    padding: 4,
  },
  details: {
    marginBottom: 8,
  },
  quantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: 12,
    color: "#999",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  storageInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  storageText: {
    fontSize: 12,
    color: "#666",
  },
});
