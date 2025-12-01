import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import GoalsSection from "../../src/components/tabs/myinfo/GoalsSection";
import ProfileSection from "../../src/components/tabs/myinfo/ProfileSection";
import StatsSection from "../../src/components/tabs/myinfo/StatsSection";
import { Colors } from "../../src/styles/common";
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
          <StatsSection onWeeklyAchievePress={handleWeeklyAchievePress} />
          <GoalsSection onEditGoals={handleEditGoalsPress} />
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
});
