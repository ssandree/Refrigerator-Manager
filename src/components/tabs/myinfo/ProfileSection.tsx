import { ChevronRight, Heart, Trophy, User } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../../styles/common";

interface ProfileSectionProps {
  onLikeRecipePress: () => void;
  onBadgePress?: () => void;
}

export default function ProfileSection({
  onLikeRecipePress,
  onBadgePress,
}: ProfileSectionProps) {
  return (
    <View
      style={[
        styles.profileSection,
        {
          backgroundColor: Colors.surface,
          borderBottomColor: Colors.border,
        },
      ]}
    >
      <View style={styles.userInfo}>
        <View
          style={[
            styles.profileImageContainer,
            { backgroundColor: Colors.borderLight },
          ]}
        >
          <User size={40} color={Colors.textSecondary} strokeWidth={2} />
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>사용자</Text>
          <Text style={styles.userEmail}>user@example.com</Text>
        </View>
      </View>

      <View style={styles.profileMenu}>
        <TouchableOpacity
          style={styles.profileMenuItem}
          onPress={onLikeRecipePress}
        >
          <Heart size={20} color={Colors.textSecondary} strokeWidth={2} />
          <Text style={styles.profileMenuText}>즐겨찾기 레시피</Text>
          <ChevronRight size={16} color={Colors.textTertiary} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileMenuItem} onPress={onBadgePress}>
          <Trophy size={20} color={Colors.textSecondary} strokeWidth={2} />
          <Text style={styles.profileMenuText}>주간 목표</Text>
          <ChevronRight size={16} color={Colors.textTertiary} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: Colors.surface,
    flexDirection: "column",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: "flex-start",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.borderLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  profileMenu: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginLeft: 0,
  },
  profileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  profileMenuText: {
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
  },
});
