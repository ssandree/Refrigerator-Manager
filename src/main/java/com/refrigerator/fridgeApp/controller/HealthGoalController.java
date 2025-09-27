package com.refrigerator.fridgeApp.controller;

import com.refrigerator.fridgeApp.dto.healthgoal.HealthGoalRequest;
import com.refrigerator.fridgeApp.dto.healthgoal.HealthGoalResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.refrigerator.fridgeApp.service.HealthGoalService;

import java.util.List;

@RestController
@RequestMapping("/api/health-goals")
@RequiredArgsConstructor
public class HealthGoalController {
    private final HealthGoalService healthGoalService;

    @PostMapping("/{userId}/add")
    // cli가 건강목표 입력하면 DB에 Store
    public ResponseEntity<Void> createHealthGoal(@PathVariable Long userId, @RequestBody HealthGoalRequest request) {
        healthGoalService.createHealthGoal(userId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}")
    // cli가 자기 건강목표 볼 수 있음
    public ResponseEntity<List<HealthGoalResponse>> getMyHealthGoals(@PathVariable Long userId) {
        return ResponseEntity.ok(healthGoalService.getHealthGoals(userId));
    }

}
