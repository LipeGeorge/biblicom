package com.biblicom.backend.entity.dto.Leitor;

import java.util.List;

import com.biblicom.backend.entity.dto.Livro.LivroResponseDTO;

public record LeitorResponseDTO(
    Long id,
    String nome,
    String email,
    String cpf,
    List<LivroResponseDTO> livros
) {
    
}
