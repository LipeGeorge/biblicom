package com.biblicom.backend.service;

import java.util.Locale;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;

import com.biblicom.backend.entity.dto.Autenticacao.LoginRequestDTO;
import com.biblicom.backend.entity.dto.Autenticacao.LoginResponseDTO;

@Service
public class AutenticacaoService {

    private final AuthenticationManager authenticationManager;
    private final SessionAuthenticationStrategy sessionAuthenticationStrategy;
    private final SecurityContextRepository securityContextRepository;

    public AutenticacaoService(
        AuthenticationManager authenticationManager,
        SessionAuthenticationStrategy sessionAuthenticationStrategy,
        SecurityContextRepository securityContextRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.sessionAuthenticationStrategy = sessionAuthenticationStrategy;
        this.securityContextRepository = securityContextRepository;
    }

    public LoginResponseDTO autenticar(
        LoginRequestDTO request,
        HttpServletRequest servletRequest,
        HttpServletResponse servletResponse
    ) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        Authentication authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken.unauthenticated(email, request.senha()));

        sessionAuthenticationStrategy.onAuthentication(
            authentication,
            servletRequest,
            servletResponse);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, servletRequest, servletResponse);

        return new LoginResponseDTO(authentication.getName(), true);
    }
}
