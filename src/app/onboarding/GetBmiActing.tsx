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

export default function GetBmiActing() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<"low" | "medium" | "high" | "veryHigh" | null>(null);

  const handleGoToNext = () => {
    router.push("./GetHealthGoal");
  };

  const isFormValid = height && weight && activity;

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
        <Text style={styles.progressDotInactive}>●</Text>
        <Text style={styles.progressDot}>●</Text>
        <Text style={styles.progressDotInactive}>●</Text>
      </View>

      <Text style={styles.title}>키, 몸무게, 활동량을 알려주세요</Text>
      <Text style={styles.subtitle}>BMI 계산과 칼로리 목표 설정을 위한 정보입니다</Text>

      {/* 키 */}
      <Text style={styles.label}>키</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="키(cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
      </View>
      
      {/* 몸무게 */}
      <Text style={styles.label}>몸무게</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    justifyContent: "flex-start",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center",
  },
  progress: {
    flexDirection: "row",
    marginBottom: 20,
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
