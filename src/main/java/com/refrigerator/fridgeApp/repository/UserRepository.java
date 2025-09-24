package com.refrigerator.fridgeApp.repository;

import com.refrigerator.fridgeApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}
