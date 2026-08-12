package com.senac.loja.repository;

import com.senac.loja.model.Variacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VariacaoRepository extends JpaRepository<Variacao, Long> {
    List<Variacao> findAllByProdutoId(Long produtoId);
}
