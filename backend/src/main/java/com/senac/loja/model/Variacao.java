package com.senac.loja.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "variacoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Variacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(nullable = false, length = 5)
    private String tamanho;

    @Column(nullable = false, length = 40)
    private String cor;

    @Column(nullable = false)
    private Integer estoque;
}
