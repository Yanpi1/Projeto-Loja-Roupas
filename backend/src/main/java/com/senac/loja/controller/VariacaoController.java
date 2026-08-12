package com.senac.loja.controller;

import com.senac.loja.model.Produto;
import com.senac.loja.model.Variacao;
import com.senac.loja.repository.ProdutoRepository;
import com.senac.loja.repository.VariacaoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class VariacaoController {

    private final VariacaoRepository variacaoRepository;
    private final ProdutoRepository produtoRepository;

    public VariacaoController(VariacaoRepository variacaoRepository, ProdutoRepository produtoRepository) {
        this.variacaoRepository = variacaoRepository;
        this.produtoRepository = produtoRepository;
    }

    @GetMapping("/variacoes")
    public List<Variacao> listar(@RequestParam(required = false) Long produtoId) {
        if (produtoId != null) {
            return variacaoRepository.findAllByProdutoId(produtoId);
        }
        return variacaoRepository.findAll();
    }

    @PostMapping("/produtos/{produtoId}/variacoes")
    public Variacao criar(@PathVariable Long produtoId, @RequestBody VariacaoRequest req) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        Variacao variacao = new Variacao();
        variacao.setProduto(produto);
        variacao.setTamanho(req.tamanho);
        variacao.setCor(req.cor);
        variacao.setEstoque(req.estoque);

        return variacaoRepository.save(variacao);
    }
}
