package com.biblicom.backend.repository;

import java.util.UUID;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.biblicom.backend.entity.Livro;

public interface LivroRepository extends JpaRepository<Livro, UUID>{

    @Query("""
        select livro.id as id,
            livro.titulo as titulo,
            livro.genero as genero,
            autor.nome as autor,
            count(exemplar.id) as totalExemplares,
            count(case when exemplar.status = com.biblicom.backend.entity.ExemplarStatus.DISPONIVEL
                then exemplar.id else null end) as exemplaresDisponiveis,
            count(case when exemplar.status = com.biblicom.backend.entity.ExemplarStatus.EMPRESTADO
                then exemplar.id else null end) as exemplaresEmprestados
        from Livro livro
        join livro.autor autor
        left join Exemplar exemplar on exemplar.livro = livro
        group by livro.id, livro.titulo, livro.genero, autor.nome
        """)
    List<LivroInventoryProjection> findAllWithInventory();

    @Query("""
        select livro.id as id,
            livro.titulo as titulo,
            livro.genero as genero,
            autor.nome as autor,
            count(exemplar.id) as totalExemplares,
            count(case when exemplar.status = com.biblicom.backend.entity.ExemplarStatus.DISPONIVEL
                then exemplar.id else null end) as exemplaresDisponiveis,
            count(case when exemplar.status = com.biblicom.backend.entity.ExemplarStatus.EMPRESTADO
                then exemplar.id else null end) as exemplaresEmprestados
        from Livro livro
        join livro.autor autor
        left join Exemplar exemplar on exemplar.livro = livro
        where livro.id = :id
        group by livro.id, livro.titulo, livro.genero, autor.nome
        """)
    Optional<LivroInventoryProjection> findWithInventoryById(@Param("id") UUID id);
}
