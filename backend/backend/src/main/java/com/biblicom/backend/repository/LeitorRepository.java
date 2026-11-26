package com.biblicom.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.biblicom.backend.entity.Leitor;

public interface LeitorRepository extends JpaRepository<Leitor, Long>{
}