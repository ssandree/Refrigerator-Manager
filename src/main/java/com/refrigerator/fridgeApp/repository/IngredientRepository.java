package com.refrigerator.fridgeApp.repository;

import com.refrigerator.fridgeApp.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByUserId(Long userId);
}
