package com.refrigerator.fridgeApp.dto.ingredient;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class IngredientUpdateRequest {
    private String name;
    private Integer quantity;
    private String unit;
    private String storageLocation;
    private LocalDate purchaseDate;
    private LocalDate expiryDate;
    private Integer alertBeforeDays;
    private String status;
}
