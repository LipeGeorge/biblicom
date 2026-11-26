package com.biblicom.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import com.biblicom.backend.entity.dto.Emprestimo.EmprestimoCreateDTO;
import com.biblicom.backend.entity.dto.Emprestimo.EmprestimoRelatorioDTO;
import com.biblicom.backend.entity.dto.Emprestimo.EmprestimoResponseDTO;
import com.biblicom.backend.service.EmprestimoService;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    public EmprestimoController(EmprestimoService emprestimoService) {
        this.emprestimoService = emprestimoService;
    }

    @GetMapping
    public ResponseEntity<List<EmprestimoResponseDTO>> listar() {
        return ResponseEntity.ok(emprestimoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmprestimoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimoService.buscarPorId(id));
    }

    @GetMapping("/leitores/{leitorId}")
    public ResponseEntity<List<EmprestimoResponseDTO>> listarPorLeitor(@PathVariable Long leitorId) {
        return ResponseEntity.ok(emprestimoService.listarPorLeitor(leitorId));
    }

    @GetMapping("/relatorios")
    public ResponseEntity<EmprestimoRelatorioDTO> gerarRelatorio() {
        return ResponseEntity.ok(emprestimoService.gerarRelatorio());
    }

    @PostMapping
    public ResponseEntity<EmprestimoResponseDTO> criar(
        @Valid @RequestBody EmprestimoCreateDTO request
    ) {
        EmprestimoResponseDTO created = emprestimoService.criar(request);
        var location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(created.id())
            .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PatchMapping("/{id}/devolucao")
    public ResponseEntity<EmprestimoResponseDTO> registrarDevolucao(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimoService.registrarDevolucao(id));
    }
}
