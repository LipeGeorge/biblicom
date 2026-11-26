package com.biblicom.backend.entity.dto.Emprestimo;

public record EmprestimosPorMesDTO(
    Integer ano,
    Integer mes,
    Long quantidade
) {
}
