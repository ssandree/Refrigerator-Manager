package com.refrigerator.fridgeApp.service;

import com.refrigerator.fridgeApp.dto.ingredient.IngredientRequest;
import com.refrigerator.fridgeApp.entity.HealthGoal;
import com.refrigerator.fridgeApp.entity.Ingredient;
import com.refrigerator.fridgeApp.entity.User;
import com.refrigerator.fridgeApp.repository.IngredientRepository;
import com.refrigerator.fridgeApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class IngredientService {
    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;

    public Ingredient createIngredient(IngredientRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Ingredient ingredient = Ingredient.builder()
                .user(user)
                .name(request.getName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .storageLocation(request.getStorageLocation()) // FRIDGE, FREEZER, ROOM_TEMP
                .purchaseDate(request.getPurchaseDate())
                .expiryDate(request.getExpiryDate())
                .alertBeforeDays(request.getAlertBeforeDays())
                .status(request.getStatus()) // ACTIVE, CONSUMED, DISCARDED
                .createdAt(LocalDateTime.now())
                .build();
        return ingredientRepository.save(ingredient);
    }
}
