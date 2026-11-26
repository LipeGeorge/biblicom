package com.biblicom.backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.biblicom.backend.entity.Exemplar;
import com.biblicom.backend.entity.Livro;
import com.biblicom.backend.entity.dto.Exemplar.ExemplarResponseDTO;
import com.biblicom.backend.entity.dto.Livro.LivroCreateDTO;
import com.biblicom.backend.entity.dto.Livro.LivroResponseDTO;
import com.biblicom.backend.entity.dto.Livro.LivroUpdateDTO;
import com.biblicom.backend.repository.AutorRepository;
import com.biblicom.backend.repository.ExemplarRepository;
import com.biblicom.backend.repository.LivroInventoryProjection;
import com.biblicom.backend.repository.LivroRepository;

@Service 
public class LivroService {
    
    private final LivroRepository livroRepository;
    private final AutorRepository autorRepository;
    private final ExemplarRepository exemplarRepository;

    public LivroService(
        LivroRepository livroRepository,
        AutorRepository autorRepository,
        ExemplarRepository exemplarRepository
    ) {
        this.livroRepository = livroRepository;
        this.autorRepository = autorRepository;
        this.exemplarRepository = exemplarRepository;
    }

    // Listar todos os livros
    public List<LivroResponseDTO> getLivros(){
        return livroRepository.findAllWithInventory().stream()
            .map(this::toResponseDTO)
            .toList();
    }

    // Listar livro por ID
    public LivroResponseDTO getLivroById(UUID id){
        return livroRepository.findWithInventoryById(id)
            .map(this::toResponseDTO)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Livro não encontrado"));
    }

    public List<ExemplarResponseDTO> getExemplares(UUID livroId){
        if (!livroRepository.existsById(livroId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Livro não encontrado");
        }
        return exemplarRepository.findByLivro_IdOrderByIdAsc(livroId).stream()
            .map(exemplar -> new ExemplarResponseDTO(exemplar.getId(), exemplar.getStatus()))
            .toList();
    }

    // Cadastrar novo livro
    @Transactional
    public LivroResponseDTO createLivro(LivroCreateDTO novoLivro){
        var autor = autorRepository.findById(parseAutorId(novoLivro.autorId()))
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Autor não encontrado"));
        
        Livro livro = new Livro(
            null,
            novoLivro.titulo(),
            novoLivro.genero(),
            autor
        );
        Livro savedLivro = livroRepository.save(livro);

        List<Exemplar> exemplares = IntStream.range(0, novoLivro.quantidadeExemplares())
            .mapToObj(index -> new Exemplar(savedLivro))
            .toList();
        exemplarRepository.saveAll(exemplares);

        return findResponseById(savedLivro.getId());
    }

    // Editar livro
    @Transactional
    public LivroResponseDTO updateLivro(UUID id, LivroUpdateDTO novoLivro){

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

        livroRepository.save(livro);
        return findResponseById(id);

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

    private LivroResponseDTO findResponseById(UUID id){
        return livroRepository.findWithInventoryById(id)
            .map(this::toResponseDTO)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Livro não encontrado"));
    }

    private LivroResponseDTO toResponseDTO(LivroInventoryProjection livro){
        return new LivroResponseDTO(
            livro.getId(),
            livro.getTitulo(),
            livro.getGenero(),
            livro.getAutor(),
            livro.getTotalExemplares(),
            livro.getExemplaresDisponiveis(),
            livro.getExemplaresEmprestados());
    }

}
