package com.refrigerator.fridgeApp.controller;

import com.refrigerator.fridgeApp.dto.HealthGoalRequest;
import com.refrigerator.fridgeApp.entity.HealthGoal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.refrigerator.fridgeApp.service.HealthGoalService;

@RestController
@RequestMapping("/api/health-goals")
@RequiredArgsConstructor
public class HealthGoalController {
    private final HealthGoalService healthGoalService;

    @PostMapping
    // cli가 user/health-goals로 넣으면 <HealthGoal>객체를 보냄
    public ResponseEntity<HealthGoal> createHealthGoal(@RequestBody HealthGoalRequest request) {
        HealthGoal healthGoal = healthGoalService.createHealthGoal(request);
        return ResponseEntity.ok(healthGoal);
    }
}
