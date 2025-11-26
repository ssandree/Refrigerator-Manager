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

export default function GetSexAge() {
  const insets = useSafeAreaInsets();
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [age, setAge] = useState("");

  const handleGoToNext = async () => {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150 || !gender) {
      return;
    }
    // 온보딩 데이터 저장
    await saveOnboardingData({
      sex: gender,
      age: ageNum,
    });
    router.push("./GetBmiActing");
  };

  const ageNum = parseInt(age, 10);
  const isAgeValid = !isNaN(ageNum) && ageNum >= 1 && ageNum <= 150;
  const isFormValid = gender && age && isAgeValid;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* 컨텐츠 */}
        <View style={[styles.content, { paddingTop: insets.top + 30 }]}>
          {/* 진행 단계 + 타이틀 */}
          <View style={styles.headerSection}>
            <OnboardingProgress current={1} style={styles.progress} />
            <OnboardingTitle
              title="성별과 나이를 알려주세요"
              subtitle="맞춤형 건강 목표를 설정하기 위한 기본 정보입니다"
            />
          </View>

          {/* 성별 선택 */}
          <Text style={styles.label}>성별</Text>
          <View style={styles.row}>
            <Pressable
              style={[
                styles.option,
                gender === "female" && styles.optionSelected,
              ]}
              onPress={() => setGender("female")}
            >
              <Text style={styles.optionText}>여성</Text>
            </Pressable>
            <Pressable
              style={[
                styles.option,
                gender === "male" && styles.optionSelected,
              ]}
              onPress={() => setGender("male")}
            >
              <Text style={styles.optionText}>남성</Text>
            </Pressable>
          </View>

          {/* 나이 입력 */}
          <Text style={styles.label}>나이</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="나이를 입력하세요"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* 이전/다음 버튼 - 화면 하단 고정 */}
        <OnboardingFooterButton
          prevLabel="이전"
          onPressPrev={() => {
            // 첫 번째 온보딩 화면이므로 뒤로 갈 수 없음
            // 안전하게 로그인 화면으로 이동
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(auth)/Login");
            }
          }}
          prevDisabled={true}
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
    overflow: "hidden",
  },
  content: {
    flex: 1,
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
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  inputContainer: {
    alignItems: "center",
    marginBottom: 20,
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
  input: {
    ...commonStyles.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "50%",
  },
});
