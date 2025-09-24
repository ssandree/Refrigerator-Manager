package com.refrigerator.fridgeApp.repository;

import com.refrigerator.fridgeApp.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

}
