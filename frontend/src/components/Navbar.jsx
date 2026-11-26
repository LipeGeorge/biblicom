import { useState } from 'react';
import { BookOpen, Users, ArrowLeftRight, BarChart3, LogOut, Menu, X, UserPlus } from 'lucide-react';

export function Navbar({ abaAtiva, setAbaAtiva, usuario, onLogout }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const abas = [
    { id: 'dashboard', label: 'Relatórios & Alertas', icon: BarChart3 },
    { id: 'acervo', label: 'Acervo', icon: BookOpen },
    { id: 'circulacao', label: 'Empréstimos', icon: ArrowLeftRight },
    { id: 'leitores', label: 'Leitores', icon: Users },
    { id: 'autores', label: 'Autores', icon: UserPlus },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] md:hidden print:hidden">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <BookOpen size={20} className="text-indigo-600" />
          <span>BiblioComunitária</span>
        </div>
        <button
          type="button"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700"
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
        >
          {menuAberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {menuAberto && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/30 md:hidden"
          onClick={() => setMenuAberto(false)}
          aria-label="Fechar menu lateral"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-100 shadow-xl transition-transform duration-200 md:hidden print:hidden ${
          menuAberto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <BookOpen size={20} className="text-indigo-600" />
            <span>Menu</span>
          </div>
          <button type="button" onClick={() => setMenuAberto(false)} aria-label="Fechar menu" className="p-2">
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {abas.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setAbaAtiva(tab.id);
                  setMenuAberto(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium ${
                  abaAtiva === tab.id ? 'bg-sky-100 text-sky-700' : 'text-slate-600'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <button type="button" onClick={onLogout} className="m-3 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600">
          <LogOut size={18} /> Sair
        </button>
      </aside>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-slate-100 shadow-[2px_0_8px_rgba(15,23,42,0.05)] md:flex print:hidden">
      <div className="flex h-20 items-center gap-3 px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <BookOpen size={22} />
        </div>
        <div className="leading-tight">
          <p className="font-bold text-slate-800">BiblioComunitária</p>
          <p className="truncate text-xs text-slate-500">{usuario?.email}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {abas.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setAbaAtiva(tab.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                abaAtiva === tab.id
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3">
        <p className="truncate px-4 pb-2 text-xs text-slate-500">{usuario?.email}</p>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-200"
        >
          <LogOut size={18} /> Sair
        </button>
      </div>
      </aside>
    </>
  );
}