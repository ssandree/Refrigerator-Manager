// 건강 목표 선택 전역 상태를 관리하는 Zustand 스토어
import { create } from "zustand";

// 건강 목표 도메인 모델
export interface HealthGoal {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// 스토어 상태와 액션 정의
interface HealthGoalState {
  selectedGoals: HealthGoal[];
  // 전체 목표를 일괄 세팅
  setSelectedGoals: (goals: HealthGoal[]) => void;
  // 목표 추가 (최대 3개, 중복 방지)
  addSelectedGoal: (goal: HealthGoal) => void;
  // 목표 제거
  removeSelectedGoal: (goalId: number) => void;
}

export const useHealthGoalStore = create<HealthGoalState>((set) => ({
  selectedGoals: [],

  // 전체 목표 일괄 설정
  setSelectedGoals: (goals) => {
    set({ selectedGoals: goals });
  },

  // 목표 추가 (3개 초과, 중복 추가 방지)
  addSelectedGoal: (goal) => {
    set((state) => {
      if (state.selectedGoals.length >= 3) return state;
      if (state.selectedGoals.some((g) => g.id === goal.id)) return state;
      return { selectedGoals: [...state.selectedGoals, goal] };
    });
  },

  // 목표 제거
  removeSelectedGoal: (goalId) => {
    set((state) => ({
      selectedGoals: state.selectedGoals.filter((goal) => goal.id !== goalId),
    }));
  },
}));
