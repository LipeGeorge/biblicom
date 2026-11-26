package com.biblicom.backend.entity.dto.Livro;

import java.util.UUID;

public record LivroResponseDTO(
    UUID id,
    String titulo,
    String genero,
    String autor
) {
    
}
