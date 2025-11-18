import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, createShadowStyle } from "../../../styles/common";
import { tabsStyles } from "../../../styles/tabs";
import { showInfoToast } from "../../../utils/toast";

const menuCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

export default function SettingsMenu() {
  const handleNotificationPress = () => {
    showInfoToast({
      message: "기능이 준비중입니다",
      description: "알림 설정 기능은 곧 제공될 예정입니다.",
    });
  };

  return (
    <View style={tabsStyles.section}>
      <Text style={tabsStyles.sectionTitle}>⚙️ 설정</Text>
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleNotificationPress}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={Colors.textSecondary}
          />
          <Text style={styles.menuText}>알림 설정</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={Colors.textTertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="help-circle-outline"
            size={20}
            color={Colors.textSecondary}
          />
          <Text style={styles.menuText}>도움말</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={Colors.textTertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={Colors.textSecondary}
          />
          <Text style={styles.menuText}>앱 정보</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={Colors.textTertiary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    ...menuCardShadow,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
});
