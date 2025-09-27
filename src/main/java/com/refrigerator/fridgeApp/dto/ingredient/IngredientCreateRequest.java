package com.refrigerator.fridgeApp.dto.ingredient;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class IngredientCreateRequest {
    private String name;
    private Integer quantity;
    private String unit;
    private String storageLocation; // FRIDGE, FREEZER, ROOM_TEMP

    private LocalDate purchaseDate;
    private LocalDate expiryDate;

    private Integer alertBeforeDays;
    private String status; // ACTIVE, CONSUMED, DISCARDED

    private LocalDateTime createdAt;
}
