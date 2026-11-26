package com.biblicom.backend.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_livros")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class Livro {

    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "titulo")
    private String titulo;
    
    @Column(name = "genero")
    private String genero;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn (name = "autor_id")
    private Autor autor;
}
