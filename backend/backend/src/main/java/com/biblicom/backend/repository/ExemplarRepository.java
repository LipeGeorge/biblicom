package com.biblicom.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.biblicom.backend.entity.Exemplar;

public interface ExemplarRepository extends JpaRepository<Exemplar, Long> {

    List<Exemplar> findByLivro_IdOrderByIdAsc(UUID livroId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select exemplar from Exemplar exemplar where exemplar.id = :id")
    Optional<Exemplar> findByIdForUpdate(@Param("id") Long id);
}
