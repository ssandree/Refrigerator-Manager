package com.refrigerator.fridgeApp.controller;

import com.refrigerator.fridgeApp.dto.ingredient.IngredientCreateRequest;
import com.refrigerator.fridgeApp.dto.ingredient.IngredientResponse;
import com.refrigerator.fridgeApp.dto.ingredient.IngredientUpdateRequest;
import com.refrigerator.fridgeApp.entity.Ingredient;
import com.refrigerator.fridgeApp.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ingredients")
public class IngredientController {

    private final IngredientService ingredientService;

    @PostMapping("/{userId}/add")
    public ResponseEntity<Ingredient> Ingredient(@PathVariable Long userId, @RequestBody IngredientCreateRequest request) {
        Ingredient Ingredient = ingredientService.createIngredient(userId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<IngredientResponse>> getIngredients(@PathVariable Long userId) {
        return ResponseEntity.ok(ingredientService.getIngredients(userId));
    }

    @PatchMapping("/{userId}/update/{ingredientId}")
    public ResponseEntity<IngredientResponse> updateIngredient(@PathVariable Long userId, @PathVariable Long ingredientId, @RequestBody IngredientUpdateRequest request) {
        IngredientResponse updated = ingredientService.updateIngredient(userId, ingredientId, request);
        return ResponseEntity.ok(updated);
    }
}
