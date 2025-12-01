import { StyleSheet } from "react-native";
import { Colors, FontSizes, commonStyles } from "./common";

export const tabsStyles = StyleSheet.create({
  // 탭 화면 컨테이너
  container: {
    ...commonStyles.container,
  },
  // 헤더
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
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
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 20, // 하단 여백
  },

  // 섹션
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },

  // 임박 재료
  expiringContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    ...commonStyles.shadow,
  },
  expiringItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  expiringName: {
    fontSize: FontSizes.lg,
    fontWeight: "500",
    color: Colors.text,
  },
});
