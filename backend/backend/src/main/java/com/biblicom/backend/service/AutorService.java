package com.biblicom.backend.service;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.biblicom.backend.entity.Autor;
import com.biblicom.backend.entity.dto.Autor.AutorCreateDTO;
import com.biblicom.backend.entity.dto.Autor.AutorResponseDTO;
import com.biblicom.backend.repository.AutorRepository;

@Service 
public class AutorService {
    
    private final AutorRepository autorRepository;

    public AutorService(AutorRepository autorRepository) {
        this.autorRepository = autorRepository;
    }

    // Lista todos os autores
    public List<AutorResponseDTO> getAllAutores() {
        return autorRepository.findAll().stream()
                .map(autor -> new AutorResponseDTO(autor.getId(), autor.getNome()))
                .toList();
    }

    // Busca um autor pelo ID
    public AutorResponseDTO getAutorById(Long id) {
        return autorRepository.findById(id)
                .map(autor -> new AutorResponseDTO(autor.getId(), autor.getNome()))
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Autor não encontrado"));
    }

    // Cria um novo autor
    public AutorResponseDTO createAutor(AutorCreateDTO novoAutor) {
        var autor = new Autor();
        autor.setNome(novoAutor.nome());

        var savedAutor = autorRepository.save(autor);
        return new AutorResponseDTO(savedAutor.getId(), savedAutor.getNome());
    }

    // Editar autor
    public AutorResponseDTO updateAutor(Long id, AutorCreateDTO novoNome) {
        var autor = autorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Autor não encontrado"));

        autor.setNome(novoNome.nome());
        var updatedAutor = autorRepository.save(autor);
        return new AutorResponseDTO(updatedAutor.getId(), updatedAutor.getNome());
    }

    // Excluir autor
    public void deleteAutor(Long id) {
        var autor = autorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Autor não encontrado"));

        try {
            autorRepository.delete(autor);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Autor não pode ser apagado porque possui vínculos",
                exception);
        }
    }

}
