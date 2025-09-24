package com.refrigerator.fridgeApp.dto.healthgoal;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HealthGoalRequest {
    private Long userId;       // 어떤 유저의 목표인지
    private Long goalTypeId;
    private Integer targetWeight;
    private Double progress;
    private Boolean isActive = true;
}
