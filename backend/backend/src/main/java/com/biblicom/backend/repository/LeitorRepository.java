package com.biblicom.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.biblicom.backend.entity.Leitor;

public interface LeitorRepository extends JpaRepository<Leitor, Long>{

    @Override
    @EntityGraph(attributePaths = {"livros", "livros.autor"})
    List<Leitor> findAll();

    @Override
    @EntityGraph(attributePaths = {"livros", "livros.autor"})
    Optional<Leitor> findById(Long id);
}