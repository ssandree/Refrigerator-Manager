package com.refrigerator.fridgeApp.repository;

import com.refrigerator.fridgeApp.entity.HealthGoal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthGoalRepository extends JpaRepository<HealthGoal, Long> {
}