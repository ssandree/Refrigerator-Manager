import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GoalsSection from "../../src/components/tabs/myinfo/GoalsSection";
import HealthGoalStats from "../../src/components/tabs/myinfo/HealthGoalStats";
import ProfileSection from "../../src/components/tabs/myinfo/ProfileSection";
import SettingsMenu from "../../src/components/tabs/myinfo/SettingsMenu";
import StatsSection from "../../src/components/tabs/myinfo/StatsSection";
import { Colors } from "../../src/styles/common";
import { tabsStyles } from "../../src/styles/tabs";
import UpdateHealthGoal from "../_pages/UpdateHealthGoal";

export default function MyInfoScreen() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [settingsMenuY, setSettingsMenuY] = useState(0);

  const handleLikeRecipePress = () => {
    router.push("../_pages/LikeRecipe");
  };

  const handleWeeklyAchievePress = () => {
    router.push("../_pages/weeklyAchieve");
  };

  const handleBadgePress = () => {
    router.push("../_pages/weeklyAchieve");
  };

  const handleEditGoalsPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSettingsPress = () => {
    // SettingsMenu로 스크롤
    if (settingsMenuY > 0) {
      scrollViewRef.current?.scrollTo({
        y: settingsMenuY - 20,
        animated: true,
      });
    } else {
      // 위치가 아직 측정되지 않은 경우 끝으로 스크롤
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleSettingsMenuLayout = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    setSettingsMenuY(y);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={tabsStyles.header}>
          <Text style={tabsStyles.headerTitle}>내정보</Text>
          <View style={tabsStyles.headerRight}>
            <TouchableOpacity
              style={tabsStyles.notificationButton}
              onPress={handleSettingsPress}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
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

            <View onLayout={handleSettingsMenuLayout}>
              <SettingsMenu />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  settingsIcon: {
    fontSize: 24,
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
