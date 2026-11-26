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
    public ResponseEntity<AutorResponseDTO> getAutorById(@PathVariable String id) {
        return ResponseEntity.ok(autorService.getAutorById(id));
    }

    // Criar novo autor
    @PostMapping
    public ResponseEntity<AutorResponseDTO> createAutor(@RequestBody AutorCreateDTO novoAutor) {
        return ResponseEntity.ok(autorService.createAutor(novoAutor));
    }

    // Editar autor
    @PutMapping("/{id}")
    public ResponseEntity<AutorResponseDTO> updateAutor(@PathVariable String id, @RequestBody AutorCreateDTO novoNome) {
        return ResponseEntity.ok(autorService.updateAutor(id, novoNome));
    }

    // Excluir autor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAutor(@PathVariable String id) {
        autorService.deleteAutor(id);
        return ResponseEntity.noContent().build();
    }

}
