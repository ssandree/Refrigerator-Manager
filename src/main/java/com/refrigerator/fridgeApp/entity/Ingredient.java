package com.refrigerator.fridgeApp.entity;

import jakarta.persistence.*;   // @Entity, @Table, @Column, @Id, @GeneratedValue 등
import lombok.*;               // @Getter, @Setter, @Builder, @NoArgsConstructor, @AllArgsConstructor

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

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


