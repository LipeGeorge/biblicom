package com.biblicom.backend.controller;

import java.util.List;
import java.util.UUID;

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
import com.biblicom.backend.entity.dto.Livro.LivroCreateDTO;
import com.biblicom.backend.entity.dto.Livro.LivroResponseDTO;
import com.biblicom.backend.service.LivroService;

@RestController 
@RequestMapping("/livros")
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService){
        this.livroService = livroService;
    }

    // Listar livros
    @GetMapping 
    public ResponseEntity<List<LivroResponseDTO>> getLivros(){
        return ResponseEntity.ok(livroService.getLivros());
    }

    // Listar livro por Id
    @GetMapping("/{id}") 
    public ResponseEntity<LivroResponseDTO> getLivroById(@PathVariable UUID id){
        return ResponseEntity.ok(livroService.getLivroById(id));
    }

    // Criar um livro
    @PostMapping 
    public ResponseEntity<LivroResponseDTO> createLivro(@Valid @RequestBody LivroCreateDTO livroCreateDTO){
        LivroResponseDTO created = livroService.createLivro(livroCreateDTO);
        var location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.id())
            .toUri();
        return ResponseEntity.created(location).body(created);
    }

    // Atualizar um livro
    @PutMapping("/{id}")
    public ResponseEntity<LivroResponseDTO> updateLivro(
        @PathVariable UUID id,
        @Valid @RequestBody LivroCreateDTO livroCreateDTO
    ){
        return ResponseEntity.ok(livroService.updateLivro(id, livroCreateDTO));

    }

    // Apagar um livro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLivro(@PathVariable UUID id){
        
        livroService.deleteLivro(id);
        return ResponseEntity.noContent().build();

    }
    
}
