package com.biblicom.backend.controller;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.biblicom.backend.entity.dto.Leitor.LeitorResponseDTO;
import com.biblicom.backend.service.LeitorService;

import static org.hamcrest.Matchers.endsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LeitorController.class)
class LeitorControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LeitorService leitorService;

    @Test
    void createLeitorReturnsCreatedAndLocation() throws Exception {
        when(leitorService.createLeitor(any())).thenReturn(new LeitorResponseDTO(
            1L,
            "Ana",
            "ana@example.com",
            "12345678901",
            List.of()));

        mockMvc.perform(post("/leitores")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "nome": "Ana",
                      "email": "ana@example.com",
                      "cpf": "12345678901"
                    }
                    """))
            .andExpect(status().isCreated())
            .andExpect(header().string("Location", endsWith("/leitores/1")))
            .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void createLeitorRejectsInvalidRequestBody() throws Exception {
        mockMvc.perform(post("/leitores")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "nome": "",
                      "email": "not-an-email",
                      "cpf": "invalid"
                    }
                    """))
            .andExpect(status().isBadRequest());
    }
}
