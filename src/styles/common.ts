// 역할: 앱 전반에서 재사용할 색상/폰트/공통 스타일을 모아두는 스타일 유틸
// Colors 상수 재노출, 추가 color 팔레트, 폰트 크기, 자주 쓰는 레이아웃/컴포넌트 스타일 제공
import { StyleSheet } from "react-native";
import { Colors as ColorsConstants } from "./colors";

// Re-export Colors from constants for convenience
export const Colors = ColorsConstants;

// Additional color objects that might be needed
export const ColorObjects = {
  primary: {
    50: "#E8F5E8",
    100: "#D5ECB0",
    500: "#4CAF50",
    600: "#388E3C",
    700: "#2E7D32",
  },
  secondary: {
    50: "#E3F2FD",
    100: "#BBDEFB",
    500: "#2196F3",
    600: "#1976D2",
    700: "#1565C0",
  },
} as const;

// 폰트 크기 상수
export const FontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  "2xl": 20,
  "3xl": 24,
  "4xl": 28,
} as const;

// 공통 스타일
export const commonStyles = StyleSheet.create({
  // 레이아웃
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  // 카드
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // 버튼
  button: {
    backgroundColor: ColorObjects.primary[500],
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },

  // 입력
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: FontSizes.lg,
    backgroundColor: Colors.surface,
  },

  // 텍스트
  title: {
    fontSize: FontSizes["3xl"],
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: FontSizes.xl,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  text: {
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  textSecondary: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  textTertiary: {
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
  },

  // 그림자
  shadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // 구분선
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },

  // 배지
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: FontSizes.sm,
    fontWeight: "600",
    color: Colors.surface,
  },
});
