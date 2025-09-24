package com.refrigerator.fridgeApp.entity;

import jakarta.persistence.*;   // @Entity, @Table, @Column, @Id, @GeneratedValue 등
import lombok.*;               // @Getter, @Setter, @Builder, @NoArgsConstructor, @AllArgsConstructor

@Entity
@Table(name = "recipes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    private String description;

    private String thumbnailImage;
    private Integer cookingTime;
    private String difficulty; // EASY, MEDIUM, HARD
    private Integer calories;
}