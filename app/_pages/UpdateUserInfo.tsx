import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { useStoreWithError } from "../../src/hooks/useStoreWithError";
import { authService } from "../../src/services/authService";
import { useAuthStore } from "../../src/stores/useAuthStore";
import { Colors, FontSizes } from "../../src/styles/common";

export default function UpdateUserInfo() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { clearError } = useStoreWithError(useAuthStore);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "">("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 활동량 옵션 (온보딩과 동일한 형식 사용)
  const activityOptions = [
    { value: "veryLow", label: "매우 적음" },
    { value: "low", label: "적음" },
    { value: "medium", label: "보통" },
    { value: "high", label: "많음" },
    { value: "veryHigh", label: "매우 많음" },
  ];

  // 사용자 정보 로드
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAge(user.age?.toString() || "");
      setSex(
        user.sex === "male" || user.sex === "남성"
          ? "male"
          : user.sex === "female" || user.sex === "여성"
          ? "female"
          : ""
      );
      setWeight(user.weight?.toString() || "");
      setHeight(user.height?.toString() || "");
      setActivityLevel(user.activityLevel || "");
    }
  }, [user]);

  // BMI 계산
  const calculateBMI = (w: number, h: number): number => {
    if (h <= 0) return 0;
    const heightInMeters = h / 100;
    return w / (heightInMeters * heightInMeters);
  };

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert("오류", "사용자 정보를 찾을 수 없습니다.");
      return;
    }

    // 유효성 검사
    if (!name.trim()) {
      Alert.alert("오류", "이름을 입력해주세요.");
      return;
    }

    const ageNum = age ? parseInt(age, 10) : null;
    const weightNum = weight ? parseFloat(weight) : null;
    const heightNum = height ? parseFloat(height) : null;

    if (ageNum !== null && (ageNum < 1 || ageNum > 150)) {
      Alert.alert("오류", "나이는 1~150 사이의 값이어야 합니다.");
      return;
    }

    if (weightNum !== null && (weightNum < 1 || weightNum > 500)) {
      Alert.alert("오류", "몸무게는 1~500 사이의 값이어야 합니다.");
      return;
    }

    if (heightNum !== null && (heightNum < 1 || heightNum > 300)) {
      Alert.alert("오류", "키는 1~300 사이의 값이어야 합니다.");
      return;
    }

    // BMI 계산
    const bmi =
      weightNum && heightNum ? calculateBMI(weightNum, heightNum) : null;

    clearError();
    setIsSaving(true);

    try {
      const response = await authService.updateUser(user.id, {
        name: name.trim(),
        age: ageNum,
        sex: sex || null,
        weight: weightNum,
        height: heightNum,
        activityLevel: activityLevel || null,
        bmi: bmi,
      });

      if (response.success && response.data) {
        // 스토어 업데이트
        updateUser({
          name: response.data.name,
          age: response.data.age ?? null,
          sex: response.data.sex ?? null,
          weight: response.data.weight ?? null,
          height: response.data.height ?? null,
          activityLevel: response.data.activityLevel ?? null,
          bmi: response.data.bmi ?? null,
        });

        Alert.alert("성공", "사용자 정보가 성공적으로 수정되었습니다!", [
          {
            text: "확인",
            onPress: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)/MyInfo");
              }
            },
          },
        ]);
      } else {
        Alert.alert(
          "오류",
          response.message || "사용자 정보 수정에 실패했습니다."
        );
      }
    } catch {
      Alert.alert("오류", "사용자 정보 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving) {
    return <LoadingSpinner message="저장 중..." fullScreen />;
  }

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
                  router.replace("/(tabs)/MyInfo");
                }
              }}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>내 정보 수정</Text>
            <View style={styles.headerRight} />
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 이름 */}
            <View style={styles.section}>
              <Text style={styles.label}>이름 *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="이름을 입력하세요"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            {/* 나이 */}
            <View style={styles.section}>
              <Text style={styles.label}>나이</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="나이를 입력하세요"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="number-pad"
              />
            </View>

            {/* 성별 */}
            <View style={styles.section}>
              <Text style={styles.label}>성별</Text>
              <View style={styles.sexContainer}>
                <TouchableOpacity
                  style={[
                    styles.sexButton,
                    sex === "male" && styles.sexButtonActive,
                  ]}
                  onPress={() => setSex("male")}
                >
                  <Text
                    style={[
                      styles.sexButtonText,
                      sex === "male" && styles.sexButtonTextActive,
                    ]}
                  >
                    남성
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sexButton,
                    sex === "female" && styles.sexButtonActive,
                  ]}
                  onPress={() => setSex("female")}
                >
                  <Text
                    style={[
                      styles.sexButtonText,
                      sex === "female" && styles.sexButtonTextActive,
                    ]}
                  >
                    여성
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 몸무게 */}
            <View style={styles.section}>
              <Text style={styles.label}>몸무게 (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="몸무게를 입력하세요"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>

            {/* 키 */}
            <View style={styles.section}>
              <Text style={styles.label}>키 (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="키를 입력하세요"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>

            {/* 활동량 */}
            <View style={styles.section}>
              <Text style={styles.label}>활동량</Text>
              {activityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.activityButton,
                    activityLevel === option.value &&
                      styles.activityButtonActive,
                  ]}
                  onPress={() => setActivityLevel(option.value)}
                >
                  <Text
                    style={[
                      styles.activityButtonText,
                      activityLevel === option.value &&
                        styles.activityButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 저장 버튼 */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
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
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: FontSizes.base,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sexContainer: {
    flexDirection: "row",
    gap: 12,
  },
  sexButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: "center",
  },
  sexButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sexButtonText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  sexButtonTextActive: {
    color: Colors.textLight,
    fontWeight: "600",
  },
  activityButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: 8,
  },
  activityButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  activityButtonText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  activityButtonTextActive: {
    color: Colors.textLight,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: Colors.textLight,
    fontSize: FontSizes.lg,
    fontWeight: "600",
  },
});
