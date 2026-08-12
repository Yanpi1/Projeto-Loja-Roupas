import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Cliente, Produto, Variacao, Pedido, ItemCarrinho } from '../types';

export default function PedidosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [clienteId, setClienteId] = useState('');
  const [cupomCodigo, setCupomCodigo] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [variacaoId, setVariacaoId] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [ultimoPedido, setUltimoPedido] = useState<Pedido | null>(null);

  async function carregar() {
    setClientes(await api.listarClientes());
    setProdutos(await api.listarProdutos());
    setVariacoes(await api.listarVariacoes());
    setPedidos(await api.listarPedidos());
  }
  useEffect(() => { carregar(); }, []);

  const variacoesDoProdutoSelecionado = variacoes.filter(v => String(v.produto.id) === produtoId);

  // OBS: sempre adiciona uma nova linha no carrinho, mesmo se a variação já estiver nele —
  // deveria, nesse caso, somar a quantidade na linha existente.
  function handleAdicionarAoCarrinho() {
    const variacao = variacoes.find(v => v.id === Number(variacaoId));
    if (!variacao || !quantidade) return;

    setCarrinho([...carrinho, { variacao, quantidade: Number(quantidade) }]);
    setQuantidade('1');
  }

  function handleRemoverDoCarrinho(index: number) {
    setCarrinho(carrinho.filter((_, i) => i !== index));
  }

  const subtotalCarrinho = carrinho.reduce(
    (soma, item) => soma + item.variacao.produto.precoBase * item.quantidade,
    0
  );

  async function handleFinalizarPedido() {
    if (!clienteId || carrinho.length === 0) return;

    const pedido = await api.criarPedido({
      clienteId: Number(clienteId),
      cupomCodigo: cupomCodigo.trim() || null,
      itens: carrinho.map(item => ({ variacaoId: item.variacao.id, quantidade: item.quantidade })),
    });

    setUltimoPedido(pedido);
    setCarrinho([]);
    setCupomCodigo('');
    setClienteId('');
    carregar();
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Pedidos</h1>
        <p>Monte um novo pedido e acompanhe o histórico de vendas.</p>
      </div>

      <div className="card">
        <h2>Novo pedido</h2>

        <div className="pedido-builder">
          <div className="pedido-form-col">
            <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
              <option value="">Cliente</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>

            <div className="item-picker">
              <select value={produtoId} onChange={e => { setProdutoId(e.target.value); setVariacaoId(''); }}>
                <option value="">Produto</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <select value={variacaoId} onChange={e => setVariacaoId(e.target.value)} disabled={!produtoId}>
                <option value="">Tamanho / cor</option>
                {variacoesDoProdutoSelecionado.map(v => (
                  <option key={v.id} value={v.id}>{v.tamanho} · {v.cor} ({v.estoque} em estoque)</option>
                ))}
              </select>
              <input
                type="number" min={1} className="qty-input"
                value={quantidade} onChange={e => setQuantidade(e.target.value)}
              />
              <button type="button" className="btn-secondary" onClick={handleAdicionarAoCarrinho} disabled={!variacaoId}>
                + Adicionar
              </button>
            </div>

            <input
              placeholder="Código de cupom (opcional)"
              value={cupomCodigo}
              onChange={e => setCupomCodigo(e.target.value.toUpperCase())}
              className="cupom-input"
            />
          </div>

          <div className="cart-col">
            <h3>Carrinho</h3>
            {carrinho.length === 0 && <p className="empty-state">Nenhum item adicionado ainda.</p>}
            {carrinho.map((item, i) => (
              <div className="cart-line" key={i}>
                <div>
                  <strong>{item.variacao.produto.nome}</strong>
                  <span className="cart-line-meta">{item.variacao.tamanho} · {item.variacao.cor} × {item.quantidade}</span>
                </div>
                <div className="cart-line-right">
                  <span>R$ {(item.variacao.produto.precoBase * item.quantidade).toFixed(2).replace('.', ',')}</span>
                  <button className="link-danger" onClick={() => handleRemoverDoCarrinho(i)}>remover</button>
                </div>
              </div>
            ))}
            {carrinho.length > 0 && (
              <div className="cart-total">
                <span>Subtotal estimado</span>
                <strong>R$ {subtotalCarrinho.toFixed(2).replace('.', ',')}</strong>
              </div>
            )}
            <button
              className="btn-primary btn-block"
              onClick={handleFinalizarPedido}
              disabled={!clienteId || carrinho.length === 0}
            >
              Finalizar pedido
            </button>
          </div>
        </div>
      </div>

      {ultimoPedido && (
        <div className="card highlight">
          <h2>Pedido #{ultimoPedido.id} registrado</h2>
          <p>Cliente: <strong>{ultimoPedido.cliente.nome}</strong> · Status: {ultimoPedido.status}</p>
          <p className="pedido-total">Total cobrado: <strong>R$ {ultimoPedido.total.toFixed(2).replace('.', ',')}</strong></p>
        </div>
      )}

      <div className="card">
        <h2>Histórico de pedidos</h2>
        <table className="data-table">
          <thead><tr><th>#</th><th>Cliente</th><th>Cupom</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.cliente?.nome}</td>
                <td>{p.cupom?.codigo || '—'}</td>
                <td>R$ {p.total.toFixed(2).replace('.', ',')}</td>
                <td><span className="tag tag-muted">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
