import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontSizes, commonStyles } from "../../src/styles/common";

export default function NotiSettings() {
  // 알림 설정 상태 (TODO: BE API 연동 필요)
  const [expiryWarningEnabled, setExpiryWarningEnabled] = useState(true);
  const [expiryExpiredEnabled, setExpiryExpiredEnabled] = useState(true);
  const [recipeRecommendationEnabled, setRecipeRecommendationEnabled] =
    useState(true);
  const [healthGoalReminderEnabled, setHealthGoalReminderEnabled] =
    useState(true);
  const [mealReminderEnabled, setMealReminderEnabled] = useState(false);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>← 뒤로</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>알림 설정</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 알림 설정 섹션 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>알림 수신 설정</Text>
              <Text style={styles.sectionDescription}>
                받고 싶은 알림을 선택하세요
              </Text>

              {/* 유통기한 임박 알림 */}
              <View style={[commonStyles.card, styles.settingItem]}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>
                    유통기한 임박 알림
                  </Text>
                  <Text style={styles.settingItemDescription}>
                    유통기한이 임박한 재료에 대한 알림
                  </Text>
                </View>
                <Switch
                  value={expiryWarningEnabled}
                  onValueChange={setExpiryWarningEnabled}
                  trackColor={{
                    false: Colors.border,
                    true: Colors.primary + "80",
                  }}
                  thumbColor={expiryWarningEnabled ? Colors.primary : "#f4f3f4"}
                />
              </View>

              {/* 유통기한 만료 알림 */}
              <View style={[commonStyles.card, styles.settingItem]}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>
                    유통기한 만료 알림
                  </Text>
                  <Text style={styles.settingItemDescription}>
                    유통기한이 만료된 재료에 대한 알림
                  </Text>
                </View>
                <Switch
                  value={expiryExpiredEnabled}
                  onValueChange={setExpiryExpiredEnabled}
                  trackColor={{
                    false: Colors.border,
                    true: Colors.primary + "80",
                  }}
                  thumbColor={expiryExpiredEnabled ? Colors.primary : "#f4f3f4"}
                />
              </View>

              {/* 레시피 추천 알림 */}
              <View style={[commonStyles.card, styles.settingItem]}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>레시피 추천 알림</Text>
                  <Text style={styles.settingItemDescription}>
                    보유 재료로 만들 수 있는 레시피 추천 알림
                  </Text>
                </View>
                <Switch
                  value={recipeRecommendationEnabled}
                  onValueChange={setRecipeRecommendationEnabled}
                  trackColor={{
                    false: Colors.border,
                    true: Colors.primary + "80",
                  }}
                  thumbColor={
                    recipeRecommendationEnabled ? Colors.primary : "#f4f3f4"
                  }
                />
              </View>

              {/* 건강 목표 알림 */}
              <View style={[commonStyles.card, styles.settingItem]}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>건강 목표 알림</Text>
                  <Text style={styles.settingItemDescription}>
                    건강 목표 달성 관련 알림
                  </Text>
                </View>
                <Switch
                  value={healthGoalReminderEnabled}
                  onValueChange={setHealthGoalReminderEnabled}
                  trackColor={{
                    false: Colors.border,
                    true: Colors.primary + "80",
                  }}
                  thumbColor={
                    healthGoalReminderEnabled ? Colors.primary : "#f4f3f4"
                  }
                />
              </View>

              {/* 식사 알림 */}
              <View style={[commonStyles.card, styles.settingItem]}>
                <View style={styles.settingItemContent}>
                  <Text style={styles.settingItemTitle}>식사 알림</Text>
                  <Text style={styles.settingItemDescription}>
                    식사 기록을 위한 알림
                  </Text>
                </View>
                <Switch
                  value={mealReminderEnabled}
                  onValueChange={setMealReminderEnabled}
                  trackColor={{
                    false: Colors.border,
                    true: Colors.primary + "80",
                  }}
                  thumbColor={mealReminderEnabled ? Colors.primary : "#f4f3f4"}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 60, // 뒤로 버튼과 균형을 맞추기 위한 공간
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 12,
  },
  settingItemContent: {
    flex: 1,
    marginRight: 16,
  },
  settingItemTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  settingItemDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
