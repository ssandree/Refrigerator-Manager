import { useRouter } from "expo-router";
import { Settings } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GoalsSection from "../../src/components/tabs/myinfo/GoalsSection";
import HealthGoalStats from "../../src/components/tabs/myinfo/HealthGoalStats";
import ProfileSection from "../../src/components/tabs/myinfo/ProfileSection";
import StatsSection from "../../src/components/tabs/myinfo/StatsSection";
import { Colors, FontSizes, commonStyles } from "../../src/styles/common";
import { tabsStyles } from "../../src/styles/tabs";
import UpdateHealthGoal from "../_pages/UpdateHealthGoal";

export default function MyInfoScreen() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLikeRecipePress = () => {
    router.push("/_pages/LikeRecipe");
  };

  const handleWeeklyAchievePress = () => {
    router.push("/_pages/weeklyAchieve");
  };

  const handleBadgePress = () => {
    router.push("/_pages/weeklyAchieve");
  };

  const handleEditGoalsPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSettingsPress = () => {
    router.push("/_pages/NotiSettings");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={tabsStyles.scrollContent}
      >
        <ProfileSection
          onLikeRecipePress={handleLikeRecipePress}
          onBadgePress={handleBadgePress}
        />

        <View style={styles.content}>
          <GoalsSection onEditGoals={handleEditGoalsPress} />
          <HealthGoalStats />
          <StatsSection onWeeklyAchievePress={handleWeeklyAchievePress} />

          {/* 설정 메뉴 */}
          <View style={styles.settingsSection}>
            <TouchableOpacity
              style={[commonStyles.card, styles.settingsItem]}
              onPress={handleSettingsPress}
            >
              <Settings size={24} color={Colors.primary} strokeWidth={2} />
              <View style={styles.settingsItemContent}>
                <Text style={styles.settingsItemTitle}>알림 설정</Text>
                <Text style={styles.settingsItemDescription}>
                  알림 수신 설정을 관리합니다
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal} // Android에서 뒤로가기 버튼 처리 추가
      >
        <UpdateHealthGoal onClose={handleCloseModal} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  settingsSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingsItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingsItemTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  settingsItemDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
