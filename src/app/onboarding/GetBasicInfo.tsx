import { router } from "expo-router";
import React, { useState } from "react";
import {
   Pressable,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";

export default function GetBasicInfo() {
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [activity, setActivity] = useState<"low" | "medium" | "high" | "veryHigh" | null>(null);

  const handleGoToNext = () => {
    router.push("./GetGoalInfo");
  };

  const isFormValid = gender && age && height && activity;

  return (
    <View style={styles.container}>
      {/* 진행 단계 */}
      <View style={styles.progress}>
        <Text style={styles.progressDot}>●</Text>
        <Text style={styles.progressDotInactive}>●</Text>
        <Text style={styles.progressDotInactive}>●</Text>
        <Text style={styles.progressDotInactive}>●</Text>
      </View>

      <Text style={styles.title}>맞춤 목표 계산 시작!</Text>
      <Text style={styles.subtitle}>기본 정보를 알려주세요</Text>

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

      {/* 나이, 키 */}
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="나이"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, { flex: 1, marginLeft: 10 }]}
          placeholder="키(cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
      </View>

      {/* 활동량 */}
      <Text style={styles.label}>평소 활동량</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.option, activity === "low" && styles.optionSelected]}
          onPress={() => setActivity("low")}
        >
          <Text style={styles.optionText}>적음</Text>
        </Pressable>
        <Pressable
          style={[styles.option, activity === "medium" && styles.optionSelected]}
          onPress={() => setActivity("medium")}
        >
          <Text style={styles.optionText}>보통</Text>
        </Pressable>
        <Pressable
          style={[styles.option, activity === "high" && styles.optionSelected]}
          onPress={() => setActivity("high")}
        >
          <Text style={styles.optionText}>많음</Text>
        </Pressable>
        <Pressable
          style={[styles.option, activity === "veryHigh" && styles.optionSelected]}
          onPress={() => setActivity("veryHigh")}
        >
          <Text style={styles.optionText}>매우 많음</Text>
        </Pressable>
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[styles.button, !isFormValid && { backgroundColor: "#ccc" }]}
        disabled={!isFormValid}
        onPress={handleGoToNext}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "flex-start",
  },
  progress: {
    flexDirection: "row",
    marginBottom: 20,
  },
  progressDot: {
    fontSize: 16,
    marginRight: 8,
    color: "#000",
  },
  progressDotInactive: {
    fontSize: 16,
    marginRight: 8,
    color: "#ccc",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: "#555",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
