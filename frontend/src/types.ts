export interface Categoria {
  id: number;
  nome: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  precoBase: number;
  categoria: Categoria;
}

export interface Variacao {
  id: number;
  produto: Produto;
  tamanho: string;
  cor: string;
  estoque: number;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

export interface Cupom {
  id: number;
  codigo: string;
  percentualDesconto: number;
  validade: string;
  ativo: boolean;
}

export interface ItemPedido {
  id: number;
  variacao: Variacao;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  id: number;
  cliente: Cliente;
  cupom: Cupom | null;
  dataPedido: string;
  status: string;
  total: number;
  itens: ItemPedido[];
}

// item ainda não enviado, montado no carrinho do formulário de novo pedido
export interface ItemCarrinho {
  variacao: Variacao;
  quantidade: number;
}
