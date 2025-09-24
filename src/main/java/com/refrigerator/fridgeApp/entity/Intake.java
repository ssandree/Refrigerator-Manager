package com.refrigerator.fridgeApp.entity;

import jakarta.persistence.*;   // @Entity, @Table, @Column, @Id, @GeneratedValue 등
import lombok.*;               // @Getter, @Setter, @Builder, @NoArgsConstructor, @AllArgsConstructor

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "intakes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Intake {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String mealType; // BREAKFAST, LUNCH, DINNER, SNACK

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    private Integer quantity;
    private Integer calories;

    private LocalDate date;
    private LocalDateTime createdAt;
}
