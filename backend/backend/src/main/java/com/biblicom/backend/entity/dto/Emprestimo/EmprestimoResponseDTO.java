package com.biblicom.backend.entity.dto.Emprestimo;

import java.time.LocalDate;
import java.util.UUID;

import com.biblicom.backend.entity.EmprestimoSituacao;

public record EmprestimoResponseDTO(
    Long id,
    Long leitorId,
    String leitorNome,
    Long exemplarId,
    UUID livroId,
    String livroTitulo,
    LocalDate dataEmprestimo,
    LocalDate dataPrevistaDevolucao,
    LocalDate dataDevolucao,
    EmprestimoSituacao situacao
) {
}
