package com.biblicom.backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_emprestimos")
@Getter
@NoArgsConstructor
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "leitor_id", nullable = false)
    private Leitor leitor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exemplar_id", nullable = false)
    private Exemplar exemplar;

    @Column(name = "data_emprestimo", nullable = false)
    private LocalDate dataEmprestimo;

    @Column(name = "data_prevista_devolucao", nullable = false)
    private LocalDate dataPrevistaDevolucao;

    @Column(name = "data_devolucao")
    private LocalDate dataDevolucao;

    public Emprestimo(
        Leitor leitor,
        Exemplar exemplar,
        LocalDate dataEmprestimo,
        LocalDate dataPrevistaDevolucao
    ) {
        this.leitor = leitor;
        this.exemplar = exemplar;
        this.dataEmprestimo = dataEmprestimo;
        this.dataPrevistaDevolucao = dataPrevistaDevolucao;
    }

    public boolean estaAtivo() {
        return dataDevolucao == null;
    }

    public boolean estaAtrasado(LocalDate hoje) {
        return estaAtivo() && dataPrevistaDevolucao.isBefore(hoje);
    }

    public void registrarDevolucao(LocalDate dataDevolucao) {
        if (!estaAtivo()) {
            throw new IllegalStateException("Empréstimo já foi devolvido");
        }
        this.dataDevolucao = dataDevolucao;
    }
}
