import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MyInfoScreen() {
  return (
    <View style={styles.container}>
      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Ionicons name="person" size={40} color="#666" />
        </View>
        <Text style={styles.userName}>사용자</Text>
        <Text style={styles.userEmail}>user@example.com</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 건강 목표 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 건강 목표</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>일일 칼로리 목표</Text>
              <Text style={styles.goalValue}>2,000 kcal</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>단백질 목표</Text>
              <Text style={styles.goalValue}>80g</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>채소 섭취 목표</Text>
              <Text style={styles.goalValue}>5 서빙</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>목표 수정</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 알림 설정</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>유통기한 알림</Text>
                <Text style={styles.settingDescription}>재료 유통기한 2일 전 알림</Text>
              </View>
              <TouchableOpacity style={styles.toggleButton}>
                <View style={[styles.toggle, styles.toggleActive]} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>레시피 추천 알림</Text>
                <Text style={styles.settingDescription}>매일 오후 6시 레시피 추천</Text>
              </View>
              <TouchableOpacity style={styles.toggleButton}>
                <View style={[styles.toggle, styles.toggleActive]} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>식단 기록 알림</Text>
                <Text style={styles.settingDescription}>식사 후 식단 기록 알림</Text>
              </View>
              <TouchableOpacity style={styles.toggleButton}>
                <View style={[styles.toggle, styles.toggleInactive]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 통계 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 나의 통계</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>등록된 재료</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>즐겨찾기 레시피</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>이번 주 식사</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>연속 기록일</Text>
            </View>
          </View>
        </View>

        {/* 메뉴 옵션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ 설정</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="heart-outline" size={20} color="#666" />
              <Text style={styles.menuText}>즐겨찾기 레시피</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="trophy-outline" size={20} color="#666" />
              <Text style={styles.menuText}>업적 및 배지</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="analytics-outline" size={20} color="#666" />
              <Text style={styles.menuText}>상세 통계</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={20} color="#666" />
              <Text style={styles.menuText}>도움말</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
              <Text style={styles.menuText}>앱 정보</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBE8",
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 12,
  },
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  goalLabel: {
    fontSize: 14,
    color: "#666",
  },
  goalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  editButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-end",
    marginTop: 8,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  settingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D2D2D",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
  },
  toggleButton: {
    padding: 4,
  },
  toggle: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
  },
  toggleActive: {
    backgroundColor: "#4CAF50",
  },
  toggleInactive: {
    backgroundColor: "#E0E0E0",
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuText: {
    fontSize: 14,
    color: "#2D2D2D",
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
