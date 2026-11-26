package com.biblicom.backend.entity.dto.Emprestimo;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record EmprestimoCreateDTO(
    @NotNull
    @Positive
    Long leitorId,

    @NotNull
    @Positive
    Long exemplarId,

    @NotNull
    @FutureOrPresent
    LocalDate dataPrevistaDevolucao
) {
}
