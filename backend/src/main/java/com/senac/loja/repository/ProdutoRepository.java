package com.senac.loja.repository;

import com.senac.loja.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findAllByCategoriaId(Long categoriaId);
    boolean existsByCategoriaId(Long categoriaId);
}
