package com.biblicom.backend.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.biblicom.backend.entity.Autor;
import com.biblicom.backend.entity.Emprestimo;
import com.biblicom.backend.entity.Exemplar;
import com.biblicom.backend.entity.Leitor;
import com.biblicom.backend.entity.Livro;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Transactional
class BibliotecaRepositoryTests {

    @Autowired
    private AutorRepository autorRepository;

    @Autowired
    private LeitorRepository leitorRepository;

    @Autowired
    private LivroRepository livroRepository;

    @Autowired
    private ExemplarRepository exemplarRepository;

    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Test
    void catalogoMostraTotalDeExemplaresEDisponibilidade() {
        Autor autor = autorRepository.save(new Autor(null, "Autor " + UUID.randomUUID(), new ArrayList<>()));
        Livro livro = livroRepository.save(new Livro(null, "Livro " + UUID.randomUUID(), "Ficção", autor));
        exemplarRepository.save(new Exemplar(livro));
        Exemplar emprestado = new Exemplar(livro);
        emprestado.emprestar();
        exemplarRepository.save(emprestado);

        LivroInventoryProjection inventory = livroRepository.findWithInventoryById(livro.getId()).orElseThrow();

        assertEquals(2L, inventory.getTotalExemplares());
        assertEquals(1L, inventory.getExemplaresDisponiveis());
        assertEquals(1L, inventory.getExemplaresEmprestados());
        var catalogEntry = livroRepository.findAllWithInventory().stream()
            .filter(entry -> entry.getId().equals(livro.getId()))
            .findFirst()
            .orElseThrow();
        assertEquals(2L, catalogEntry.getTotalExemplares());
    }

    @Test
    void relatorioAgrupaEmprestimosPorMesEContaAtrasosAtivos() {
        Autor autor = autorRepository.save(new Autor(null, "Autor " + UUID.randomUUID(), new ArrayList<>()));
        Livro livro = livroRepository.save(new Livro(null, "Livro " + UUID.randomUUID(), "Ficção", autor));
        Leitor leitor = leitorRepository.save(new Leitor(
            null,
            "Leitor",
            "leitor-" + UUID.randomUUID() + "@example.com",
            "12345678901"));
        LocalDate hoje = LocalDate.now();

        Exemplar exemplarAtrasado = new Exemplar(livro);
        exemplarAtrasado.emprestar();
        exemplarRepository.save(exemplarAtrasado);
        Exemplar exemplarNoPrazo = new Exemplar(livro);
        exemplarNoPrazo.emprestar();
        exemplarRepository.save(exemplarNoPrazo);

        emprestimoRepository.save(new Emprestimo(
            leitor,
            exemplarAtrasado,
            hoje.minusDays(20),
            hoje.minusDays(1)));
        emprestimoRepository.save(new Emprestimo(
            leitor,
            exemplarNoPrazo,
            hoje,
            hoje.plusDays(5)));

        assertEquals(2L, emprestimoRepository.countByDataDevolucaoIsNull());
        assertEquals(1L, emprestimoRepository.countByDataDevolucaoIsNullAndDataPrevistaDevolucaoBefore(hoje));
        var countsByMonth = emprestimoRepository.contarEmprestimosPorMes();
        assertTrue(countsByMonth.stream().anyMatch(count ->
            count.ano() == hoje.getYear() && count.mes() == hoje.getMonthValue()));
    }
}
