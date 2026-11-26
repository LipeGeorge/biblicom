package com.biblicom.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "tb_exemplares")
@Getter
@NoArgsConstructor
public class Exemplar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "livro_id", nullable = false)
    private Livro livro;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExemplarStatus status = ExemplarStatus.DISPONIVEL;

    public Exemplar(Livro livro) {
        this.livro = livro;
    }

    public void emprestar() {
        if (status != ExemplarStatus.DISPONIVEL) {
            throw new IllegalStateException("Exemplar não está disponível");
        }
        status = ExemplarStatus.EMPRESTADO;
    }

    public void devolver() {
        if (status != ExemplarStatus.EMPRESTADO) {
            throw new IllegalStateException("Exemplar não está emprestado");
        }
        status = ExemplarStatus.DISPONIVEL;
    }
}
