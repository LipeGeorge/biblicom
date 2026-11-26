package com.biblicom.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biblicom.backend.entity.dto.Autenticacao.LoginRequestDTO;
import com.biblicom.backend.entity.dto.Autenticacao.LoginResponseDTO;
import com.biblicom.backend.service.AutenticacaoService;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    private final AutenticacaoService autenticacaoService;

    public AutenticacaoController(AutenticacaoService autenticacaoService) {
        this.autenticacaoService = autenticacaoService;
    }

    @GetMapping("/csrf")
    public CsrfToken csrfToken(CsrfToken csrfToken) {
        return csrfToken;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
        @Valid @RequestBody LoginRequestDTO request,
        HttpServletRequest servletRequest,
        HttpServletResponse servletResponse
    ) {
        return ResponseEntity.ok(autenticacaoService.autenticar(
            request,
            servletRequest,
            servletResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponseDTO> usuarioAutenticado(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(new LoginResponseDTO(userDetails.getUsername(), true));
    }
}
