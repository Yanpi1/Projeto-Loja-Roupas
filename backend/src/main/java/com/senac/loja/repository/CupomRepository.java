package com.senac.loja.repository;

import com.senac.loja.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CupomRepository extends JpaRepository<Cupom, Long> {
    Optional<Cupom> findByCodigoIgnoreCase(String codigo);
}
