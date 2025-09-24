package com.refrigerator.fridgeApp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "goal_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoalType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 예: "FAT_LOSS"
    @Column(nullable = false, unique = true, length = 50)
    private String code;

    // 예: "체중 감량"
    @Column(nullable = false, length = 100)
    private String name;
}
