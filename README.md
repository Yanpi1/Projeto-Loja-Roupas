# Atelier — Sistema de Gestão de Loja de Roupas

Projeto de manutenção — **nível avançado**. Catálogo com variações de tamanho/cor, clientes,
cupons de desconto e pedidos com múltiplos itens.

Este é o projeto mais complexo da sequência: 7 entidades relacionadas (Categoria, Produto,
Variação, Cliente, Cupom, Pedido, Item do Pedido), regras de negócio de e-commerce de verdade
(estoque por variação, cálculo de desconto, total do pedido) e frontend em **React + TypeScript**.

## Tecnologias
- Backend: Java + Spring Boot (porta 8085)
- Banco de dados: PostgreSQL (via Docker, porta 5437)
- Frontend: React + TypeScript + Vite (porta 5177)

## Como rodar

1. **Subir o banco de dados** (dentro desta pasta)
   ```
   docker compose up -d
   ```

2. **Rodar o backend**
   ```
   cd backend
   mvn spring-boot:run
   ```
   As tabelas são criadas automaticamente e populadas com dados de exemplo — categorias, produtos
   com variações, clientes e três cupons (repare bem nas datas de validade e no status de cada um).

3. **Rodar o frontend** (em outro terminal)
   ```
   cd frontend
   npm install
   npm run dev
   ```

4. Acesse **http://localhost:5177** no navegador.

## O que fazer

Use o sistema pelas 5 áreas do menu lateral (Pedidos, Produtos, Categorias, Clientes, Cupons):

- Cadastre produtos novos e suas variações de tamanho/cor
- Filtre o catálogo por categoria
- Monte um pedido: escolha cliente, adicione itens (repare no subtotal estimado no carrinho antes
  de finalizar) e tente aplicar os cupons cadastrados
- Adicione o mesmo item duas vezes ao carrinho e veja o que acontece
- Depois de finalizar um pedido, confira se o total cobrado bate com o que era esperado
- Tente excluir uma categoria que já tem produtos cadastrados
- Lance uma nota... digo, um pedido com uma variação que já tem pouco estoque, e veja se o estoque
  realmente diminui depois

Qualquer resultado que não faça sentido é candidato a chamado. Registre no Painel de Manutenção,
resolva, versione no Git seguindo o guia "Do chamado ao Pull Request", e mova o card para
"Incremento Entregue".

**Dica:** neste projeto o frontend é TypeScript — preste atenção em bugs de tipo (um valor que
deveria ser número chegando como texto, por exemplo). O compilador ajuda, mas não pega tudo.
c