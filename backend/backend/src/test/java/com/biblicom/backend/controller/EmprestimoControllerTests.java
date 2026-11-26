package com.biblicom.backend.controller;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.biblicom.backend.entity.EmprestimoSituacao;
import com.biblicom.backend.entity.dto.Emprestimo.EmprestimoResponseDTO;
import com.biblicom.backend.service.EmprestimoService;

import static org.hamcrest.Matchers.endsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmprestimoController.class)
@AutoConfigureMockMvc(addFilters = false)
class EmprestimoControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EmprestimoService emprestimoService;

    @Test
    void criarEmprestimoReturnsCreatedAndLocation() throws Exception {
        when(emprestimoService.criar(any())).thenReturn(new EmprestimoResponseDTO(
            12L,
            5L,
            "Leitor",
            8L,
            UUID.randomUUID(),
            "Livro",
            LocalDate.now(),
            LocalDate.now().plusDays(14),
            null,
            EmprestimoSituacao.ATIVO));

        mockMvc.perform(post("/emprestimos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "leitorId": 5,
                      "exemplarId": 8,
                      "dataPrevistaDevolucao": "2099-12-31"
                    }
                    """))
            .andExpect(status().isCreated())
            .andExpect(header().string("Location", endsWith("/emprestimos/12")));
    }

    @Test
    void criarEmprestimoRejeitaPrazoNoPassado() throws Exception {
        mockMvc.perform(post("/emprestimos")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "leitorId": 5,
                      "exemplarId": 8,
                      "dataPrevistaDevolucao": "2000-01-01"
                    }
                    """))
            .andExpect(status().isBadRequest());

        verifyNoInteractions(emprestimoService);
    }
}
