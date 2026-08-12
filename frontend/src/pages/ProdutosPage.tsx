import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Categoria, Produto, Variacao } from '../types';

export default function ProdutosPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [variacoes, setVariacoes] = useState<Variacao[]>([]);

  const [filtroCategoriaId, setFiltroCategoriaId] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  async function carregar() {
    setCategorias(await api.listarCategorias());
    setProdutos(await api.listarProdutos());
    setVariacoes(await api.listarVariacoes());
  }
  useEffect(() => { carregar(); }, []);

  // OBS: filtroCategoriaId vem do <select> como string, mas p.categoria.id é number.
  // A comparação estrita nunca é verdadeira quando um filtro é escolhido.
  const produtosFiltrados = filtroCategoriaId
    ? produtos.filter(p => p.categoria.id === filtroCategoriaId)
    : produtos;

  // ---------- NOVO PRODUTO ----------
  const [formProduto, setFormProduto] = useState({ nome: '', descricao: '', precoBase: '', categoriaId: '' });
  async function handleCriarProduto(e: React.FormEvent) {
    e.preventDefault();
    await api.criarProduto({
      nome: formProduto.nome,
      descricao: formProduto.descricao,
      precoBase: Number(formProduto.precoBase),
      categoriaId: Number(formProduto.categoriaId),
    });
    setFormProduto({ nome: '', descricao: '', precoBase: '', categoriaId: '' });
    carregar();
  }

  // ---------- NOVA VARIAÇÃO ----------
  const [formVariacao, setFormVariacao] = useState({ tamanho: '', cor: '', estoque: '' });
  async function handleCriarVariacao(e: React.FormEvent) {
    e.preventDefault();
    if (!produtoSelecionado) return;
    await api.criarVariacao(produtoSelecionado.id, {
      tamanho: formVariacao.tamanho,
      cor: formVariacao.cor,
      estoque: Number(formVariacao.estoque),
    });
    setFormVariacao({ tamanho: '', cor: '', estoque: '' });
    carregar();
  }

  function variacoesDoProduto(produtoId: number): Variacao[] {
    return variacoes.filter(v => v.produto.id === produtoId);
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Produtos</h1>
        <p>Cadastre peças e suas variações de tamanho e cor.</p>
      </div>

      <div className="card">
        <h2>Novo produto</h2>
        <form className="grid-form" onSubmit={handleCriarProduto}>
          <input placeholder="Nome" value={formProduto.nome}
            onChange={e => setFormProduto({ ...formProduto, nome: e.target.value })} required />
          <input placeholder="Descrição" value={formProduto.descricao}
            onChange={e => setFormProduto({ ...formProduto, descricao: e.target.value })} />
          <input type="number" step="0.01" placeholder="Preço base (R$)" value={formProduto.precoBase}
            onChange={e => setFormProduto({ ...formProduto, precoBase: e.target.value })} required />
          <select value={formProduto.categoriaId}
            onChange={e => setFormProduto({ ...formProduto, categoriaId: e.target.value })} required>
            <option value="">Categoria</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <button type="submit" className="btn-primary">Adicionar produto</button>
        </form>
      </div>

      <div className="card">
        <div className="card-head-row">
          <h2>Catálogo</h2>
          <select className="filter-select" value={filtroCategoriaId} onChange={e => setFiltroCategoriaId(e.target.value)}>
            <option value="">Todas as categorias</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>

        <div className="produto-grid">
          {produtosFiltrados.map(p => (
            <button
              key={p.id}
              className={'produto-card' + (produtoSelecionado?.id === p.id ? ' selected' : '')}
              onClick={() => setProdutoSelecionado(p)}
            >
              <span className="produto-categoria">{p.categoria.nome}</span>
              <span className="produto-nome">{p.nome}</span>
              <span className="produto-preco">R$ {p.precoBase.toFixed(2).replace('.', ',')}</span>
              <span className="produto-variacoes">{variacoesDoProduto(p.id).length} variações</span>
            </button>
          ))}
          {produtosFiltrados.length === 0 && (
            <p className="empty-state">Nenhum produto encontrado para este filtro.</p>
          )}
        </div>
      </div>

      {produtoSelecionado && (
        <div className="card">
          <h2>Variações — {produtoSelecionado.nome}</h2>

          <form className="inline-form" onSubmit={handleCriarVariacao}>
            <input placeholder="Tamanho (ex: P, M, G, 40)" value={formVariacao.tamanho}
              onChange={e => setFormVariacao({ ...formVariacao, tamanho: e.target.value })} required />
            <input placeholder="Cor" value={formVariacao.cor}
              onChange={e => setFormVariacao({ ...formVariacao, cor: e.target.value })} required />
            <input type="number" placeholder="Estoque" value={formVariacao.estoque}
              onChange={e => setFormVariacao({ ...formVariacao, estoque: e.target.value })} required />
            <button type="submit" className="btn-primary">Adicionar variação</button>
          </form>

          <table className="data-table">
            <thead><tr><th>Tamanho</th><th>Cor</th><th>Estoque</th></tr></thead>
            <tbody>
              {variacoesDoProduto(produtoSelecionado.id).map(v => (
                <tr key={v.id}>
                  <td>{v.tamanho}</td>
                  <td>{v.cor}</td>
                  <td>{v.estoque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
