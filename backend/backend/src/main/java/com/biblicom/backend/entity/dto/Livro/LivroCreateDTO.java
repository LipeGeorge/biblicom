package com.biblicom.backend.entity.dto.Livro;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LivroCreateDTO(
    @NotBlank
    @Size(max = 255)
    String titulo,

    @NotBlank
    @Size(max = 255)
    String genero,

    @NotBlank
    @Pattern(regexp = "\\d+")
    String autorId
) {
    
}
