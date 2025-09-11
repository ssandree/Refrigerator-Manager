package com.refrigerator.fridgeApp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import org.springframework.data.annotation.Id;

@Entity
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private String imageUrl;
    @Column(nullable=false)
    private EnumIngredientCategory category;
    @Column(nullable=false)
    private String name;
    @Column(nullable=false)
    private int quantity;
    @Column(nullable=false)
    private String weight;
    @Column(nullable=false)
    private String registeredAt;
    @Column(nullable=false)
    private String purchaseDate;
    @Column(nullable=false)
    private String expiryDate;
    @Column(nullable=false)
    private EnumStorageLocation StorageLocation;
    @Column(nullable=false)
    private int alertBeforeDays;
}


