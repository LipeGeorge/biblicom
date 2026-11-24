package com.biblicom.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.biblicom.backend.entity.Livro;
import com.biblicom.backend.entity.dto.LivroCreateDTO;
import com.biblicom.backend.entity.dto.LivroResponseDTO;
import com.biblicom.backend.repository.AutorRepository;
import com.biblicom.backend.repository.LivroRepository;

@Service 
public class LivroService {
    
    private final LivroRepository livroRepository;
    private final AutorRepository autorRepository;

    public LivroService(LivroRepository livroRepository, AutorRepository autorRepository) {
        this.livroRepository = livroRepository;
        this.autorRepository = autorRepository;
    }

    // Listar todos os livros
    public List<LivroResponseDTO> getLivros(){
        return livroRepository.findAll().stream()
            .map(livro -> new LivroResponseDTO(livro.getTitulo(), livro.getGenero(), livro.getAutor().getNome()))
            .toList();
    }

    // Listar livro por ID
    public LivroResponseDTO getLivroById(String id){
        return livroRepository.findById(UUID.fromString(id))
            .map(livro -> new LivroResponseDTO(livro.getTitulo(), livro.getGenero(), livro.getAutor().getNome()))
            .orElse(null);
    }

    // Cadastrar novo livro
    public LivroResponseDTO createLivro(LivroCreateDTO novoLivro){

        var autor = autorRepository.findById(Long.decode(novoLivro.autorId()));
        
        Livro livro = new Livro(
            UUID.randomUUID(),
            novoLivro.titulo(),
            novoLivro.genero(),
            autor.get()
        );

        livroRepository.save(livro); // Fazer tratamento de erro

        return new LivroResponseDTO(livro.getTitulo(), livro.getGenero(), livro.getAutor().getNome());
    }

}
