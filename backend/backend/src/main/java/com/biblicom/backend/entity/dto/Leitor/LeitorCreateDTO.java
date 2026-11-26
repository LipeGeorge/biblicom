package com.biblicom.backend.entity.dto.Leitor;

public record LeitorCreateDTO(
    String nome,
    String email,
    String cpf
) {
    
}
