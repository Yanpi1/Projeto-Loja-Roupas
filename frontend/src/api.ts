import type { Categoria, Produto, Variacao, Cliente, Cupom, Pedido } from './types';

const BASE = 'http://localhost:8085/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function del(path: string): Promise<boolean> {
  const res = await fetch(`${BASE}${path}`, { method: 'DELETE' });
  return res.ok;
}

export const api = {
  listarCategorias: () => get<Categoria[]>('/categorias'),
  criarCategoria: (nome: string) => post<Categoria>('/categorias', { nome }),
  excluirCategoria: (id: number) => del(`/categorias/${id}`),

  listarProdutos: (categoriaId?: number) =>
    get<Produto[]>(categoriaId ? `/produtos?categoriaId=${categoriaId}` : '/produtos'),
  criarProduto: (produto: { nome: string; descricao: string; precoBase: number; categoriaId: number }) =>
    post<Produto>('/produtos', produto),

  listarVariacoes: (produtoId?: number) =>
    get<Variacao[]>(produtoId ? `/variacoes?produtoId=${produtoId}` : '/variacoes'),
  criarVariacao: (produtoId: number, variacao: { tamanho: string; cor: string; estoque: number }) =>
    post<Variacao>(`/produtos/${produtoId}/variacoes`, variacao),

  listarClientes: () => get<Cliente[]>('/clientes'),
  criarCliente: (cliente: { nome: string; email: string; cpf: string; telefone: string }) =>
    post<Cliente>('/clientes', cliente),

  listarCupons: () => get<Cupom[]>('/cupons'),
  criarCupom: (cupom: { codigo: string; percentualDesconto: number; validade: string; ativo: boolean }) =>
    post<Cupom>('/cupons', cupom),

  listarPedidos: () => get<Pedido[]>('/pedidos'),
  criarPedido: (pedido: {
    clienteId: number;
    cupomCodigo: string | null;
    itens: { variacaoId: number; quantidade: number }[];
  }) => post<Pedido>('/pedidos', pedido),
};
