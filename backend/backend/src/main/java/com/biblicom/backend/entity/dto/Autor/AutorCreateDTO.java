package com.biblicom.backend.entity.dto.Autor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AutorCreateDTO(
    @NotBlank
    @Size(max = 255)
    String nome
) {
    
}
