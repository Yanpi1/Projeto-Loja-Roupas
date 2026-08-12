import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Cupom } from '../types';

export default function CuponsPage() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [form, setForm] = useState({ codigo: '', percentualDesconto: '', validade: '', ativo: true });

  async function carregar() {
    setCupons(await api.listarCupons());
  }
  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await api.criarCupom({
      codigo: form.codigo.toUpperCase(),
      percentualDesconto: Number(form.percentualDesconto),
      validade: form.validade,
      ativo: form.ativo,
    });
    setForm({ codigo: '', percentualDesconto: '', validade: '', ativo: true });
    carregar();
  }

  function statusCupom(c: Cupom): { label: string; className: string } {
    const hoje = new Date().toISOString().slice(0, 10);
    if (!c.ativo) return { label: 'Inativo', className: 'tag-muted' };
    if (c.validade < hoje) return { label: 'Expirado', className: 'tag-danger' };
    return { label: 'Válido', className: 'tag-success' };
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>Cupons</h1>
        <p>Códigos promocionais aplicáveis nos pedidos.</p>
      </div>

      <div className="card">
        <form className="grid-form" onSubmit={handleSubmit}>
          <input placeholder="Código (ex: VERAO20)" value={form.codigo}
            onChange={e => setForm({ ...form, codigo: e.target.value })} required />
          <input type="number" step="0.1" placeholder="Desconto (%)" value={form.percentualDesconto}
            onChange={e => setForm({ ...form, percentualDesconto: e.target.value })} required />
          <input type="date" value={form.validade}
            onChange={e => setForm({ ...form, validade: e.target.value })} required />
          <label className="checkbox-field">
            <input type="checkbox" checked={form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} />
            Ativo
          </label>
          <button type="submit" className="btn-primary">Adicionar</button>
        </form>
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr><th>Código</th><th>Desconto</th><th>Validade</th><th>Status</th></tr></thead>
          <tbody>
            {cupons.map(c => {
              const status = statusCupom(c);
              return (
                <tr key={c.id}>
                  <td className="mono-cell">{c.codigo}</td>
                  <td>{c.percentualDesconto}%</td>
                  <td>{c.validade}</td>
                  <td><span className={'tag ' + status.className}>{status.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
