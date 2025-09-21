import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors, FontSizes } from "../../styles/common";

export default function AddFood() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>음식 등록</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Image 
                source={require("../../assets/images/tomato.jpg")} 
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 콘텐츠 */}
        <View style={styles.content}>
          <Text style={styles.title}>여기는 재료등록페이지</Text>
        </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationButton: {
    padding: 8,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FontSizes.lg,
    color: Colors.text,
  },
});

