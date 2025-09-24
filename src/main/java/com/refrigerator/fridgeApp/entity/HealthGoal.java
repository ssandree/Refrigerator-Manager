package com.refrigerator.fridgeApp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GoalType goalType;

    private Integer targetWeight;

    private LocalDateTime createdAt;

    public enum GoalType {
        WEIGHT_MAINTAIN,
        FAT_LOSS,
        WEIGHT_GAIN,
        PROTEIN_INTAKE,
        BLOOD_SUGAR_CONTROL,
        IMMUNITY_BOOST,
        IMPROVE_STAMINA
    }

}
