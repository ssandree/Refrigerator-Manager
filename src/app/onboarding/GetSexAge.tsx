import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, commonStyles, FontSizes } from "../../styles/common";

export default function GetSexAge() {
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [age, setAge] = useState("");

  const handleGoToNext = () => {
    router.push("./GetBmiActing");
  };

  const isFormValid = gender && age;

  return (
    <>
      <Stack.Screen 
        options={{
          title: "기본정보 입력",
          headerBackVisible: true,
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTintColor: "#333",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
        }}
      />
      <View style={styles.container}>
        {/* 컨텐츠 */}
        <View style={styles.content}>
        {/* 진행 단계 */}
        <View style={styles.progress}>
        <Text style={styles.progressDot}>●</Text>
        <Text style={styles.progressDotInactive}>●</Text>
        <Text style={styles.progressDotInactive}>●</Text>
      </View>

      <Text style={styles.title}>성별과 나이를 알려주세요</Text>
      <Text style={styles.subtitle}>맞춤형 건강 목표를 설정하기 위한 기본 정보입니다</Text>

      {/* 성별 선택 */}
      <Text style={styles.label}>성별</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.option, gender === "female" && styles.optionSelected]}
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

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[styles.button, !isFormValid && { backgroundColor: "#ccc" }]}
        disabled={!isFormValid}
        onPress={handleGoToNext}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
      </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: "center",
  },
  progress: {
    flexDirection: "row",
    marginBottom: 50,
    alignSelf: "flex-start",
  },
  progressDot: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.text,
  },
  progressDotInactive: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.textTertiary,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    marginLeft: 20,
    marginRight:20,
    marginBottom: 24,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  label: {
    fontSize: FontSizes.lg,
    marginTop: 24,
    marginBottom: 8,
    textAlign: "center",
    color: Colors.text,
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
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  optionText: {
    fontSize: FontSizes.lg,
    color: Colors.text,
  },
  input: {
    ...commonStyles.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: Colors.primary[500],
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 25,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: Colors.surface,
    fontSize: FontSizes.xl,
    fontWeight: "600",
  },
});
