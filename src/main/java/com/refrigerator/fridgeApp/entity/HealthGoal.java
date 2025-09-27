package com.refrigerator.fridgeApp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_goals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HealthGoal {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 목표 코드 (영문, 내부 로직용) - 예: "FAT_LOSS"
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private GoalCode code;
    // 목표 이름 (한글, 화면 표시용) - 예: "체중 감량"
    @Transient
    private String name;

    // 사용자별로 추가할 수 있는 목표 속성
    @Column
    private Integer targetWeight;   // 선택적으로 사용하는 경우
    @Column
    private Double progress;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
