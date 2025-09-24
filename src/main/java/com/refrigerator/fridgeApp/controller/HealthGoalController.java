package com.refrigerator.fridgeApp.controller;

import com.refrigerator.fridgeApp.dto.healthgoal.HealthGoalRequest;
import com.refrigerator.fridgeApp.entity.HealthGoal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.refrigerator.fridgeApp.service.HealthGoalService;

import java.util.List;

@RestController
@RequestMapping("/api/me/health-goals")
@RequiredArgsConstructor
public class HealthGoalController {
    private final HealthGoalService healthGoalService;

    @PostMapping("/in")
    // cli가 건강목표 입력하면 DB에 Store
    public ResponseEntity<Void> createHealthGoal(@RequestBody HealthGoalRequest request) {
        healthGoalService.createHealthGoal(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    // cli가 자기 건강목표 볼 수 있음
    public ResponseEntity<List<HealthGoal>> getMyHealthGoals(@RequestParam Long userId){
        List<HealthGoal> goals = healthGoalService.getHealthGoalsByUserId(userId);
        return ResponseEntity.ok(goals);
    }
}
