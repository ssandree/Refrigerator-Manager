package com.refrigerator.fridgeApp.dto.healthgoal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthGoalRequest {
    private String code;
    private Integer targetWeight;   // 선택적으로 사용하는 경우
}
