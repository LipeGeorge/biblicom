package com.biblicom.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.biblicom.backend.entity.Livro;

public interface LivroRepository extends JpaRepository<Livro, UUID>{
    
}
