import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet, Switch, Text, View } from "react-native";
import { Colors, createShadowStyle, FontSizes } from "../../../styles/common";
import { tabsStyles } from "../../../styles/tabs";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

const menuCardShadow = createShadowStyle({
  opacity: 0.1,
  radius: 3.84,
  elevation: 5,
});

// 알림 설정을 위한 간단한 스토리지 키
const NOTIFICATION_SETTINGS_KEY = "notification-settings";

interface NotificationSettings {
  enabled: boolean;
  expiryWarning: boolean;
  recipeRecommendation: boolean;
  healthGoalReminder: boolean;
  mealReminder: boolean;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  expiryWarning: true,
  recipeRecommendation: true,
  healthGoalReminder: true,
  mealReminder: true,
};

export default function SettingsMenu() {
  const [settings, setSettings] =
    useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // 설정 로드
  useEffect(() => {
    loadSettings();
    checkNotificationPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      if (Platform.OS === "web") {
        // 웹 환경에서는 localStorage 사용
        const stored = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...defaultSettings, ...parsed });
        }
      } else {
        // 네이티브 환경에서는 SecureStore 사용
        const stored = await SecureStore.getItemAsync(
          NOTIFICATION_SETTINGS_KEY
        );
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...defaultSettings, ...parsed });
        }
      }
    } catch (error) {
      console.error("알림 설정 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      const json = JSON.stringify(newSettings);
      if (Platform.OS === "web") {
        // 웹 환경에서는 localStorage 사용
        localStorage.setItem(NOTIFICATION_SETTINGS_KEY, json);
      } else {
        // 네이티브 환경에서는 SecureStore 사용
        await SecureStore.setItemAsync(NOTIFICATION_SETTINGS_KEY, json);
      }
      setSettings(newSettings);
    } catch (error) {
      console.error("알림 설정 저장 실패:", error);
      showErrorToast({
        message: "설정 저장에 실패했습니다.",
      });
    }
  };

  const checkNotificationPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted" && settings.enabled) {
        // 권한이 없는데 설정이 켜져있으면 권한 요청
        requestNotificationPermissions();
      }
    }
  };

  const requestNotificationPermissions = async () => {
    if (Platform.OS === "web") {
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "알림 권한 필요",
        "알림을 받으려면 알림 권한이 필요합니다. 설정에서 권한을 허용해주세요.",
        [{ text: "확인" }]
      );
      // 권한이 없으면 알림 설정 끄기
      await saveSettings({ ...settings, enabled: false });
    } else {
      showSuccessToast({
        message: "알림 권한이 허용되었습니다.",
      });
    }
  };

  const handleToggleEnabled = async (value: boolean) => {
    if (value) {
      // 알림 켜기 - 권한 확인
      await requestNotificationPermissions();
      if (Platform.OS !== "web") {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          return; // 권한이 없으면 토글하지 않음
        }
      }
    }
    await saveSettings({ ...settings, enabled: value });
  };

  const handleToggleSetting = async (
    key: keyof Omit<NotificationSettings, "enabled">,
    value: boolean
  ) => {
    if (!settings.enabled && value) {
      // 알림이 꺼져있는데 개별 설정을 켜려고 하면 먼저 알림을 켜야 함
      await handleToggleEnabled(true);
      if (!settings.enabled) {
        return; // 권한이 없어서 켜지지 않았으면 개별 설정도 켜지 않음
      }
    }
    await saveSettings({ ...settings, [key]: value });
  };

  if (isLoading) {
    return null;
  }

  return (
    <View style={tabsStyles.section}>
      <Text style={tabsStyles.sectionTitle}>🔔 알림 설정</Text>
      <View style={styles.menuCard}>
        {/* 전체 알림 켜기/끄기 */}
        <View style={styles.menuItem}>
          <Ionicons
            name={settings.enabled ? "notifications" : "notifications-off"}
            size={22}
            color={settings.enabled ? Colors.primary : Colors.textSecondary}
          />
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>알림 받기</Text>
            <Text style={styles.menuSubtext}>
              {settings.enabled ? "알림을 받습니다" : "알림을 받지 않습니다"}
            </Text>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={handleToggleEnabled}
            trackColor={{
              false: Colors.border,
              true: Colors.primaryLight,
            }}
            thumbColor={settings.enabled ? Colors.primary : Colors.textTertiary}
            ios_backgroundColor={Colors.border}
          />
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 개별 알림 설정 */}
        <View style={styles.subSettingsContainer}>
          <Text style={styles.subSettingsTitle}>알림 종류</Text>

          <View style={styles.subMenuItem}>
            <Ionicons
              name="time-outline"
              size={20}
              color={
                settings.enabled && settings.expiryWarning
                  ? Colors.warning
                  : Colors.textSecondary
              }
            />
            <View style={styles.menuTextContainer}>
              <Text
                style={[
                  styles.subMenuText,
                  !settings.enabled && styles.subMenuTextDisabled,
                ]}
              >
                유통기한 임박 알림
              </Text>
            </View>
            <Switch
              value={settings.enabled && settings.expiryWarning}
              onValueChange={(value) =>
                handleToggleSetting("expiryWarning", value)
              }
              disabled={!settings.enabled}
              trackColor={{
                false: Colors.border,
                true: Colors.warning + "80",
              }}
              thumbColor={
                settings.enabled && settings.expiryWarning
                  ? Colors.warning
                  : Colors.textTertiary
              }
              ios_backgroundColor={Colors.border}
            />
          </View>

          <View style={styles.subMenuItem}>
            <Ionicons
              name="restaurant-outline"
              size={20}
              color={
                settings.enabled && settings.recipeRecommendation
                  ? Colors.primary
                  : Colors.textSecondary
              }
            />
            <View style={styles.menuTextContainer}>
              <Text
                style={[
                  styles.subMenuText,
                  !settings.enabled && styles.subMenuTextDisabled,
                ]}
              >
                레시피 추천 알림
              </Text>
            </View>
            <Switch
              value={settings.enabled && settings.recipeRecommendation}
              onValueChange={(value) =>
                handleToggleSetting("recipeRecommendation", value)
              }
              disabled={!settings.enabled}
              trackColor={{
                false: Colors.border,
                true: Colors.primaryLight,
              }}
              thumbColor={
                settings.enabled && settings.recipeRecommendation
                  ? Colors.primary
                  : Colors.textTertiary
              }
              ios_backgroundColor={Colors.border}
            />
          </View>

          <View style={styles.subMenuItem}>
            <Ionicons
              name="fitness-outline"
              size={20}
              color={
                settings.enabled && settings.healthGoalReminder
                  ? Colors.secondary
                  : Colors.textSecondary
              }
            />
            <View style={styles.menuTextContainer}>
              <Text
                style={[
                  styles.subMenuText,
                  !settings.enabled && styles.subMenuTextDisabled,
                ]}
              >
                건강 목표 알림
              </Text>
            </View>
            <Switch
              value={settings.enabled && settings.healthGoalReminder}
              onValueChange={(value) =>
                handleToggleSetting("healthGoalReminder", value)
              }
              disabled={!settings.enabled}
              trackColor={{
                false: Colors.border,
                true: Colors.secondaryLight,
              }}
              thumbColor={
                settings.enabled && settings.healthGoalReminder
                  ? Colors.secondary
                  : Colors.textTertiary
              }
              ios_backgroundColor={Colors.border}
            />
          </View>

          <View style={[styles.subMenuItem, { borderBottomWidth: 0 }]}>
            <Ionicons
              name="fast-food-outline"
              size={20}
              color={
                settings.enabled && settings.mealReminder
                  ? Colors.accent
                  : Colors.textSecondary
              }
            />
            <View style={styles.menuTextContainer}>
              <Text
                style={[
                  styles.subMenuText,
                  !settings.enabled && styles.subMenuTextDisabled,
                ]}
              >
                식사 알림
              </Text>
            </View>
            <Switch
              value={settings.enabled && settings.mealReminder}
              onValueChange={(value) =>
                handleToggleSetting("mealReminder", value)
              }
              disabled={!settings.enabled}
              trackColor={{
                false: Colors.border,
                true: Colors.accent + "80",
              }}
              thumbColor={
                settings.enabled && settings.mealReminder
                  ? Colors.accent
                  : Colors.textTertiary
              }
              ios_backgroundColor={Colors.border}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    ...menuCardShadow,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  menuText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  menuSubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
  },
  subSettingsContainer: {
    paddingVertical: 8,
  },
  subSettingsTitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  subMenuText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  subMenuTextDisabled: {
    color: Colors.textTertiary,
  },
});
