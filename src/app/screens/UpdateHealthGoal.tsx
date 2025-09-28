import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HealthGoalSelector, healthGoals } from "../../components/HealthGoalSelector";
import { useHealthGoal } from "../../contexts/HealthGoalContext";
import { Colors, FontSizes } from "../../styles/common";

interface UpdateHealthGoalProps {
   onClose: () => void;
}

export default function UpdateHealthGoal({ onClose }: UpdateHealthGoalProps) {
   const { selectedGoals, setSelectedGoals } = useHealthGoal();
   const [localSelectedIds, setLocalSelectedIds] = useState<number[]>([]);

   useEffect(() => {
    // 기존 선택된 목표들을 로컬 상태에 설정
   setLocalSelectedIds(selectedGoals.map(goal => goal.id));
   }, [selectedGoals]);

   const toggleGoal = (goalId: number) => {
   setLocalSelectedIds(prev => {
      if (prev.includes(goalId)) {
         return prev.filter(id => id !== goalId);
      } else if (prev.length < 3) {
         return [...prev, goalId];
      }
      return prev;
      });
   };

   const handleSave = () => {
   if (localSelectedIds.length === 0) {
      alert("최소 1개의 건강 목표를 선택해주세요.");
      return;
   }
   
    // 선택된 목표들을 Context에 저장
   const selectedGoalsData = healthGoals.filter(goal => localSelectedIds.includes(goal.id));
   setSelectedGoals(selectedGoalsData);
   
   onClose();
   };

   const handleCancel = () => {
      onClose();
   };

   return (
      <View style={styles.container}>
         <View style={styles.header}>
         <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>취소</Text>
         </TouchableOpacity>
         <Text style={styles.headerTitle}>건강 목표 수정</Text>
         <TouchableOpacity 
            onPress={handleSave} 
            style={[
               styles.saveButton,
               localSelectedIds.length === 0 && styles.saveButtonDisabled
            ]}
            disabled={localSelectedIds.length === 0}
         >
            <Text style={[
               styles.saveButtonText,
               localSelectedIds.length === 0 && styles.saveButtonTextDisabled
            ]}>
               저장
            </Text>
         </TouchableOpacity>
      </View>

      <View style={styles.content}>
         <Text style={styles.subtitle}>나에게 맞는 건강 목표를 선택해주세요</Text>
         <Text style={styles.limitText}>최대 3개까지 선택 가능</Text>

         <HealthGoalSelector
            selectedGoalIds={localSelectedIds}
            onGoalToggle={toggleGoal}
            maxSelection={3}
         />

         <View style={styles.footer}>
            <Text style={styles.selectedCount}>
               {localSelectedIds.length}/3 선택됨
            </Text>
         </View>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: Colors.background,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      backgroundColor: Colors.surface,
   },
   cancelButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
   },
   cancelButtonText: {
      fontSize: FontSizes.base,
      color: Colors.textSecondary,
   },
   headerTitle: {
      fontSize: FontSizes.lg,
      fontWeight: "600",
      color: Colors.text,
   },
   saveButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: Colors.primary[500],
      borderRadius: 8,
   },
   saveButtonDisabled: {
      backgroundColor: Colors.border,
   },
   saveButtonText: {
      fontSize: FontSizes.base,
      fontWeight: "600",
      color: Colors.surface,
   },
   saveButtonTextDisabled: {
      color: Colors.textTertiary,
   },
   content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 20,
   },
   subtitle: {
      fontSize: FontSizes.lg,
      marginBottom: 8,
      color: Colors.textSecondary,
      textAlign: "center",
   },
   limitText: {
      fontSize: FontSizes.base,
      color: Colors.textTertiary,
      textAlign: "center",
      marginBottom: 24,
   },
   footer: {
      paddingVertical: 16,
      alignItems: "center",
   },
   selectedCount: {
      fontSize: FontSizes.base,
      color: Colors.textSecondary,
      textAlign: "center",
   },
});
