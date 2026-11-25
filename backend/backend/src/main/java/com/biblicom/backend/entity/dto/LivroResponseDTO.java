package com.biblicom.backend.entity.dto;

import java.util.UUID;

public record LivroResponseDTO(
    UUID id,
    String titulo,
    String genero,
    String autor
) {
    
}
