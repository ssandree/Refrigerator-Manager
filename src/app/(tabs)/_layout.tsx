import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Colors, FontSizes } from "../../styles/common";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="Fridge"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: Colors.primary[100], 
          height: 72,
          paddingBottom: 4,
          paddingTop: 4,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.text,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: FontSizes.sm,
          fontWeight: "500",
        },
      }}
    >

      <Tabs.Screen
        name="Fridge"
        options={{
          title: "냉장고",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="snow-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Recipe"
        options={{
          title: "레시피",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="InMyStomach"
        options={{
          title: "식단",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="MyInfo"
        options={{
          title: "내정보",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}