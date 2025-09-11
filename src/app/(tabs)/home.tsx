import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import FridgeRegisterQuick from "../../components/fridgeRegisterQuick";
import Header from "../../components/Header";
import { Colors } from "../../styles/common";
import { tabsStyles } from "./styles";

export default function HomeScreen() {
  return (
    <View style={tabsStyles.container}>
      <Header
        title="홈"
        onNotificationPress={() => console.log("알림 클릭")}
        onProfilePress={() => console.log("프로필 클릭")}
      />
      
      <ScrollView style={tabsStyles.content}>
        {/* 오늘의 레시피 추천 */}
        <View style={tabsStyles.section}>
          <Text style={tabsStyles.sectionTitle}>🍽️ 오늘의 레시피</Text>
          <TouchableOpacity style={tabsStyles.recipeCard}>
            <View style={tabsStyles.recipeInfo}>
              <Text style={tabsStyles.recipeName}>크림 시금치 파스타</Text>
              <Text style={tabsStyles.recipeDescription}>
                부드러운 크림 소스와 신선한 시금치가 만나 완벽한 파스타
              </Text>
              <View style={tabsStyles.recipeStats}>
                <View style={tabsStyles.statItem}>
                  <Ionicons name="flame-outline" size={16} color={Colors.error} />
                  <Text style={tabsStyles.statText}>531칼로리</Text>
                </View>
                <View style={tabsStyles.statItem}>
                  <Ionicons name="time-outline" size={16} color={Colors.primary[500]} />
                  <Text style={tabsStyles.statText}>25분</Text>
                </View>
                <View style={tabsStyles.statItem}>
                  <Ionicons name="restaurant-outline" size={16} color={Colors.secondary[500]} />
                  <Text style={tabsStyles.statText}>2/8 재료 보유</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 임박 재료 알림 */}
        <View style={tabsStyles.section}>
          <Text style={tabsStyles.sectionTitle}>⚠️ 임박 재료</Text>
          <View style={tabsStyles.expiringContainer}>
            <View style={tabsStyles.expiringItem}>
              <View style={tabsStyles.expiringInfo}>
                <Text style={tabsStyles.expiringName}>시금치</Text>
                <Text style={tabsStyles.expiringDate}>1일 남음</Text>
              </View>
              <Ionicons name="warning" size={20} color={Colors.error} />
            </View>
            <View style={tabsStyles.expiringItem}>
              <View style={tabsStyles.expiringInfo}>
                <Text style={tabsStyles.expiringName}>연어</Text>
                <Text style={tabsStyles.expiringDate}>2일 남음</Text>
              </View>
              <Ionicons name="warning" size={20} color={Colors.warning} />
            </View>
            <View style={tabsStyles.expiringItem}>
              <View style={tabsStyles.expiringInfo}>
                <Text style={tabsStyles.expiringName}>고등어</Text>
                <Text style={tabsStyles.expiringDate}>3일 남음</Text>
              </View>
              <Ionicons name="warning" size={20} color={Colors.warning} />
            </View>
          </View>
        </View>

        {/* 건강 목표 */}
        <View style={tabsStyles.section}>
          <Text style={tabsStyles.sectionTitle}>🎯 오늘의 건강 목표</Text>
          <View style={tabsStyles.goalContainer}>
            <View style={tabsStyles.goalItem}>
              <Text style={tabsStyles.goalLabel}>칼로리</Text>
              <View style={tabsStyles.progressBar}>
                <View style={[tabsStyles.progressFill, { width: "65%" }]} />
              </View>
              <Text style={tabsStyles.goalText}>1,300 / 2,000 kcal</Text>
            </View>
            <View style={tabsStyles.goalItem}>
              <Text style={tabsStyles.goalLabel}>단백질</Text>
              <View style={tabsStyles.progressBar}>
                <View style={[tabsStyles.progressFill, { width: "80%" }]} />
              </View>
              <Text style={tabsStyles.goalText}>64 / 80g</Text>
            </View>
            <View style={tabsStyles.goalItem}>
              <Text style={tabsStyles.goalLabel}>채소</Text>
              <View style={tabsStyles.progressBar}>
                <View style={[tabsStyles.progressFill, { width: "45%" }]} />
              </View>
              <Text style={tabsStyles.goalText}>2 / 5 서빙</Text>
            </View>
          </View>
        </View>

      </ScrollView>
      
      {/* 플로팅 버튼 */}
      <FridgeRegisterQuick />
    </View>
  );
}

