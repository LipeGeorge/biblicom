package com.biblicom.backend.entity.dto.Leitor;

public record LeitorResponseDTO(
    Long id,
    String nome,
    String email,
    String cpf
) {
    
}
