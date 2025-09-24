package com.refrigerator.fridgeApp.dto;

import com.refrigerator.fridgeApp.entity.HealthGoal.GoalType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HealthGoalRequest {
    private Long userId;       // 어떤 유저의 목표인지
    private GoalType goalType; // Enum 값
}
