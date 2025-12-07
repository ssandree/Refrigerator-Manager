import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import GoalsSection from "../../src/components/tabs/myinfo/GoalsSection";
import ProfileSection from "../../src/components/tabs/myinfo/ProfileSection";
import SimpleAchieveCard from "../../src/components/tabs/myinfo/SimpleAchieveCard";
import StatsSection from "../../src/components/tabs/myinfo/StatsSection";
import SectionHeader from "../../src/components/weeklyAchieve/SectionHeader";
import { useHealthGoalStore } from "../../src/stores/useHealthGoalStore";
import { Colors } from "../../src/styles/common";
import { tabsStyles } from "../../src/styles/tabs";
import UpdateHealthGoal from "../_pages/UpdateHealthGoal";

export default function MyInfoScreen() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const selectedGoals = useHealthGoalStore((state) => state.selectedGoals);
  const loadUserSelectedGoals = useHealthGoalStore(
    (state) => state.loadUserSelectedGoals
  );

  const loadUserSelectedGoalsRef = useRef(loadUserSelectedGoals);
  loadUserSelectedGoalsRef.current = loadUserSelectedGoals;

  // 화면 포커스 시 건강 목표 로드
  useEffect(() => {
    loadUserSelectedGoalsRef.current();
  }, []);

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

        {/* 하단: 건강 목표 달성률 카드 */}
        {selectedGoals.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="✅ 건강 목표 달성률 보기"
              subtitle="주간 섭취 데이터를 기반으로 달성도를 계산합니다."
            />
            <SimpleAchieveCard />
          </View>
        )}
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
  section: {
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
});
