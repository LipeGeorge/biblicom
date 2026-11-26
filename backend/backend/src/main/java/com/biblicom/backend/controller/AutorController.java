package com.biblicom.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import com.biblicom.backend.entity.dto.Autor.AutorCreateDTO;
import com.biblicom.backend.entity.dto.Autor.AutorResponseDTO;
import com.biblicom.backend.service.AutorService;

@RestController
@RequestMapping("/autores")
public class AutorController {

    private final AutorService autorService;

    public AutorController(AutorService autorService) {
        this.autorService = autorService;
    }

    // Listar todos os autores
    @GetMapping 
    public ResponseEntity<List<AutorResponseDTO>> listAutores() {
        return ResponseEntity.ok(autorService.getAllAutores());
    }

    // Listar autor por ID
    @GetMapping("/{id}")
    public ResponseEntity<AutorResponseDTO> getAutorById(@PathVariable Long id) {
        return ResponseEntity.ok(autorService.getAutorById(id));
    }

    // Criar novo autor
    @PostMapping
    public ResponseEntity<AutorResponseDTO> createAutor(@Valid @RequestBody AutorCreateDTO novoAutor) {
        AutorResponseDTO created = autorService.createAutor(novoAutor);
        var location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.id())
            .toUri();
        return ResponseEntity.created(location).body(created);
    }

    // Editar autor
    @PutMapping("/{id}")
    public ResponseEntity<AutorResponseDTO> updateAutor(
        @PathVariable Long id,
        @Valid @RequestBody AutorCreateDTO novoNome) {
        return ResponseEntity.ok(autorService.updateAutor(id, novoNome));
    }

    // Excluir autor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAutor(@PathVariable Long id) {
        autorService.deleteAutor(id);
        return ResponseEntity.noContent().build();
    }

}
