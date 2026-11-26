package com.biblicom.backend.entity.dto.Autenticacao;

public record LoginResponseDTO(
    String email,
    boolean autenticado
) {
}
