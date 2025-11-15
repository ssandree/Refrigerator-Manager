import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useMealStore } from "../../../stores/useMealStore";
import DailyDietCard from "./MealCard";

interface MealCardListProps {
  dateISO?: string; // YYYY-MM-DD
}

export default function MealCardList({ dateISO }: MealCardListProps) {
  const meals = useMealStore((s) => s.meals);
  const removeMeal = useMealStore((s) => s.removeMeal);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const todayMeals = useMemo(
    () => meals.filter((m) => m.consumedAt === (dateISO || today)),
    [meals, today, dateISO]
  );

  const sections = useMemo(
    () =>
      [
        { key: "breakfast", title: "🌅 아침" },
        { key: "lunch", title: "☀️ 점심" },
        { key: "dinner", title: "🌙 저녁" },
        { key: "snack", title: "🍎 간식" },
      ] as const,
    []
  );

  return (
    <>
      {sections.map((sec) => {
        const items = todayMeals.filter((m) => m.mealType === sec.key);
        if (items.length === 0) return null;
        return (
          <View key={sec.key} style={styles.mealSection}>
            <Text style={styles.mealTitle}>{sec.title}</Text>
            {items.map((meal) => (
              <DailyDietCard
                key={meal.id}
                recipeName={meal.recipe?.recipeName || meal.notes || "자유식"}
                calories={0}
                time={meal.consumedAt}
                onDelete={() => removeMeal(meal.id)}
              />
            ))}
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  mealSection: {
    marginBottom: 24,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 12,
  },
});
