import { HealthGoal } from "../stores/useHealthGoalStore";

export const mockHealthGoals: HealthGoal[] = [
  {
    id: 1,
    title: "체중 유지",
    description: "현재 체중을 건강하게 유지",
    icon: "scale-outline",
    color: "#4CAF50",
  },
  {
    id: 2,
    title: "체지방 감량",
    description: "건강한 체지방 감소",
    icon: "trending-down-outline",
    color: "#FF9800",
  },
  {
    id: 3,
    title: "단백질 보충",
    description: "근육 건강을 위한 단백질 섭취",
    icon: "fitness-outline",
    color: "#2196F3",
  },
  {
    id: 4,
    title: "체중 증량",
    description: "체중을 늘리기",
    icon: "heart-outline",
    color: "#F44336",
  },
  {
    id: 5,
    title: "혈당 관리",
    description: "안정적인 혈당 수치 유지",
    icon: "pulse-outline",
    color: "#9C27B0",
  },
  {
    id: 6,
    title: "면역력 강화",
    description: "체내 면역 시스템 강화",
    icon: "shield-outline",
    color: "#00BCD4",
  },
  {
    id: 7,
    title: "체력 유지/향상",
    description: "전반적인 체력 증진",
    icon: "flash-outline",
    color: "#FF5722",
  },
];
