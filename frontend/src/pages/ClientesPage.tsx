import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Cliente } from '../types';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState({ nome: '', email: '', cpf: '', telefone: '' });

  async function carregar() {
    setClientes(await api.listarClientes());
  }
  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.criarCliente(form);
    setForm({ nome: '', email: '', cpf: '', telefone: '' });
    carregar();
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Clientes</h1>
        <p>Cadastro de clientes da loja.</p>
      </div>

      <div className="card">
        <form className="grid-form" onSubmit={handleSubmit}>
          <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
          <input type="email" placeholder="E-mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="CPF" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} required />
          <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
          <button type="submit" className="btn-primary">Adicionar</button>
        </form>
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Nome</th><th>E-mail</th><th>CPF</th><th>Telefone</th></tr></thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}>
                <td>{c.nome}</td><td>{c.email}</td><td>{c.cpf}</td><td>{c.telefone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
