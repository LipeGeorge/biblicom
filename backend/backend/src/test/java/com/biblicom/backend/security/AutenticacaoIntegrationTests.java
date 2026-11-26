package com.biblicom.backend.security;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.biblicom.backend.entity.Responsavel;
import com.biblicom.backend.repository.ResponsavelRepository;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AutenticacaoIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ResponsavelRepository responsavelRepository;

    @Test
    void loginCriaSessaoQueAutorizaAsRotasProtegidas() throws Exception {
        String email = "responsavel-" + UUID.randomUUID() + "@example.com";
        String senha = "Senha-forte-de-teste-2026!";
        responsavelRepository.saveAndFlush(new Responsavel(email, passwordEncoder.encode(senha)));

        MvcResult csrfResult = mockMvc.perform(get("/auth/csrf"))
            .andExpect(status().isOk())
            .andReturn();
        Matcher tokenMatcher = Pattern.compile("\"token\"\\s*:\\s*\"([^\"]+)\"")
            .matcher(csrfResult.getResponse().getContentAsString());
        assertTrue(tokenMatcher.find());
        String csrfToken = tokenMatcher.group(1);
        Cookie csrfCookie = csrfResult.getResponse().getCookie("XSRF-TOKEN");
        assertNotNull(csrfCookie);

        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                .cookie(csrfCookie)
                .header("X-XSRF-TOKEN", csrfToken)
                .contentType("application/json")
                .content("""
                    {"email": "%s", "senha": "%s"}
                    """.formatted(email, senha)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value(email))
            .andReturn();
        MockHttpSession session = (MockHttpSession) loginResult.getRequest().getSession(false);
        assertNotNull(session);

        mockMvc.perform(get("/auth/me").session(session))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.autenticado").value(true));

    }
}
