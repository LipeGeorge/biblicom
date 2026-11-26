package com.biblicom.backend.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.biblicom.backend.repository.ResponsavelRepository;

@Service
public class ResponsavelUserDetailsService implements UserDetailsService {

    private final ResponsavelRepository responsavelRepository;

    public ResponsavelUserDetailsService(ResponsavelRepository responsavelRepository) {
        this.responsavelRepository = responsavelRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        var responsavel = responsavelRepository.findByEmailIgnoreCase(email)
            .orElseThrow(() -> new UsernameNotFoundException("Credenciais inválidas"));

        return User.withUsername(responsavel.getEmail())
            .password(responsavel.getSenhaHash())
            .roles("BIBLIOTECARIO")
            .build();
    }
}
