package com.refrigerator.fridgeApp.service;

import com.refrigerator.fridgeApp.dto.healthgoal.HealthGoalRequest;
import com.refrigerator.fridgeApp.entity.GoalType;
import com.refrigerator.fridgeApp.entity.HealthGoal;
import com.refrigerator.fridgeApp.entity.User;
import com.refrigerator.fridgeApp.repository.GoalTypeRepository;
import com.refrigerator.fridgeApp.repository.HealthGoalRepository;
import com.refrigerator.fridgeApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthGoalService {

    private final UserRepository userRepository;
    private final GoalTypeRepository goalTypeRepository;
    private final HealthGoalRepository healthGoalRepository;

    // 내 건강목표 생성
    public HealthGoal createHealthGoal(HealthGoalRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));
        GoalType goalType = goalTypeRepository.findById(request.getGoalTypeId())
                .orElseThrow(()-> new IllegalArgumentException("알맞은 목표 설정"));

        HealthGoal healthGoal = HealthGoal.builder()
                .user(user)
                .goalType(goalType)
                .targetWeight(request.getTargetWeight())
                .progress(request.getProgress())
                .isActive(request.getIsActive())
                .build();

        return healthGoalRepository.save(healthGoal);
    }
    // 내 목표 전체 조회
    public List<HealthGoal> getHealthGoalsByUserId(Long userId) {
        return healthGoalRepository.findByUserId(userId);
    }
}
