package com.biblicom.backend.entity.dto.Leitor;

import java.util.List;

import com.biblicom.backend.entity.dto.Livro.LivroResponseDTO;

public record LeitorResponseLivroDTO(
    List<LivroResponseDTO> livros
) {
    
}
