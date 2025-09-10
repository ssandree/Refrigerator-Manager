import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header
        title="홈"
        onNotificationPress={() => console.log("알림 클릭")}
        onProfilePress={() => console.log("프로필 클릭")}
      />
      
      <ScrollView style={styles.content}>
        {/* 오늘의 레시피 추천 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍽️ 오늘의 레시피</Text>
          <TouchableOpacity style={styles.recipeCard}>
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeName}>크림 시금치 파스타</Text>
              <Text style={styles.recipeDescription}>
                부드러운 크림 소스와 신선한 시금치가 만나 완벽한 파스타
              </Text>
              <View style={styles.recipeStats}>
                <View style={styles.statItem}>
                  <Ionicons name="flame-outline" size={16} color="#FF6B6B" />
                  <Text style={styles.statText}>531칼로리</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color="#4CAF50" />
                  <Text style={styles.statText}>25분</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="restaurant-outline" size={16} color="#2196F3" />
                  <Text style={styles.statText}>2/8 재료 보유</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 임박 재료 알림 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ 임박 재료</Text>
          <View style={styles.expiringContainer}>
            <View style={styles.expiringItem}>
              <View style={styles.expiringInfo}>
                <Text style={styles.expiringName}>시금치</Text>
                <Text style={styles.expiringDate}>1일 남음</Text>
              </View>
              <Ionicons name="warning" size={20} color="#FF6B6B" />
            </View>
            <View style={styles.expiringItem}>
              <View style={styles.expiringInfo}>
                <Text style={styles.expiringName}>연어</Text>
                <Text style={styles.expiringDate}>2일 남음</Text>
              </View>
              <Ionicons name="warning" size={20} color="#FF9800" />
            </View>
            <View style={styles.expiringItem}>
              <View style={styles.expiringInfo}>
                <Text style={styles.expiringName}>고등어</Text>
                <Text style={styles.expiringDate}>3일 남음</Text>
              </View>
              <Ionicons name="warning" size={20} color="#FF9800" />
            </View>
          </View>
        </View>

        {/* 건강 목표 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 오늘의 건강 목표</Text>
          <View style={styles.goalContainer}>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>칼로리</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "65%" }]} />
              </View>
              <Text style={styles.goalText}>1,300 / 2,000 kcal</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>단백질</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "80%" }]} />
              </View>
              <Text style={styles.goalText}>64 / 80g</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>채소</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "45%" }]} />
              </View>
              <Text style={styles.goalText}>2 / 5 서빙</Text>
            </View>
          </View>
        </View>

        {/* 빠른 액션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ 빠른 액션</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle" size={24} color="#4CAF50" />
              <Text style={styles.actionText}>재료 추가</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="restaurant" size={24} color="#2196F3" />
              <Text style={styles.actionText}>레시피 검색</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="fitness" size={24} color="#FF9800" />
              <Text style={styles.actionText}>식단 기록</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFBE8",
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
  recipeCard: {
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
  recipeInfo: {
    flex: 1,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  recipeStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  expiringContainer: {
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
  expiringItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  expiringInfo: {
    flex: 1,
  },
  expiringName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2D2D2D",
  },
  expiringDate: {
    fontSize: 14,
    color: "#666",
  },
  goalContainer: {
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
    marginBottom: 16,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D2D2D",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  goalText: {
    fontSize: 12,
    color: "#666",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    alignItems: "center",
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
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
});
