import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // 👈 [수정 2] useRouter 임포트
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useHealthGoal } from "../../contexts/HealthGoalContext";
import { Colors } from "../../styles/common";
import UpdateHealthGoal from "../screens/UpdateHealthGoal";

export default function MyInfoScreen() {
  const router = useRouter(); // 👈 [수정 2] useRouter 호출
  const { selectedGoals } = useHealthGoal();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLikeRecipePress = () => {
    router.push("../screens/LikeRecipe");
  };

  const handleEditGoalsPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          {/* 사용자 정보 */}
          <View style={styles.userInfo}>
            <View style={styles.profileImageContainer}>
              <Ionicons name="person" size={40} color="#666" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>사용자</Text>
              <Text style={styles.userEmail}>user@example.com</Text>
            </View>
          </View>

          {/* 프로필 메뉴 */}
          <View style={styles.profileMenu}>
            {/* 👈 [수정 3] onPress 연결 */}
            <TouchableOpacity 
              style={styles.profileMenuItem} 
              onPress={handleLikeRecipePress}
            >
              <Ionicons name="heart-outline" size={20} color="#666" />
              <Text style={styles.profileMenuText}>즐겨찾기 레시피</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileMenuItem}>
              <Ionicons name="trophy-outline" size={20} color="#666" />
              <Text style={styles.profileMenuText}>업적</Text>
              <Ionicons name="chevron-forward" size={16} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* 건강 목표 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎯 건강 목표</Text>
              {/* 👈 [수정 1] onPress 연결 */}
              <TouchableOpacity style={styles.editButton} onPress={handleEditGoalsPress}>
                <Text style={styles.editButtonText}>목표 수정</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.goalCard}>
              {selectedGoals.length > 0 ? (
                selectedGoals.map((goal, index) => (
                  <View key={goal.id} style={[styles.goalItem, index === selectedGoals.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={styles.goalItemContent}>
                      <View style={[styles.goalIconContainer, { backgroundColor: goal.color + '20' }]}>
                        <Ionicons
                          name={goal.icon as any}
                          size={20}
                          color={goal.color}
                        />
                      </View>
                      <View style={styles.goalTextContent}>
                        <Text style={styles.goalLabel}>{goal.title}</Text>
                        <Text style={styles.goalDescription}>{goal.description}</Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyGoalsContainer}>
                  <Text style={styles.emptyGoalsText}>선택된 건강 목표가 없습니다</Text>
                  <Text style={styles.emptyGoalsSubtext}>온보딩에서 건강 목표를 설정해보세요</Text>
                </View>
              )}
            </View>
          </View>

          {/* 알림 설정 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 알림 설정</Text>
            <View style={styles.settingCard}>
              {/* 항목이 마지막이 아닌 경우에만 borderBottom을 적용하도록 스타일 수정이 필요할 수 있습니다. */}
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>유통기한 알림</Text>
                  <Text style={styles.settingDescription}>재료 유통기한 2일 전 알림</Text>
                </View>
                <TouchableOpacity style={styles.toggleButton}>
                  {/* 실제 토글 구현을 위해 View 대신 Switch 컴포넌트를 사용해야 합니다. */}
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
              <View style={[styles.settingItem, { borderBottomWidth: 0 }]}> 
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
                <Ionicons name="help-circle-outline" size={20} color="#666" />
                <Text style={styles.menuText}>도움말</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                <Ionicons name="information-circle-outline" size={20} color="#666" />
                <Text style={styles.menuText}>앱 정보</Text>
                <Ionicons name="chevron-forward" size={16} color="#999" />
              </TouchableOpacity>
            </View>
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
  scrollContent: {
    paddingBottom: 20, // 하단 여백
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
    backgroundColor: "#F5F5F5",
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
    color: "#2D2D2D",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: "#666",
  },
  profileMenu: {
    width: '100%', 
    flexDirection: "row",
    justifyContent: 'space-between', // 항목 간격 조정
    marginTop: 12,
    marginLeft: 0, // userInfo와 정렬을 위해 0으로 설정
  },
  profileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10, // 패딩 축소
    paddingHorizontal: 12, // 좌우 패딩 추가
    gap: 8, // gap 축소
    backgroundColor: "#F8F9FA",
    borderRadius: 6,
    flex: 1, // 항목이 공간을 균등하게 차지하도록
    marginHorizontal: 4, // 항목 간의 미세한 간격 추가
  },
  profileMenuText: {
    fontSize: 12,
    color: "#2D2D2D",
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16, // 좌우 패딩 유지
    paddingVertical: 0, // 상단 패딩 제거 (section에서 처리)
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  goalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16, // 좌우 패딩
    paddingVertical: 4, // 상하 패딩 조정
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  goalItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  goalTextContent: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 2,
  },
  goalDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  emptyGoalsContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyGoalsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  emptyGoalsSubtext: {
    fontSize: 12,
    color: "#999",
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  editButtonText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  settingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
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
    // backgroundColor: "#E0E0E0", // 기본 배경색은 active/inactive에서 설정
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
    flexDirection: "row", // 👈 [스타일 수정] 통계 항목을 가로로 배치
    justifyContent: "space-between", // 항목 사이 간격 균등 분배
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    // statItem 간에 경계선을 추가하려면 여기에 borderRightWidth 등을 추가할 수 있습니다.
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
  // 로그아웃 버튼 스타일은 현재 컴포넌트에는 없지만 유지합니다.
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