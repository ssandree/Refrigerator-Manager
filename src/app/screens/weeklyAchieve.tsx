import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import { Colors, FontSizes, commonStyles } from "../../styles/common";

export default function WeeklyAchieveScreen() {
  return (
    <View style={styles.container}>
      <Header
        title="주간 달성"
        onNotificationPress={() => console.log("알림 클릭")}
        onProfilePress={() => console.log("프로필 클릭")}
      />
      
      <ScrollView style={styles.content}>
        {/* 주간 선택기 */}
        <View style={styles.weekSelector}>
          <TouchableOpacity style={styles.weekButton}>
            <Text style={styles.weekText}>← 이전 주</Text>
          </TouchableOpacity>
          <Text style={styles.weekText}>2024년 1월 1주차</Text>
          <TouchableOpacity style={styles.weekButton}>
            <Text style={styles.weekText}>다음 주 →</Text>
          </TouchableOpacity>
        </View>

        {/* 달성 목표 카드들 */}
        <View style={styles.achievementCard}>
          <View style={styles.achievementHeader}>
            <Text style={styles.achievementTitle}>🥗 건강한 식단</Text>
            <Text style={styles.achievementStatus}>진행중</Text>
          </View>
          <Text style={styles.achievementDescription}>
            이번 주에 5일 이상 건강한 식단을 유지하세요
          </Text>
          <View style={styles.achievementProgress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "60%" }]} />
            </View>
            <Text style={styles.progressText}>3/5일</Text>
          </View>
        </View>

        <View style={styles.achievementCard}>
          <View style={styles.achievementHeader}>
            <Text style={styles.achievementTitle}>🍎 재료 활용</Text>
            <Text style={styles.achievementStatus}>완료</Text>
          </View>
          <Text style={styles.achievementDescription}>
            유통기한이 임박한 재료를 모두 활용하세요
          </Text>
          <View style={styles.achievementProgress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "100%" }]} />
            </View>
            <Text style={styles.progressText}>5/5개</Text>
          </View>
        </View>

        <View style={styles.achievementCard}>
          <View style={styles.achievementHeader}>
            <Text style={styles.achievementTitle}>📝 식단 기록</Text>
            <Text style={styles.achievementStatus}>진행중</Text>
          </View>
          <Text style={styles.achievementDescription}>
            매일 식단을 기록하여 건강을 관리하세요
          </Text>
          <View style={styles.achievementProgress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "40%" }]} />
            </View>
            <Text style={styles.progressText}>2/7일</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    marginBottom: 16,
    borderRadius: 12,
    ...commonStyles.shadow,
  },
  weekButton: {
    padding: 8,
  },
  weekText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  achievementCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  achievementStatus: {
    fontSize: FontSizes.sm,
    color: Colors.primary[500],
    fontWeight: '500',
  },
  achievementDescription: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  achievementProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 4,
  },
  progressText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    minWidth: 50,
    textAlign: 'right',
  },
});