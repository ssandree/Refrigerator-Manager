package com.refrigerator.fridgeApp.entity;

import jakarta.persistence.*;   // @Entity, @Table, @Column, @Id, @GeneratedValue 등
import lombok.*;               // @Getter, @Setter, @Builder, @NoArgsConstructor, @AllArgsConstructor

import java.time.LocalDateTime;

@Entity
@Table(name = "recipe_images")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecipeImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    private String imageUrl;
    private Integer stepNo;

    private LocalDateTime createdAt;
}

