import React, { createContext, ReactNode, useContext, useState } from 'react';

interface HealthGoal {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface HealthGoalContextType {
  selectedGoals: HealthGoal[];
  setSelectedGoals: (goals: HealthGoal[]) => void;
  addSelectedGoal: (goal: HealthGoal) => void;
  removeSelectedGoal: (goalId: number) => void;
}

const HealthGoalContext = createContext<HealthGoalContextType | undefined>(undefined);

export const useHealthGoal = () => {
  const context = useContext(HealthGoalContext);
  if (!context) {
    throw new Error('useHealthGoal must be used within a HealthGoalProvider');
  }
  return context;
};

interface HealthGoalProviderProps {
  children: ReactNode;
}

export const HealthGoalProvider: React.FC<HealthGoalProviderProps> = ({ children }) => {
  const [selectedGoals, setSelectedGoals] = useState<HealthGoal[]>([]);

  const addSelectedGoal = (goal: HealthGoal) => {
    setSelectedGoals(prev => {
      if (prev.length >= 3) return prev;
      if (prev.some(g => g.id === goal.id)) return prev;
      return [...prev, goal];
    });
  };

  const removeSelectedGoal = (goalId: number) => {
    setSelectedGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return (
    <HealthGoalContext.Provider value={{
      selectedGoals,
      setSelectedGoals,
      addSelectedGoal,
      removeSelectedGoal,
    }}>
      {children}
    </HealthGoalContext.Provider>
  );
};
