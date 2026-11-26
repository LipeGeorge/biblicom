package com.biblicom.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.biblicom.backend.entity.Responsavel;
import com.biblicom.backend.repository.ResponsavelRepository;

@Component
public class ResponsavelAccountBootstrap implements ApplicationRunner {

    private final ResponsavelRepository responsavelRepository;
    private final PasswordEncoder passwordEncoder;
    private final boolean bootstrapEnabled;
    private final String email;
    private final String senha;

    public ResponsavelAccountBootstrap(
        ResponsavelRepository responsavelRepository,
        PasswordEncoder passwordEncoder,
        @Value("${BIBLICOM_ADMIN_BOOTSTRAP_ENABLED:false}") boolean bootstrapEnabled,
        @Value("${BIBLICOM_ADMIN_EMAIL:}") String email,
        @Value("${BIBLICOM_ADMIN_PASSWORD:}") String senha
    ) {
        this.responsavelRepository = responsavelRepository;
        this.passwordEncoder = passwordEncoder;
        this.bootstrapEnabled = bootstrapEnabled;
        this.email = email;
        this.senha = senha;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments arguments) {
        if (!bootstrapEnabled || responsavelRepository.count() > 0) {
            return;
        }
        if (!StringUtils.hasText(email) || !StringUtils.hasText(senha)) {
            throw new IllegalStateException(
                "Defina BIBLICOM_ADMIN_EMAIL e BIBLICOM_ADMIN_PASSWORD para criar a conta inicial");
        }
        if (senha.length() < 12) {
            throw new IllegalStateException("A senha inicial deve conter pelo menos 12 caracteres");
        }

        responsavelRepository.save(new Responsavel(
            email.trim().toLowerCase(),
            passwordEncoder.encode(senha)));
    }
}
