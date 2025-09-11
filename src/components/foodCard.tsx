import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ingredient } from "../data/mockFood";
import { IngredientCategoryColor } from "../enums/ingredientCategory";
import { StorageLocationIcon } from "../enums/storageLocation";
import { Colors, componentsStyles } from './styles';
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
    <TouchableOpacity style={componentsStyles.foodCardContainer} onPress={onPress}>
      {/* 이미지 */}
      <View style={componentsStyles.foodCardImageContainer}>
        <Image source={require("../assets/images/tomato.jpg")} style={componentsStyles.foodCardImage} />
        {isExpiringSoon() && (
          <View style={componentsStyles.foodCardExpiryBadge}>
            <Text style={componentsStyles.foodCardExpiryText}>임박</Text>
          </View>
        )}
      </View>

      {/* 정보 섹션 */}
      <View style={componentsStyles.foodCardInfoSection}>
        <View style={componentsStyles.foodCardHeader}>
          <Text style={componentsStyles.foodCardName} numberOfLines={1}>
            {ingredient.name}
          </Text>
          <View style={componentsStyles.foodCardActions}>
            {onEdit && (
              <TouchableOpacity onPress={onEdit} style={componentsStyles.foodCardActionBtn}>
                <Ionicons name="create-outline" size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={componentsStyles.foodCardActionBtn}>
                <Ionicons name="trash-outline" size={16} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={componentsStyles.foodCardDetails}>
          <Text style={componentsStyles.foodCardQuantity}>
            {ingredient.quantity}개 · {ingredient.weight}
          </Text>
          <Text style={componentsStyles.foodCardExpiryDate}>
            유통기한: {ingredient.expiryDate}
          </Text>
        </View>

        <View style={componentsStyles.foodCardFooter}>
          <View
            style={[
              componentsStyles.foodCardCategoryTag,
              { backgroundColor: IngredientCategoryColor[ingredient.category] },
            ]}
          >
            <Text style={componentsStyles.foodCardCategoryText}>{ingredient.category}</Text>
          </View>
          <View style={componentsStyles.foodCardStorageInfo}>
            <Ionicons
              name={StorageLocationIcon[ingredient.storageLocation] as any}
              size={14}
              color={Colors.textSecondary}
            />
            <Text style={componentsStyles.foodCardStorageText}>
              {ingredient.storageLocation}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

