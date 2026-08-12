package com.senac.loja.controller;

import com.senac.loja.model.*;
import com.senac.loja.repository.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final VariacaoRepository variacaoRepository;
    private final CupomRepository cupomRepository;

    public PedidoController(PedidoRepository pedidoRepository, ClienteRepository clienteRepository,
                             VariacaoRepository variacaoRepository, CupomRepository cupomRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.variacaoRepository = variacaoRepository;
        this.cupomRepository = cupomRepository;
    }

    @GetMapping
    public List<Pedido> listar() {
        return pedidoRepository.findAll();
    }

    @PostMapping
    public Pedido criar(@RequestBody PedidoRequest req) {
        Cliente cliente = clienteRepository.findById(req.clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setStatus("ABERTO");

        List<ItemPedido> itens = new ArrayList<>();
        double subtotal = 0;

        for (PedidoRequest.ItemRequest itemReq : req.itens) {
            Variacao variacao = variacaoRepository.findById(itemReq.variacaoId)
                    .orElseThrow(() -> new RuntimeException("Variação não encontrada"));

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setVariacao(variacao);
            item.setQuantidade(itemReq.quantidade);
            item.setPrecoUnitario(variacao.getProduto().getPrecoBase());
            itens.add(item);

            // OBS: soma apenas o preço unitário, sem multiplicar pela quantidade.
            subtotal += item.getPrecoUnitario();

            // OBS: o estoque da variação nunca é reduzido aqui — a venda não dá baixa no estoque.
        }

        double total = subtotal;

        if (req.cupomCodigo != null && !req.cupomCodigo.isBlank()) {
            Cupom cupom = cupomRepository.findByCodigoIgnoreCase(req.cupomCodigo).orElse(null);
            // OBS: não verifica se o cupom está ativo nem se a validade já passou.
            if (cupom != null && Boolean.TRUE.equals(cupom.getAtivo())) {
                pedido.setCupom(cupom);
                // OBS: trata o percentual de desconto como um valor fixo em reais,
                // em vez de calcular a porcentagem sobre o subtotal.
                total = subtotal - cupom.getPercentualDesconto();
            }
        }

        pedido.setItens(itens);
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }
}
