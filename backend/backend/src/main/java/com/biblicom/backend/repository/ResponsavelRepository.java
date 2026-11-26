package com.biblicom.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.biblicom.backend.entity.Responsavel;

public interface ResponsavelRepository extends JpaRepository<Responsavel, Long> {

    Optional<Responsavel> findByEmailIgnoreCase(String email);
}
