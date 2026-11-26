package com.biblicom.backend.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.ApplicationArguments;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.biblicom.backend.entity.Responsavel;
import com.biblicom.backend.repository.ResponsavelRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResponsavelAccountBootstrapTests {

    @Mock
    private ResponsavelRepository responsavelRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ApplicationArguments applicationArguments;

    @Test
    void bootstrapArmazenaHashEmVezDaSenhaOriginal() {
        String password = "Senha-forte-de-teste-2026!";
        when(responsavelRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode(password)).thenReturn("$2a$12$hash-de-teste");

        ResponsavelAccountBootstrap bootstrap = new ResponsavelAccountBootstrap(
            responsavelRepository,
            passwordEncoder,
            true,
            "  Biblioteca@Example.com ",
            password);
        bootstrap.run(applicationArguments);

        ArgumentCaptor<Responsavel> accountCaptor = ArgumentCaptor.forClass(Responsavel.class);
        verify(responsavelRepository).save(accountCaptor.capture());
        Responsavel saved = accountCaptor.getValue();
        assertEquals("biblioteca@example.com", saved.getEmail());
        assertNotEquals(password, saved.getSenhaHash());
        assertEquals("$2a$12$hash-de-teste", saved.getSenhaHash());
    }
}
