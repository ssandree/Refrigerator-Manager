package com.refrigerator.fridgeApp.service;

import com.refrigerator.fridgeApp.dto.ingredient.IngredientCreateRequest;
import com.refrigerator.fridgeApp.dto.ingredient.IngredientResponse;
import com.refrigerator.fridgeApp.dto.ingredient.IngredientUpdateRequest;
import com.refrigerator.fridgeApp.entity.Ingredient;
import com.refrigerator.fridgeApp.entity.User;
import com.refrigerator.fridgeApp.repository.IngredientRepository;
import com.refrigerator.fridgeApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IngredientService {
    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;

    // 재료 추가하기
    public Ingredient createIngredient(Long userId, IngredientCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다."));
        Ingredient ingredient = Ingredient.builder()
                .user(user)
                .name(request.getName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .storageLocation(request.getStorageLocation()) // FRIDGE, FREEZER, ROOM_TEMP
                .purchaseDate(request.getPurchaseDate())
                .expiryDate(request.getExpiryDate())
                .alertBeforeDays(request.getAlertBeforeDays())
                .createdAt(LocalDateTime.now())
                .build();
        return ingredientRepository.save(ingredient);
    }

    // 재료 전체 보여주기
    public List<IngredientResponse> getIngredients(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다."));
        List<Ingredient> ingredients = ingredientRepository.findByUserId(userId);

        return ingredients.stream()
                .map(ingred -> IngredientResponse.builder()
                        .id(ingred.getId())
                        .name(ingred.getName())
                        .quantity(ingred.getQuantity())
                        .unit(ingred.getUnit())
                        .storageLocation(ingred.getStorageLocation())
                        .purchaseDate(ingred.getPurchaseDate())
                        .expiryDate(ingred.getExpiryDate())
                        .expiryDDays((int) ChronoUnit.DAYS.between(LocalDate.now(), ingred.getExpiryDate()))
                        .alertBeforeDays(ingred.getAlertBeforeDays())
                        .createdAt(ingred.getCreatedAt())
                        .build()
                )
                .collect(Collectors.toList());
    }

    // 재료 수정하기
    public IngredientResponse updateIngredient(Long userId, Long ingredientId, IngredientUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 없습니다."));
        Ingredient ingredient = ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new IllegalArgumentException("해당 재료가 없습니다."));

        if (request.getName() != null) {
            ingredient.setName(request.getName());
        }
        if (request.getQuantity() != null) {
            ingredient.setQuantity(request.getQuantity());
        }
        if (request.getUnit() != null) {
            ingredient.setUnit(request.getUnit());
        }
        if (request.getStorageLocation() != null) {
            ingredient.setStorageLocation(request.getStorageLocation());
        }
        if (request.getPurchaseDate() != null) {
            ingredient.setPurchaseDate(request.getPurchaseDate());
        }
        if (request.getExpiryDate() != null) {
            ingredient.setExpiryDate(request.getExpiryDate());
        }
        if (request.getAlertBeforeDays() != null) {
            ingredient.setAlertBeforeDays(request.getAlertBeforeDays());
        }

        Ingredient updated = ingredientRepository.save(ingredient);

        return IngredientResponse.builder()
            .id(updated.getId())
            .name(updated.getName())
            .quantity(updated.getQuantity())
            .unit(updated.getUnit())
            .storageLocation(updated.getStorageLocation())
            .purchaseDate(updated.getPurchaseDate())
            .expiryDate(updated.getExpiryDate())
            .expiryDDays((int) ChronoUnit.DAYS.between(LocalDate.now(), updated.getExpiryDate()))
            .alertBeforeDays(updated.getAlertBeforeDays())
            .createdAt(updated.getCreatedAt())
            .build();
    }
}
