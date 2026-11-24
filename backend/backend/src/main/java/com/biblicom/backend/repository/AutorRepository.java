package com.biblicom.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.biblicom.backend.entity.Autor;

public interface AutorRepository extends JpaRepository<Autor, Long>{
    
}
