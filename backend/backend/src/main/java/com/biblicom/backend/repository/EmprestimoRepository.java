package com.biblicom.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.biblicom.backend.entity.Emprestimo;
import com.biblicom.backend.entity.dto.Emprestimo.EmprestimosPorMesDTO;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    @EntityGraph(attributePaths = {"leitor", "exemplar", "exemplar.livro"})
    List<Emprestimo> findAllByOrderByDataEmprestimoDesc();

    @EntityGraph(attributePaths = {"leitor", "exemplar", "exemplar.livro"})
    List<Emprestimo> findByLeitor_IdOrderByDataEmprestimoDesc(Long leitorId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select emprestimo from Emprestimo emprestimo where emprestimo.id = :id")
    Optional<Emprestimo> findByIdForUpdate(@Param("id") Long id);

    long countByDataDevolucaoIsNull();

    long countByDataDevolucaoIsNullAndDataPrevistaDevolucaoBefore(LocalDate date);

    @Query("""
        select new com.biblicom.backend.entity.dto.Emprestimo.EmprestimosPorMesDTO(
            year(emprestimo.dataEmprestimo),
            month(emprestimo.dataEmprestimo),
            count(emprestimo.id)
        )
        from Emprestimo emprestimo
        group by year(emprestimo.dataEmprestimo), month(emprestimo.dataEmprestimo)
        order by year(emprestimo.dataEmprestimo), month(emprestimo.dataEmprestimo)
        """)
    List<EmprestimosPorMesDTO> contarEmprestimosPorMes();
}
