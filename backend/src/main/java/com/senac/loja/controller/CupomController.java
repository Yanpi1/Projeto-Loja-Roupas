package com.senac.loja.controller;

import com.senac.loja.model.Cupom;
import com.senac.loja.repository.CupomRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cupons")
public class CupomController {

    private final CupomRepository repository;

    public CupomController(CupomRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Cupom> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Cupom criar(@RequestBody Cupom cupom) {
        if (cupom.getAtivo() == null) cupom.setAtivo(true);
        return repository.save(cupom);
    }
}
