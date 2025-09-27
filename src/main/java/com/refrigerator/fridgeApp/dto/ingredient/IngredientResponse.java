package com.refrigerator.fridgeApp.dto.ingredient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
@Builder
public class IngredientResponse {
    private Long id;
    private String name;
    private Integer quantity;
    private String unit;
    private String storageLocation; // FRIDGE, FREEZER, ROOM_TEMP

    private LocalDate purchaseDate;
    private LocalDate expiryDate;
    private Integer expiryDDays;

    private Integer alertBeforeDays;
    private String status; // ACTIVE, CONSUMED, DISCARDED

    private LocalDateTime createdAt;

}
