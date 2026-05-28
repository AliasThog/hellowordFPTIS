package com.example.w1d6_fullstack_spring.repository;

import com.example.w1d6_fullstack_spring.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);
}