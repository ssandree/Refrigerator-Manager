// Notification service for managing user notifications
import apiClient, { ApiResponse } from "./apiClient";

// Notification domain model
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  relatedfoodId: string | null;
  relatedRecipeId: string | null;
  read: boolean;
  createdAt: string;
}

class NotificationService {
  private readonly basePath = "/notifications";

  /**
   * Get all notifications for the current user
   * @param read - Filter by read status (true/false/null for all)
   * @param limit - Maximum number of notifications to return (default: 50)
   * @param offset - Number of notifications to skip (default: 0)
   */
  async getAllNotifications(
    read?: boolean | null,
    limit: number = 50,
    offset: number = 0
  ): Promise<ApiResponse<Notification[]>> {
    const params = new URLSearchParams();
    if (read !== undefined && read !== null) {
      params.append("read", read.toString());
    }
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    return await apiClient.get<Notification[]>(endpoint);
  }

  /**
   * Get a specific notification by ID
   */
  async getNotificationById(
    notiId: string
  ): Promise<ApiResponse<Notification>> {
    return await apiClient.get<Notification>(`${this.basePath}/${notiId}`);
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    return await apiClient.get<{ unreadCount: number }>(
      `${this.basePath}/unread-count`
    );
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notiId: string): Promise<ApiResponse<Notification>> {
    return await apiClient.patch<Notification>(
      `${this.basePath}/${notiId}/read`,
      {}
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.patch<{ message: string }>(
      `${this.basePath}/read-all`,
      {}
    );
  }

  /**
   * Delete a notification
   */
  async deleteNotification(
    notiId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<{ message: string }>(
      `${this.basePath}/${notiId}`
    );
  }
}

export const notificationService = new NotificationService();
export default notificationService;
