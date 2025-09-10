import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    <View style={styles.container}>
      {/* 왼쪽 타이틀 */}
      <Text style={styles.title}>{title}</Text>

      {/* 오른쪽 아이콘들 */}
      <View style={styles.rightSection}>
        {/* 검색 버튼 */}
        {onSearch && (
          <TouchableOpacity onPress={() => onSearch("")} style={styles.iconBtn}>
            <Ionicons name="search-outline" size={24} color="#2D2D2D" />
          </TouchableOpacity>
        )}

        {/* 알림 버튼 */}
        <TouchableOpacity onPress={onNotificationPress} style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={24} color="#2D2D2D" />
        </TouchableOpacity>

        {/* 프로필 */}
        <TouchableOpacity onPress={onProfilePress}>
          <Image
            source={{ uri: "https://via.placeholder.com/32x32" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#D5ECB0", // 연한 녹색
    borderBottomWidth: 1,
    borderBottomColor: "#B8D4A0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D2D2D",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconBtn: {
    padding: 5,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});