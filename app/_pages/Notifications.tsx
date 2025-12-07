import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useAutoLoadData } from "../../src/hooks/useAutoLoadData";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { useNotificationStore } from "../../src/stores/useNotificationStore";
import { Colors, FontSizes, createShadowStyle } from "../../src/styles/common";
import { getKoreaNow } from "../../src/utils/dateUtils";

export default function Notifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const loadNotifications = useNotificationStore(
    (state) => state.loadNotifications
  );
  const loadUnreadCount = useNotificationStore(
    (state) => state.loadUnreadCount
  );
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification
  );
  const isLoading = useNotificationStore((state) => state.isLoading);
  const lastSyncedAt = useNotificationStore((state) => state.lastSyncedAt);
  const [refreshing, setRefreshing] = useState(false);
  const [filterRead, setFilterRead] = useState<boolean | null>(null);

  useStoreWithError(useNotificationStore);

  // 읽지 않은 개수 로드
  React.useEffect(() => {
    loadUnreadCount(false);
  }, [loadUnreadCount]);

  // 필터 변경 시 알림 다시 로드
  React.useEffect(() => {
    loadNotifications(filterRead, 50, 0, true);
  }, [filterRead, loadNotifications]);

  // 초기 로드 (필터가 null일 때만)
  useAutoLoadData(
    notifications,
    isLoading,
    async () => {
      if (filterRead === null) {
        await loadNotifications(null);
      }
    },
    {
      checkLastSynced: true,
      lastSyncedAt,
    }
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadNotifications(filterRead, 50, 0, true),
        loadUnreadCount(true),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [loadNotifications, loadUnreadCount, filterRead]);

  const handleMarkAsRead = useCallback(
    async (notiId: string) => {
      await markAsRead(notiId);
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
    await loadUnreadCount(true);
  }, [markAllAsRead, loadUnreadCount]);

  const handleDelete = useCallback(
    async (notiId: string) => {
      await removeNotification(notiId);
    },
    [removeNotification]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // 한국 시간 기준 현재 시간 사용
    const now = getKoreaNow();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    // 한국 시간 기준으로 날짜 표시
    return date.toLocaleDateString("ko-KR", {
      timeZone: "Asia/Seoul",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "EXPIRY_WARNING":
        return "time-outline";
      case "EXPIRY_EXPIRED":
        return "alert-circle-outline";
      case "RECIPE_RECOMMENDATION":
        return "restaurant-outline";
      case "HEALTH_GOAL_REMINDER":
        return "fitness-outline";
      case "MEAL_REMINDER":
        return "fast-food-outline";
      default:
        return "notifications-outline";
    }
  };

  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case "EXPIRY_WARNING":
        return Colors.warning;
      case "EXPIRY_EXPIRED":
        return Colors.error;
      case "RECIPE_RECOMMENDATION":
        return Colors.primary;
      case "HEALTH_GOAL_REMINDER":
        return Colors.secondary;
      case "MEAL_REMINDER":
        return Colors.accent;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/(tabs)/Home");
                }
              }}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>알림</Text>
            <View style={styles.headerRight} />
          </View>

          {/* 필터 버튼 */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterRead === null && styles.filterButtonActive,
              ]}
              onPress={() => setFilterRead(null)}
            >
              <Ionicons
                name="list-outline"
                size={16}
                color={
                  filterRead === null ? Colors.textLight : Colors.textSecondary
                }
                style={styles.filterIcon}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  filterRead === null && styles.filterButtonTextActive,
                ]}
              >
                전체
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterRead === false && styles.filterButtonActive,
              ]}
              onPress={() => setFilterRead(false)}
            >
              <Ionicons
                name="mail-unread-outline"
                size={16}
                color={
                  filterRead === false ? Colors.textLight : Colors.textSecondary
                }
                style={styles.filterIcon}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  filterRead === false && styles.filterButtonTextActive,
                ]}
              >
                읽지 않음
              </Text>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterRead === true && styles.filterButtonActive,
              ]}
              onPress={() => setFilterRead(true)}
            >
              <Ionicons
                name="mail-outline"
                size={16}
                color={
                  filterRead === true ? Colors.textLight : Colors.textSecondary
                }
                style={styles.filterIcon}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  filterRead === true && styles.filterButtonTextActive,
                ]}
              >
                읽음
              </Text>
            </TouchableOpacity>
          </View>

          {/* 읽지 않은 알림이 있고 전체/읽지 않음 필터일 때 전체 읽음 처리 버튼 */}
          {unreadCount > 0 && filterRead !== true && (
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.markAllReadButton}
                onPress={handleMarkAllAsRead}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={18}
                  color={Colors.textLight}
                  style={styles.markAllReadIcon}
                />
                <Text style={styles.markAllReadButtonText}>전체 읽음 처리</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 알림 목록 */}
          {isLoading && notifications.length === 0 ? (
            <LoadingSpinner message="알림을 불러오는 중..." fullScreen />
          ) : notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name="notifications-off-outline"
                  size={64}
                  color={Colors.textTertiary}
                />
              </View>
              <Text style={styles.emptyStateTitle}>알림이 없습니다</Text>
              <Text style={styles.emptyStateText}>
                새로운 알림이 오면 여기에 표시됩니다
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {notifications.map((noti) => (
                <View
                  key={noti.id}
                  style={[
                    styles.notificationItem,
                    !noti.read && styles.notificationItemUnread,
                  ]}
                >
                  <View style={styles.notificationIconContainer}>
                    <View
                      style={[
                        styles.notificationIconWrapper,
                        {
                          backgroundColor: `${getNotificationIconColor(
                            noti.type
                          )}15`,
                        },
                      ]}
                    >
                      <Ionicons
                        name={getNotificationIcon(noti.type) as any}
                        size={24}
                        color={getNotificationIconColor(noti.type)}
                      />
                    </View>
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>{noti.title}</Text>
                      {!noti.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage}>
                      {noti.message}
                    </Text>
                    <View style={styles.notificationFooter}>
                      <View style={styles.dateContainer}>
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color={Colors.textTertiary}
                          style={styles.dateIcon}
                        />
                        <Text style={styles.notificationDate}>
                          {formatDate(noti.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.notificationActions}>
                    {!noti.read && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleMarkAsRead(noti.id)}
                      >
                        <Ionicons
                          name="checkmark-outline"
                          size={16}
                          color={Colors.textLight}
                          style={styles.actionIcon}
                        />
                        <Text style={styles.actionButtonText}>읽음</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(noti.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color={Colors.textLight}
                        style={styles.actionIcon}
                      />
                      <Text
                        style={[
                          styles.actionButtonText,
                          styles.deleteButtonText,
                        ]}
                      >
                        삭제
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const cardShadow = createShadowStyle({
  opacity: 0.08,
  radius: 8,
  elevation: 3,
});

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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.primary,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 60, // 뒤로 버튼과 균형을 맞추기 위한 공간
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterIcon: {
    marginRight: 4,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: Colors.textLight,
    fontWeight: "600",
  },
  badge: {
    marginLeft: 6,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    fontWeight: "700",
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  markAllReadButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
  },
  markAllReadIcon: {
    marginRight: 6,
  },
  markAllReadButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...cardShadow,
  },
  notificationItemUnread: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: `${Colors.primaryLight}20`,
  },
  notificationIconContainer: {
    marginRight: 12,
  },
  notificationIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  notificationFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    marginRight: 4,
  },
  notificationDate: {
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
  },
  notificationActions: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
  },
  actionIcon: {
    marginRight: 4,
  },
  deleteButton: {
    backgroundColor: Colors.error,
  },
  actionButtonText: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    fontWeight: "500",
  },
  deleteButtonText: {
    color: Colors.textLight,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateTitle: {
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: FontSizes.base,
    color: Colors.textTertiary,
    textAlign: "center",
    lineHeight: 22,
  },
});
