import { router, Tabs } from "expo-router";
import {
  Bell,
  ChefHat,
  Heart,
  Home,
  Refrigerator,
  User,
  UtensilsCrossed,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileCircle from "../../src/components/ProfileCircle";
import { Colors, createShadowStyle, FontSizes } from "../../src/styles/common";

const tabBarShadow = createShadowStyle({
  offsetHeight: -2,
  opacity: 0.1,
  radius: 8,
  elevation: 8,
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      initialRouteName="Fridge"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          height: 120,
        },
        headerTitleStyle: {
          fontSize: FontSizes.xl,
          fontWeight: "bold",
        },
        headerTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: 4 + insets.bottom,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: Colors.borderLight,
          backgroundColor: Colors.surface,
          ...tabBarShadow,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: FontSizes.sm,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="Fridge"
        options={{
          title: "냉장고",
          tabBarIcon: ({ color, size, focused }) => (
            <Refrigerator
              size={size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Recipe"
        options={{
          title: "레시피",
          headerShown: true,
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={() => router.push("/_pages/LikeRecipe")}
              >
                <Heart
                  size={22}
                  color={Colors.meat}
                  strokeWidth={2}
                  fill={Colors.meat}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={() => router.push("/_pages/Notifications")}
              >
                <Bell size={22} color={Colors.textPrimary} strokeWidth={2} />
              </TouchableOpacity>
              <ProfileCircle
                size={36}
                onPress={() => router.push("/(tabs)/MyInfo")}
              />
            </View>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <ChefHat
              size={size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Home"
        options={{
          title: "홈",
          headerShown: true,
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={() => router.push("/_pages/Notifications")}
              >
                <Bell size={22} color={Colors.textPrimary} strokeWidth={2} />
              </TouchableOpacity>
              <ProfileCircle
                size={36}
                onPress={() => router.push("/(tabs)/MyInfo")}
              />
            </View>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <Home size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="Meal"
        options={{
          title: "식단",
          headerShown: true,
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={() => router.push("/_pages/Notifications")}
              >
                <Bell size={22} color={Colors.textPrimary} strokeWidth={2} />
              </TouchableOpacity>
              <ProfileCircle
                size={36}
                onPress={() => router.push("/(tabs)/MyInfo")}
              />
            </View>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <UtensilsCrossed
              size={size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MyInfo"
        options={{
          title: "내정보",
          headerShown: true,
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={() => router.push("/_pages/Settings")}
              >
                <Text style={styles.settingsIcon}>⚙️</Text>
              </TouchableOpacity>
            </View>
          ),
          headerTintColor: Colors.textSecondary,
          tabBarIcon: ({ color, size, focused }) => (
            <User size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  headerIconButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
  },
  settingsIcon: {
    fontSize: 20,
  },
});
