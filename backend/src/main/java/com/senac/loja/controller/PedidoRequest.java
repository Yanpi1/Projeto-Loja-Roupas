package com.senac.loja.controller;

import java.util.List;

public class PedidoRequest {
    public Long clienteId;
    public String cupomCodigo;
    public List<ItemRequest> itens;

    public static class ItemRequest {
        public Long variacaoId;
        public Integer quantidade;
    }
}
