package com.biblicom.backend.repository;

import java.util.UUID;

public interface LivroInventoryProjection {

    UUID getId();

    String getTitulo();

    String getGenero();

    String getAutor();

    Long getTotalExemplares();

    Long getExemplaresDisponiveis();

    Long getExemplaresEmprestados();
}
