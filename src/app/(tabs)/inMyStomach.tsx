import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DailyDietCard from "../../components/DailyDietCard";

export default function DietScreen() {
  const today = new Date();
  const todayString = today.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>🍽️ 오늘의 식단</Text>
        <Text style={styles.date}>{todayString}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 아침 */}
        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>🌅 아침</Text>
          <DailyDietCard 
            recipeName="아보카도 토스트" 
            calories={320} 
            protein={12} 
            carbs={25} 
            fat={18}
            time="08:30"
          />
        </View>

        {/* 점심 */}
        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>☀️ 점심</Text>
          <DailyDietCard 
            recipeName="크림 시금치 파스타" 
            calories={531} 
            protein={18} 
            carbs={65} 
            fat={22}
            time="12:15"
          />
          <DailyDietCard 
            recipeName="닭가슴살 샐러드" 
            calories={280} 
            protein={25} 
            carbs={10} 
            fat={15}
            time="12:45"
          />
        </View>

        {/* 저녁 */}
        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>🌙 저녁</Text>
          <DailyDietCard 
            recipeName="된장찌개" 
            calories={180} 
            protein={8} 
            carbs={12} 
            fat={8}
            time="19:30"
          />
        </View>

        {/* 간식 */}
        <View style={styles.mealSection}>
          <Text style={styles.mealTitle}>🍎 간식</Text>
          <DailyDietCard 
            recipeName="사과" 
            calories={80} 
            protein={0} 
            carbs={20} 
            fat={0}
            time="15:20"
          />
        </View>

        {/* 하루 총계 */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>📊 오늘의 총계</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>총 칼로리</Text>
              <Text style={styles.summaryValue}>1,391 kcal</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>단백질</Text>
              <Text style={styles.summaryValue}>63g</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>탄수화물</Text>
              <Text style={styles.summaryValue}>132g</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>지방</Text>
              <Text style={styles.summaryValue}>63g</Text>
            </View>
          </View>
        </View>

        {/* 추가 버튼 */}
        <TouchableOpacity style={styles.addMealButton}>
          <Text style={styles.addMealButtonText}>+ 식사 추가</Text>
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
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  mealSection: {
    marginBottom: 24,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 12,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 12,
  },
  summaryCard: {
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
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D2D2D",
  },
  addMealButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  addMealButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
