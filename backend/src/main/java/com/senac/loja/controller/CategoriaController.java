package com.senac.loja.controller;

import com.senac.loja.model.Categoria;
import com.senac.loja.repository.CategoriaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository repository;

    public CategoriaController(CategoriaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Categoria> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Categoria criar(@RequestBody Categoria categoria) {
        return repository.save(categoria);
    }

    // Remove uma categoria.
    // OBS: a entidade Categoria está mapeada com cascade = ALL + orphanRemoval nos produtos,
    // então excluir uma categoria apaga em cascata todos os produtos vinculados a ela.
    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
