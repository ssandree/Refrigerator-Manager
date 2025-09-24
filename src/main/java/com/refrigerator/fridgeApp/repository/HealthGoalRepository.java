package com.refrigerator.fridgeApp.repository;

import com.refrigerator.fridgeApp.entity.HealthGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthGoalRepository extends JpaRepository<HealthGoal, Long> {
    List<HealthGoal> findByUserId(Long userId);
}