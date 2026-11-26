package com.biblicom.backend.service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.biblicom.backend.entity.Emprestimo;
import com.biblicom.backend.entity.EmprestimoSituacao;
import com.biblicom.backend.entity.Exemplar;
import com.biblicom.backend.entity.ExemplarStatus;
import com.biblicom.backend.entity.Leitor;
import com.biblicom.backend.entity.Livro;
import com.biblicom.backend.entity.dto.Emprestimo.EmprestimoCreateDTO;
import com.biblicom.backend.repository.EmprestimoRepository;
import com.biblicom.backend.repository.ExemplarRepository;
import com.biblicom.backend.repository.LeitorRepository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class EmprestimoServiceTests {

    @Mock
    private EmprestimoRepository emprestimoRepository;

    @Mock
    private ExemplarRepository exemplarRepository;

    @Mock
    private LeitorRepository leitorRepository;

    @InjectMocks
    private EmprestimoService emprestimoService;

    @Test
    void criarEmprestimoMarcaExemplarComoEmprestado() {
        Leitor leitor = new Leitor(5L, "Leitor", "leitor@example.com", "12345678901");
        Livro livro = new Livro(UUID.randomUUID(), "Livro", "Gênero", null);
        Exemplar exemplar = new Exemplar(livro);
        when(leitorRepository.findById(5L)).thenReturn(Optional.of(leitor));
        when(exemplarRepository.findByIdForUpdate(8L)).thenReturn(Optional.of(exemplar));
        when(emprestimoRepository.save(any(Emprestimo.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        var response = emprestimoService.criar(
            new EmprestimoCreateDTO(5L, 8L, LocalDate.now().plusDays(14)));

        assertEquals(5L, response.leitorId());
        assertEquals("Livro", response.livroTitulo());
        assertEquals(ExemplarStatus.EMPRESTADO, exemplar.getStatus());
        verify(exemplarRepository).save(exemplar);
    }

    @Test
    void criarEmprestimoRecusaExemplarJaEmprestado() {
        Leitor leitor = new Leitor(5L, "Leitor", "leitor@example.com", "12345678901");
        Exemplar exemplar = new Exemplar(new Livro(UUID.randomUUID(), "Livro", "Gênero", null));
        exemplar.emprestar();
        when(leitorRepository.findById(5L)).thenReturn(Optional.of(leitor));
        when(exemplarRepository.findByIdForUpdate(8L)).thenReturn(Optional.of(exemplar));

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> emprestimoService.criar(
                new EmprestimoCreateDTO(5L, 8L, LocalDate.now().plusDays(14))));

        assertEquals(409, exception.getStatusCode().value());
    }

    @Test
    void registrarDevolucaoLiberaExemplar() {
        Leitor leitor = new Leitor(5L, "Leitor", "leitor@example.com", "12345678901");
        Livro livro = new Livro(UUID.randomUUID(), "Livro", "Gênero", null);
        Exemplar exemplar = mock(Exemplar.class);
        when(exemplar.getId()).thenReturn(8L);
        when(exemplar.getStatus()).thenReturn(ExemplarStatus.EMPRESTADO);
        when(exemplar.getLivro()).thenReturn(livro);

        Emprestimo emprestimo = new Emprestimo(
            leitor,
            exemplar,
            LocalDate.now().minusDays(3),
            LocalDate.now().minusDays(1));
        when(emprestimoRepository.findByIdForUpdate(12L)).thenReturn(Optional.of(emprestimo));
        when(exemplarRepository.findByIdForUpdate(8L)).thenReturn(Optional.of(exemplar));
        when(emprestimoRepository.save(any(Emprestimo.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        var response = emprestimoService.registrarDevolucao(12L);

        assertEquals(LocalDate.now(), response.dataDevolucao());
        assertEquals(EmprestimoSituacao.DEVOLVIDO, response.situacao());
        verify(exemplar).devolver();
        verify(exemplarRepository).save(exemplar);
    }
}
