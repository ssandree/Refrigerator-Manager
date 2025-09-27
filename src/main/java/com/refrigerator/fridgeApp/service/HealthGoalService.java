package com.refrigerator.fridgeApp.service;

import com.refrigerator.fridgeApp.dto.healthgoal.HealthGoalRequest;
import com.refrigerator.fridgeApp.dto.healthgoal.HealthGoalResponse;
import com.refrigerator.fridgeApp.entity.GoalCode;
import com.refrigerator.fridgeApp.entity.HealthGoal;
import com.refrigerator.fridgeApp.entity.User;
import com.refrigerator.fridgeApp.repository.HealthGoalRepository;
import com.refrigerator.fridgeApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthGoalService {

    private final UserRepository userRepository;
    private final HealthGoalRepository healthGoalRepository;

    // 내 건강목표 생성
    public void createHealthGoal(Long userId, HealthGoalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        GoalCode goalCode = GoalCode.valueOf(request.getCode());
        if (healthGoalRepository.existsByUserIdAndCode(userId, goalCode)) {
            throw new IllegalStateException("이미 등록된 목표입니다.");
        }

        HealthGoal healthGoal = HealthGoal.builder()
                .user(user)
                .code(goalCode)
                .targetWeight(request.getTargetWeight())
                .progress(0.0)
                .build();

        healthGoalRepository.save(healthGoal);
    }

    // 내 목표 전체 조회
    public List<HealthGoalResponse> getHealthGoals(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("해당 유저가 존재하지 않습니다. "));
        List<HealthGoal> healthGoals = healthGoalRepository.findByUserId(userId);

        return healthGoals.stream()
                .map(goal -> new HealthGoalResponse(
                        goal.getId(),
                        goal.getCode().name(),
                        goal.getCode().getDisplayName(),
                        goal.getTargetWeight(),
                        goal.getProgress(),
                        goal.getCreatedAt(),
                        goal.getUpdatedAt()
                ))
                .toList();
    }
}