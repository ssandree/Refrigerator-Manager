import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors, commonStyles, FontSizes } from "../../styles/common";
import { OnboardingFooterButton } from "./components/OnboardingFooterButton";
import { OnboardingProgress } from "./components/OnboardingProgress";
import { OnboardingTitle } from "./components/OnboardingTitle";

export default function GetSexAge() {
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [age, setAge] = useState("");

  const handleGoToNext = () => {
    router.push("./GetBmiActing");
  };

  const isFormValid = gender && age;

  return (
    <View style={styles.container}>
      {/* 컨텐츠 */}
      <View style={styles.content}>
        {/* 진행 단계 + 타이틀 */}
        <OnboardingProgress current={1} style={{ alignSelf: "flex-start" }} />
        <OnboardingTitle
          title="성별과 나이를 알려주세요"
          subtitle="맞춤형 건강 목표를 설정하기 위한 기본 정보입니다"
        />

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
            style={[styles.option, gender === "male" && styles.optionSelected]}
            onPress={() => setGender("male")}
          >
            <Text style={styles.optionText}>남성</Text>
          </Pressable>
        </View>

        {/* 나이 입력 */}
        <Text style={styles.label}>나이</Text>
        <TextInput
          style={styles.input}
          placeholder="나이를 입력하세요"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </View>

      {/* 이전/다음 버튼 - 화면 하단 고정 */}
      <OnboardingFooterButton
        prevLabel="이전"
        onPressPrev={() => {}}
        prevDisabled={true}
        label="다음"
        onPress={handleGoToNext}
        disabled={!isFormValid}
      />
    </View>
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
    paddingTop: 30,
    paddingBottom: 120, // 하단 고정 버튼 영역 확보
    alignItems: "center",
    justifyContent: "center",
  },
  progress: {
    flexDirection: "row",
    marginBottom: 50,
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
    marginLeft: 20,
    marginRight: 20,
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
  input: {
    ...commonStyles.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
