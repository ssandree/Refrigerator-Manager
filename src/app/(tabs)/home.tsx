import { Ionicons } from "@expo/vector-icons";
// 서버 상태 관리를 위한 React Query 훅
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import QuickFoodAdd from "../../components/QuickFoodAdd";
import ExpiringIngredientSection from "../../components/tabs/home/ExpiringIngredientCard";
import Greeting from "../../components/tabs/home/Greeting";
import { Colors } from "../../styles/common";
import { mealService } from "../services/mealService";
import { tabsStyles } from "./styles";

export default function HomeScreen() {
  // 예시 쿼리: 서버에서 식사 목록을 가져와 개수를 출력
  const {
    data: mealsResp,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["meals"],
    queryFn: () => mealService.getAllMeals(),
  });
  const mealsCount = mealsResp?.data ? mealsResp.data.length : 0;
  return (
    <View style={tabsStyles.container}>
      {/* 헤더 */}
      <View style={tabsStyles.header}>
        <Text style={tabsStyles.headerTitle}>홈</Text>
        <View style={tabsStyles.headerRight}>
          <TouchableOpacity style={tabsStyles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={tabsStyles.profileButton}>
            <Image
              source={require("../../assets/images/tomato.jpg")}
              style={tabsStyles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={tabsStyles.content}
        contentContainerStyle={tabsStyles.scrollContent}
      >
        {/* 인사 및 빠른 등록 버튼 */}
        <View style={tabsStyles.section}>
          <Greeting />
        </View>

        {/* 서버 데이터 예시: 사용자 식사 목록 카운트 */}
        <View style={tabsStyles.section}>
          <Text style={tabsStyles.sectionTitle}>📦 서버 데이터</Text>
          <Text style={tabsStyles.statText}>
            {isLoading
              ? "불러오는 중..."
              : error
              ? "오류 발생"
              : `식사 항목: ${mealsCount}개`}
          </Text>
        </View>

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
                  <Ionicons
                    name="flame-outline"
                    size={16}
                    color={Colors.error}
                  />
                  <Text style={tabsStyles.statText}>531칼로리</Text>
                </View>
                <View style={tabsStyles.statItem}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={Colors.primary}
                  />
                  <Text style={tabsStyles.statText}>25분</Text>
                </View>
                <View style={tabsStyles.statItem}>
                  <Ionicons
                    name="restaurant-outline"
                    size={16}
                    color={Colors.secondary}
                  />
                  <Text style={tabsStyles.statText}>2/8 재료 보유</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 임박 재료 알림 */}
        <ExpiringIngredientSection />

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
      <QuickFoodAdd />
    </View>
  );
}
