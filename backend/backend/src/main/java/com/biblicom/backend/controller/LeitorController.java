package com.biblicom.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import com.biblicom.backend.entity.dto.Leitor.LeitorCreateDTO;
import com.biblicom.backend.entity.dto.Leitor.LeitorResponseDTO;
import com.biblicom.backend.entity.dto.Leitor.LeitorResponseLivroDTO;
import com.biblicom.backend.entity.dto.Leitor.LeitorUpdateDTO;
import com.biblicom.backend.service.LeitorService;

@RestController 
@RequestMapping("/leitores")
public class LeitorController {
    
    private final LeitorService leitorService;

    public LeitorController(LeitorService leitorService){
        this.leitorService = leitorService;
    }

    // listar leitores
    @GetMapping 
    public ResponseEntity<List<LeitorResponseDTO>> getLeitores(){
        return ResponseEntity.ok(leitorService.getLeitores());
    }

    // listar leitor por id
    @GetMapping("/{id}")
    public ResponseEntity<LeitorResponseDTO> getLeitorById(@PathVariable Long id){
        return ResponseEntity.ok(leitorService.getLeitorById(id));
    }

    // listar livros do leitor *
    @GetMapping("/{id}/livros")
    public ResponseEntity<LeitorResponseLivroDTO> getLivrosLeitor(@PathVariable Long id){
        return ResponseEntity.ok(leitorService.getLivrosLeitor(id));
    }
    
    
    // cadastrar leitor
    @PostMapping
    public ResponseEntity<LeitorResponseDTO> createLeitor(@Valid @RequestBody LeitorCreateDTO leitorCreateDTO){
        LeitorResponseDTO created = leitorService.createLeitor(leitorCreateDTO);
        var location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.id())
            .toUri();
        return ResponseEntity.created(location).body(created);
    }
    
    // editar leitor
    @PatchMapping("/{id}")
    public ResponseEntity<LeitorResponseDTO> updateLeitor(
        @PathVariable Long id,
        @Valid @RequestBody LeitorUpdateDTO leitorUpdateDTO)
        {
            return ResponseEntity.ok(leitorService.updateLeitor(id, leitorUpdateDTO));
        }
    
    // apagar leitor
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeitor(@PathVariable Long id){
        leitorService.deleteLeitor(id);
        return ResponseEntity.noContent().build();
    }
}
