import { useState } from 'react';
import CategoriasPage from './pages/CategoriasPage';
import ProdutosPage from './pages/ProdutosPage';
import ClientesPage from './pages/ClientesPage';
import CuponsPage from './pages/CuponsPage';
import PedidosPage from './pages/PedidosPage';

type Aba = 'produtos' | 'categorias' | 'clientes' | 'cupons' | 'pedidos';

const NAV_ITEMS: { id: Aba; label: string; icon: string }[] = [
  { id: 'pedidos', label: 'Pedidos', icon: '🧾' },
  { id: 'produtos', label: 'Produtos', icon: '👗' },
  { id: 'categorias', label: 'Categorias', icon: '🗂️' },
  { id: 'clientes', label: 'Clientes', icon: '👤' },
  { id: 'cupons', label: 'Cupons', icon: '🏷️' },
];

export default function App() {
  const [aba, setAba] = useState<Aba>('pedidos');

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">A</span>
          <div>
            <div className="brand-name">Atelier</div>
            <div className="brand-sub">Gestão da loja</div>
          </div>
        </div>

        <nav className="side-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={'side-link' + (aba === item.id ? ' active' : '')}
              onClick={() => setAba(item.id)}
            >
              <span className="side-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">UC9 · Manutenção de sistemas<br/>Senac DF</div>
      </aside>

      <div className="content">
        {aba === 'pedidos' && <PedidosPage />}
        {aba === 'produtos' && <ProdutosPage />}
        {aba === 'categorias' && <CategoriasPage />}
        {aba === 'clientes' && <ClientesPage />}
        {aba === 'cupons' && <CuponsPage />}
      </div>
    </div>
  );
}
