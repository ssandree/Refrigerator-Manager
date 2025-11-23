import { router } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingFooterButton } from "../../src/components/onboarding/OnboardingFooterButton";
import { OnboardingProgress } from "../../src/components/onboarding/OnboardingProgress";
import { OnboardingTitle } from "../../src/components/onboarding/OnboardingTitle";
import { Colors, commonStyles, FontSizes } from "../../src/styles/common";
import { saveOnboardingData } from "../../src/utils/onboardingStorage";

export default function GetBmiActing() {
  const insets = useSafeAreaInsets();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<
    "veryLow" | "low" | "medium" | "high" | "veryHigh" | null
  >(null);

  const handleGoToNext = async () => {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    if (
      !height ||
      !weight ||
      !activity ||
      isNaN(heightNum) ||
      isNaN(weightNum)
    ) {
      return;
    }
    // 온보딩 데이터 저장
    await saveOnboardingData({
      height: heightNum,
      weight: weightNum,
      activityLevel: activity,
    });
    router.push("./GetHealthGoal");
  };

  const isFormValid = height && weight && activity;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* 컨텐츠 */}
        <View style={[styles.content, { paddingTop: insets.top + 30 }]}>
          {/* 진행 단계 + 타이틀 */}
          <View style={styles.headerSection}>
            <OnboardingProgress current={2} style={styles.progress} />
            <OnboardingTitle
              title="키, 몸무게, 활동량을 알려주세요"
              subtitle="BMI 계산과 칼로리 목표 설정을 위한 정보입니다"
            />
          </View>

          {/* 키 */}
          <Text style={styles.label}>키</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="키(cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>

          {/* 몸무게 */}
          <Text style={styles.label}>몸무게</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="몸무게(kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>

          {/* 활동량 */}
          <Text style={styles.label}>평소 활동량</Text>
          <View style={styles.row}>
            <Pressable
              style={[
                styles.option,
                activity === "veryLow" && styles.optionSelected,
              ]}
              onPress={() => setActivity("veryLow")}
            >
              <Text style={styles.optionText}>매우 적음</Text>
            </Pressable>
            <Pressable
              style={[
                styles.option,
                activity === "low" && styles.optionSelected,
              ]}
              onPress={() => setActivity("low")}
            >
              <Text style={styles.optionText}>적음</Text>
            </Pressable>
            <Pressable
              style={[
                styles.option,
                activity === "medium" && styles.optionSelected,
              ]}
              onPress={() => setActivity("medium")}
            >
              <Text style={styles.optionText}>보통</Text>
            </Pressable>
            <Pressable
              style={[
                styles.option,
                activity === "high" && styles.optionSelected,
              ]}
              onPress={() => setActivity("high")}
            >
              <Text style={styles.optionText}>많음</Text>
            </Pressable>
            <Pressable
              style={[
                styles.option,
                activity === "veryHigh" && styles.optionSelected,
              ]}
              onPress={() => setActivity("veryHigh")}
            >
              <Text style={styles.optionText}>매우 많음</Text>
            </Pressable>
          </View>
        </View>

        {/* 이전/다음 버튼 - 화면 하단 고정 */}
        <OnboardingFooterButton
          prevLabel="이전"
          onPressPrev={() => router.push("./GetSexAge")}
          label="다음"
          onPress={handleGoToNext}
          disabled={!isFormValid}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    backgroundColor: "#FFFFFF",
  },
  content: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 30,
    paddingBottom: 120, // 하단 고정 버튼 영역 확보
  },
  headerSection: {
    width: "100%",
    marginBottom: 30,
  },
  progress: {
    alignSelf: "flex-start",
  },
  progressDot: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.textPrimary,
  },
  progressDotInactive: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.textTertiary,
  },
  title: {
    fontSize: FontSizes["2xl"],
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    marginBottom: 24,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  label: {
    fontSize: FontSizes.lg,
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
    color: Colors.textPrimary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  option: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: Colors.surface,
  },
  optionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  inputContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    ...commonStyles.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "50%",
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSizes.xl,
    fontWeight: "600",
  },
});
