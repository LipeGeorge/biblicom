package com.biblicom.backend.entity.dto.Leitor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LeitorUpdateDTO(
    @NotBlank
    @Size(max = 255)
    String nome
) {
}
