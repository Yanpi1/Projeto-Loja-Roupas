package com.senac.loja.controller;

import com.senac.loja.model.Categoria;
import com.senac.loja.model.Produto;
import com.senac.loja.repository.CategoriaRepository;
import com.senac.loja.repository.ProdutoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoController(ProdutoRepository produtoRepository, CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @GetMapping
    public List<Produto> listar(@RequestParam(required = false) Long categoriaId) {
        if (categoriaId != null) {
            return produtoRepository.findAllByCategoriaId(categoriaId);
        }
        return produtoRepository.findAll();
    }

    @PostMapping
    public Produto criar(@RequestBody ProdutoRequest req) {
        Categoria categoria = categoriaRepository.findById(req.categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        Produto produto = new Produto();
        produto.setNome(req.nome);
        produto.setDescricao(req.descricao);
        produto.setPrecoBase(req.precoBase);
        produto.setCategoria(categoria);

        return produtoRepository.save(produto);
    }
}
