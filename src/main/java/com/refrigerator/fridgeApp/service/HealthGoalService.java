package com.refrigerator.fridgeApp.service;

import com.refrigerator.fridgeApp.dto.HealthGoalRequest;
import com.refrigerator.fridgeApp.entity.HealthGoal;
import com.refrigerator.fridgeApp.entity.User;
import com.refrigerator.fridgeApp.repository.HealthGoalRepository;
import com.refrigerator.fridgeApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class HealthGoalService {

    private final HealthGoalRepository healthGoalRepository;
    private final UserRepository userRepository;

    public HealthGoal createHealthGoal(HealthGoalRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다. ID=" + request.getUserId()));

        HealthGoal healthGoal = HealthGoal.builder()
                .user(user)
                .goalType(request.getGoalType())
                .createdAt(LocalDateTime.now())
                .build();

        return healthGoalRepository.save(healthGoal);
    }
}
