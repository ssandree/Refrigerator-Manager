// 알림 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";
import { persist } from "zustand/middleware";
import notificationService, {
  Notification,
} from "../services/notificationService";
import { getErrorMessage } from "../utils/storeErrorHandler";
import { createSecureStorage } from "./storage";
import { createGetEntityById } from "./storeCrudHelpers";
import { validateArray, validateSyncTimestamp } from "./storeUtils";

// 초기값: 빈 배열 (서버에서 로드)
const initialNotifications: Notification[] = [];

// 스토어 상태와 액션 정의
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  error: string | null;
  isLoading: boolean;
  lastSyncedAt: number | null; // 마지막 서버 동기화 시간
  // 단건 조회
  getNotificationById: (id: string) => Notification | undefined;
  // 알림 삭제
  removeNotification: (id: string) => Promise<boolean>;
  // 알림 읽음 처리
  markAsRead: (notiId: string) => Promise<boolean>;
  // 전체 알림 읽음 처리
  markAllAsRead: () => Promise<boolean>;
  // 전체 초기화
  clearAllNotifications: () => void;
  clearError: () => void;
  // Service를 통해 데이터 로드
  loadNotifications: (
    read?: boolean | null,
    limit?: number,
    offset?: number,
    force?: boolean
  ) => Promise<void>;
  // 읽지 않은 알림 개수 로드
  loadUnreadCount: (force?: boolean) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: initialNotifications,
      unreadCount: 0,
      error: null,
      isLoading: false,
      lastSyncedAt: null,

      // ID로 단건 조회
      getNotificationById: createGetEntityById<Notification>(
        () => get().notifications
      ),

      // 알림 삭제 (서버에서 삭제)
      removeNotification: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await notificationService.deleteNotification(id);

          if (response.success) {
            set((state) => ({
              notifications: state.notifications.filter(
                (noti) => noti.id !== id
              ),
              error: null,
              lastSyncedAt: Date.now(),
            }));
            // 읽지 않은 개수 다시 로드
            await get().loadUnreadCount(true);
            return true;
          } else {
            const errorMessage =
              response.message ?? "알림 삭제에 실패했습니다.";
            set({ error: errorMessage });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "알림 삭제 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // 알림 읽음 처리 (서버에 저장)
      markAsRead: async (notiId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await notificationService.markAsRead(notiId);

          if (response.success && response.data) {
            set((state) => ({
              notifications: state.notifications.map((noti) =>
                noti.id === notiId ? { ...noti, read: true } : noti
              ),
              error: null,
              lastSyncedAt: Date.now(),
            }));
            // 읽지 않은 개수 다시 로드
            await get().loadUnreadCount(true);
            return true;
          } else {
            const errorMessage =
              response.message ?? "알림 읽음 처리에 실패했습니다.";
            set({ error: errorMessage });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "알림 읽음 처리 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // 전체 알림 읽음 처리 (서버에 저장)
      markAllAsRead: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await notificationService.markAllAsRead();

          if (response.success) {
            set((state) => ({
              notifications: state.notifications.map((noti) => ({
                ...noti,
                read: true,
              })),
              unreadCount: 0,
              error: null,
              lastSyncedAt: Date.now(),
            }));
            return true;
          } else {
            const errorMessage =
              response.message ?? "전체 알림 읽음 처리에 실패했습니다.";
            set({ error: errorMessage });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "전체 알림 읽음 처리 중 오류가 발생했습니다."
          );
          set({ error: errorMessage });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      // 전체 초기화
      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0, error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      // Service를 통해 데이터 로드
      loadNotifications: async (
        read?: boolean | null,
        limit: number = 50,
        offset: number = 0,
        force: boolean = false
      ) => {
        const state = get();
        // persist로 복원된 데이터가 있고 강제 로드가 아니면 서버 요청 생략
        if (!force && state.notifications.length > 0 && state.lastSyncedAt) {
          const timeSinceSync = Date.now() - state.lastSyncedAt;
          // 5분 이내에 동기화했으면 서버 요청 생략
          if (timeSinceSync < 5 * 60 * 1000) {
            return;
          }
        }

        try {
          set({ isLoading: true, error: null });
          const response = await notificationService.getAllNotifications(
            read,
            limit,
            offset
          );

          if (response.success && response.data) {
            set({
              notifications: response.data,
              error: null,
              lastSyncedAt: Date.now(),
            });
            // 읽지 않은 개수도 함께 로드
            await get().loadUnreadCount(true);
          } else {
            set({
              error: response.message ?? "알림 목록을 불러오는데 실패했습니다.",
              lastSyncedAt: Date.now(),
            });
          }
        } catch (error: unknown) {
          const errorMessage = getErrorMessage(
            error,
            "알림 목록을 불러오는 중 오류가 발생했습니다."
          );
          set({
            error: errorMessage,
            lastSyncedAt: Date.now(),
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // 읽지 않은 알림 개수 로드
      loadUnreadCount: async (force: boolean = false) => {
        try {
          const response = await notificationService.getUnreadCount();

          if (response.success && response.data) {
            set({
              unreadCount: response.data.unreadCount,
              error: null,
            });
          }
        } catch (error: unknown) {
          // 읽지 않은 개수 로드 실패는 조용히 처리 (에러 표시 안 함)
          console.error("읽지 않은 알림 개수 로드 실패:", error);
        }
      },
    }),
    {
      name: "notification-storage",
      storage:
        createSecureStorage<
          Pick<
            NotificationState,
            "notifications" | "unreadCount" | "lastSyncedAt"
          >
        >(),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        lastSyncedAt: state.lastSyncedAt,
      }),
      // 하이드레이션 완료 후 검증
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.notifications = validateArray<Notification>(
            state.notifications,
            "NotificationStore"
          );
          state.lastSyncedAt = validateSyncTimestamp(
            state.lastSyncedAt,
            "NotificationStore"
          );
        } else {
          return {
            notifications: initialNotifications,
            unreadCount: 0,
            lastSyncedAt: null,
          };
        }
      },
    }
  )
);
