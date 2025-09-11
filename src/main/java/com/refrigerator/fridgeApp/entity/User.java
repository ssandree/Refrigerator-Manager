package com.refrigerator.fridgeApp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import org.springframework.data.annotation.Id;

public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id;
    @Column(nullable=false)
    private String name;
    @Column(nullable=false)
    private String email;
    @Column(nullable=false)
    private String password;
    @Column(nullable=false)
    private String createdAt;
}
