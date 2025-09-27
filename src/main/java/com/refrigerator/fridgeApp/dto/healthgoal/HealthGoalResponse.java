package com.refrigerator.fridgeApp.dto.healthgoal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthGoalResponse {
    private Long id;

    private String code;
    private String name;

    private Integer targetWeight;
    private Double progress;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
