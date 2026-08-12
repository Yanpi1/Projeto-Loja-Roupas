import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Categoria } from '../types';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState('');

  async function carregar() {
    setCategorias(await api.listarCategorias());
  }
  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    await api.criarCategoria(nome.trim());
    setNome('');
    carregar();
  }

  async function handleExcluir(id: number, nomeCategoria: string) {
    if (!confirm(`Excluir a categoria "${nomeCategoria}"?`)) return;
    await api.excluirCategoria(id);
    carregar();
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Categorias</h1>
        <p>Organize o catálogo por tipo de peça.</p>
      </div>

      <div className="card">
        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            placeholder="Nome da categoria (ex: Casacos)"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
          <button type="submit" className="btn-primary">Adicionar</button>
        </form>
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Nome</th><th></th></tr></thead>
          <tbody>
            {categorias.map(c => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td className="col-actions">
                  <button className="link-danger" onClick={() => handleExcluir(c.id, c.nome)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
