import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Colors, componentsStyles } from "./styles";

interface HeaderProps {
  title: string;
  onSearch?: (text: string) => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export default function Header({
  title,
  onSearch,
  onNotificationPress,
  onProfilePress,
}: HeaderProps) {
  return (
    <View style={componentsStyles.headerContainer}>
      {/* 왼쪽 타이틀 */}
      <Text style={componentsStyles.headerTitle}>{title}</Text>

      {/* 오른쪽 아이콘들 */}
      <View style={componentsStyles.headerRightSection}>
        {/* 검색 버튼 */}
        {onSearch && (
          <TouchableOpacity onPress={() => onSearch("")} style={componentsStyles.headerIconBtn}>
            <Ionicons name="search-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        )}

        {/* 알림 버튼 */}
        <TouchableOpacity onPress={onNotificationPress} style={componentsStyles.headerIconBtn}>
          <Ionicons name="notifications-outline" size={24} color={Colors.text} />
        </TouchableOpacity>

        {/* 프로필 */}
        <TouchableOpacity onPress={onProfilePress}>
          <Image
            source={{ uri: "https://via.placeholder.com/32x32" }}
            style={componentsStyles.headerProfileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}