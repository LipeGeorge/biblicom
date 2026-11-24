package com.biblicom.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.biblicom.backend.entity.dto.AutorCreateDTO;
import com.biblicom.backend.entity.dto.AutorResponseDTO;
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
    public AutorResponseDTO getAutorById(String id) {
        return autorRepository.findById(Long.decode(id))
                .map(autor -> new AutorResponseDTO(autor.getId(), autor.getNome()))
                .orElseThrow(() -> new RuntimeException("Autor não encontrado com o ID: " + id));
    }

    // Cria um novo autor
    public AutorResponseDTO createAutor(AutorCreateDTO novoAutor) {
        var autor = new com.biblicom.backend.entity.Autor();
        autor.setNome(novoAutor.nome());

        var savedAutor = autorRepository.save(autor);
        return new AutorResponseDTO(savedAutor.getId(), savedAutor.getNome());
    }

    // Editar autor
    public AutorResponseDTO updateAutor(String id, AutorCreateDTO novoNome) {
        var autor = autorRepository.findById(Long.decode(id))
                .orElseThrow(() -> new RuntimeException("Autor não encontrado com o ID: " + id));

        autor.setNome(novoNome.nome());
        var updatedAutor = autorRepository.save(autor);
        return new AutorResponseDTO(updatedAutor.getId(), updatedAutor.getNome());
    }

    // Excluir autor
    public void deleteAutor(String id) {
        var autor = autorRepository.findById(Long.decode(id))
                .orElseThrow(() -> new RuntimeException("Autor não encontrado com o ID: " + id));

        autorRepository.delete(autor);
    }

}
