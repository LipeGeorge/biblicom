package com.biblicom.backend.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@Table(name = "tb_autores")
@Setter 
@Getter
@NoArgsConstructor 
@AllArgsConstructor 
public class Autor {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "livros")
    @ManyToMany 
    @JoinTable(
        name = "tb_autores_livros",
        joinColumns = @JoinColumn(name = "autor_id"),
        inverseJoinColumns = @JoinColumn(name = "livro_id")
    )
    private List<Livro> livros = new ArrayList<>();

}
