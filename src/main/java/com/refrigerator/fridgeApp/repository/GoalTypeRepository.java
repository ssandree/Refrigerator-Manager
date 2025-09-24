package com.refrigerator.fridgeApp.repository;

import com.refrigerator.fridgeApp.entity.GoalType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface GoalTypeRepository extends JpaRepository<GoalType, Long> {

}
