package com.refrigerator.fridgeApp.controller;

import com.refrigerator.fridgeApp.dto.ingredient.IngredientRequest;
import com.refrigerator.fridgeApp.entity.Ingredient;
import com.refrigerator.fridgeApp.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ingredient")
public class IngredientController {

    private final IngredientService ingredientService;


    @PostMapping("/add")
    public ResponseEntity<Ingredient> Ingredient(@RequestBody IngredientRequest request) {
        Ingredient Ingredient = ingredientService.createIngredient(request);
        return ResponseEntity.ok().build();
    }
}
