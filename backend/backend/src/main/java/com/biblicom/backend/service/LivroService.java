package com.biblicom.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.biblicom.backend.entity.Livro;
import com.biblicom.backend.entity.dto.Livro.LivroCreateDTO;
import com.biblicom.backend.entity.dto.Livro.LivroResponseDTO;
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
            .map(livro -> new LivroResponseDTO(livro.getId(), livro.getTitulo(), livro.getGenero(), livro.getAutor().getNome()))
            .toList();
    }

    // Listar livro por ID
    public LivroResponseDTO getLivroById(UUID id){
        return livroRepository.findById(id)
            .map(livro -> new LivroResponseDTO(livro.getId(), livro.getTitulo(), livro.getGenero(), livro.getAutor().getNome()))
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Livro não encontrado"));
    }

    // Cadastrar novo livro
    public LivroResponseDTO createLivro(LivroCreateDTO novoLivro){
        var autor = autorRepository.findById(parseAutorId(novoLivro.autorId()))
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Autor não encontrado"));
        
        Livro livro = new Livro(
            null,
            novoLivro.titulo(),
            novoLivro.genero(),
            autor,
            null
        );

        Livro savedLivro = livroRepository.save(livro);

        return toResponseDTO(savedLivro);
    }

    // Editar livro
    public LivroResponseDTO updateLivro(UUID id, LivroCreateDTO novoLivro){

        Livro livro = livroRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Livro não encontrado"));
        var autor = autorRepository.findById(parseAutorId(novoLivro.autorId()))
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Autor não encontrado"));

        livro.setTitulo(novoLivro.titulo());
        livro.setGenero(novoLivro.genero());
        livro.setAutor(autor);

        return toResponseDTO(livroRepository.save(livro));

    }

    // Deletar Livro
    public void deleteLivro(UUID id){
        Livro livro = livroRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Livro não encontrado"));

        try {
            livroRepository.delete(livro);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Livro não pode ser apagado porque possui vínculos",
                exception);
        }
    }

    private Long parseAutorId(String id){
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException exception) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "ID do autor inválido",
                exception);
        }
    }

    private LivroResponseDTO toResponseDTO(Livro livro){
        return new LivroResponseDTO(
            livro.getId(),
            livro.getTitulo(),
            livro.getGenero(),
            livro.getAutor().getNome());
    }

}
