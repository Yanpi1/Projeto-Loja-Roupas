package com.senac.loja;

import com.senac.loja.model.*;
import com.senac.loja.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final ProdutoRepository produtoRepository;
    private final VariacaoRepository variacaoRepository;
    private final ClienteRepository clienteRepository;
    private final CupomRepository cupomRepository;

    public DataSeeder(CategoriaRepository categoriaRepository, ProdutoRepository produtoRepository,
                       VariacaoRepository variacaoRepository, ClienteRepository clienteRepository,
                       CupomRepository cupomRepository) {
        this.categoriaRepository = categoriaRepository;
        this.produtoRepository = produtoRepository;
        this.variacaoRepository = variacaoRepository;
        this.clienteRepository = clienteRepository;
        this.cupomRepository = cupomRepository;
    }

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() > 0) return;

        Categoria camisetas = categoriaRepository.save(new Categoria(null, "Camisetas"));
        Categoria calcas = categoriaRepository.save(new Categoria(null, "Calças"));
        Categoria vestidos = categoriaRepository.save(new Categoria(null, "Vestidos"));
        Categoria acessorios = categoriaRepository.save(new Categoria(null, "Acessórios"));

        Produto camisetaBasica = produtoRepository.save(
                new Produto(null, "Camiseta Básica", "Camiseta 100% algodão, corte reto", 59.90, camisetas));
        Produto camisetaEstampada = produtoRepository.save(
                new Produto(null, "Camiseta Estampada", "Estampa exclusiva, algodão premium", 79.90, camisetas));
        Produto calcaJeans = produtoRepository.save(
                new Produto(null, "Calça Jeans Skinny", "Jeans com elastano, modelagem skinny", 149.90, calcas));
        Produto vestidoFloral = produtoRepository.save(
                new Produto(null, "Vestido Floral Midi", "Vestido midi estampa floral, manga curta", 189.90, vestidos));
        Produto bone = produtoRepository.save(
                new Produto(null, "Boné Aba Reta", "Boné unissex, tamanho único ajustável", 49.90, acessorios));

        variacaoRepository.save(new Variacao(null, camisetaBasica, "P", "Branco", 20));
        variacaoRepository.save(new Variacao(null, camisetaBasica, "M", "Branco", 15));
        variacaoRepository.save(new Variacao(null, camisetaBasica, "G", "Branco", 5));

        variacaoRepository.save(new Variacao(null, camisetaEstampada, "P", "Preto", 10));
        variacaoRepository.save(new Variacao(null, camisetaEstampada, "M", "Preto", 8));

        variacaoRepository.save(new Variacao(null, calcaJeans, "38", "Azul", 12));
        variacaoRepository.save(new Variacao(null, calcaJeans, "40", "Azul", 3));

        variacaoRepository.save(new Variacao(null, vestidoFloral, "P", "Floral", 6));
        variacaoRepository.save(new Variacao(null, vestidoFloral, "M", "Floral", 2));

        variacaoRepository.save(new Variacao(null, bone, "Único", "Preto", 30));

        clienteRepository.save(new Cliente(null, "Juliana Prado", "juliana.prado@email.com", "111.222.333-44", "(61) 99111-2233"));
        clienteRepository.save(new Cliente(null, "Marcos Vinícius", "marcos.vinicius@email.com", "222.333.444-55", "(61) 99222-3344"));
        clienteRepository.save(new Cliente(null, "Patrícia Gomes", "patricia.gomes@email.com", "333.444.555-66", "(61) 99333-4455"));

        // Cupom válido
        cupomRepository.save(new Cupom(null, "BEMVINDO10", 10.0, LocalDate.now().plusDays(60), true));
        // Cupom com validade vencida — usado pra testar se o sistema ainda aceita indevidamente
        cupomRepository.save(new Cupom(null, "PROMOEXPIRADA", 20.0, LocalDate.now().minusDays(10), true));
        // Cupom desativado manualmente — usado pra testar se o sistema ignora o campo "ativo"
        cupomRepository.save(new Cupom(null, "INATIVO15", 15.0, LocalDate.now().plusDays(30), false));
    }
}
