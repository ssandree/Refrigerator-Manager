import { router } from "expo-router";
import { ChevronRight, Heart, Trophy } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileCircle from "../../../components/ProfileCircle";
import { activityLabelMap } from "../../../data/mockHealthMetrics";
import { authService } from "../../../services/authService";
import { useAuthStore } from "../../../stores/useAuthStore";
import { Colors, FontSizes } from "../../../styles/common";

// 활동 레벨을 mockHealthMetrics의 ActivityLevel 타입으로 변환
function normalizeActivityLevel(
  activityLevel?: string | null
): "sedentary" | "light" | "moderate" | "active" | "veryActive" | null {
  if (!activityLevel) return null;
  const normalized = activityLevel.toLowerCase();
  if (normalized === "verylow" || normalized === "sedentary")
    return "sedentary";
  if (normalized === "low" || normalized === "light") return "light";
  if (normalized === "medium" || normalized === "moderate") return "moderate";
  if (normalized === "high" || normalized === "active") return "active";
  if (normalized === "veryhigh" || normalized === "veryactive")
    return "veryActive";
  return null;
}

interface ProfileSectionProps {
  onLikeRecipePress: () => void;
  onBadgePress?: () => void;
}

export default function ProfileSection({
  onLikeRecipePress,
  onBadgePress,
}: ProfileSectionProps) {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const updateUserRef = useRef(updateUser);
  updateUserRef.current = updateUser;

  // 사용자 정보 로드
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          updateUserRef.current({
            age: response.data.age ?? null,
            sex: response.data.sex ?? null,
            height: response.data.height ?? null,
            weight: response.data.weight ?? null,
            activityLevel: response.data.activityLevel ?? null,
            bmi: response.data.bmi ?? null,
          });
        }
      } catch (error) {
        console.error("사용자 정보 로드 실패:", error);
      }
    };
    loadUserInfo();
  }, []);

  const normalizedActivityLevel = normalizeActivityLevel(user?.activityLevel);
  const activityLabel = normalizedActivityLevel
    ? activityLabelMap[normalizedActivityLevel]
    : "정보 없음";

  return (
    <View
      style={[
        styles.profileSection,
        {
          backgroundColor: Colors.surface,
          borderBottomColor: Colors.border,
        },
      ]}
    >
      <View style={styles.userInfo}>
        <ProfileCircle size={60} style={styles.profileImageContainer} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user?.name || "사용자"}</Text>
          <Text style={styles.userEmail}>{user?.email || ""}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/_pages/UpdateUserInfo")}
        >
          <Text style={styles.editButtonText}>내 정보 수정하기</Text>
        </TouchableOpacity>
      </View>

      {/* 키, 몸무게, 활동 지수 텍스트 표시 */}
      <View style={styles.healthInfo}>
        <Text style={styles.healthInfoText}>
          키 {user?.height ? `${Math.round(user.height)}cm` : "정보 없음"} ·{" "}
          몸무게 {user?.weight ? `${Math.round(user.weight)}kg` : "정보 없음"} ·{" "}
          활동지수 {activityLabel}
        </Text>
      </View>

      <View style={styles.profileMenu}>
        <TouchableOpacity
          style={styles.profileMenuItem}
          onPress={onLikeRecipePress}
        >
          <Heart size={20} color={Colors.textSecondary} strokeWidth={2} />
          <Text style={styles.profileMenuText}>즐겨찾기 레시피</Text>
          <ChevronRight size={16} color={Colors.textTertiary} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileMenuItem} onPress={onBadgePress}>
          <Trophy size={20} color={Colors.textSecondary} strokeWidth={2} />
          <Text style={styles.profileMenuText}>주간 목표 달성도</Text>
          <ChevronRight size={16} color={Colors.textTertiary} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: Colors.surface,
    flexDirection: "column",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: "flex-start",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  profileImageContainer: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
    marginRight: 8,
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editButtonText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  profileMenu: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  profileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 6,
    flex: 1,
  },
  profileMenuText: {
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
  },
  healthInfo: {
    marginTop: 12,
    width: "100%",
  },
  healthInfoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
