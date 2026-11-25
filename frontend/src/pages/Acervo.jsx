import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Livro } from '../models/Livro';
import { StatusBadge } from '../components/StatusBadge';

export function Acervo({ livros, setLivros, autores }) {
  const [ordenacao, setOrdenacao] = useState('titulo');
  const [busca, setBusca] = useState('');
  const [novoLivro, setNovoLivro] = useState({ titulo: '', autor: '', genero: '', total: 1 });

  const livrosFiltrados = useMemo(() => {
    return [...livros]
      .filter(
        (l) =>
          l.titulo.toLowerCase().includes(busca.toLowerCase()) ||
          l.autor.toLowerCase().includes(busca.toLowerCase())
      )
      .sort((a, b) => {
        if (ordenacao === 'disponiveis') return b.disponiveis - a.disponiveis;
        return a[ordenacao].localeCompare(b[ordenacao]);
      });
  }, [livros, busca, ordenacao]);

  const handleAddLivro = (e) => {
    e.preventDefault();
    if (!novoLivro.autor) {
      alert('Selecione um autor cadastrado.');
      return;
    }
    const criado = new Livro(
      Date.now(),
      novoLivro.titulo,
      novoLivro.autor,
      novoLivro.genero,
      novoLivro.total
    );
    setLivros([...livros, criado]);
    setNovoLivro({ titulo: '', autor: '', genero: '', total: 1 });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Acervo</h1>
      <form
        onSubmit={handleAddLivro}
        className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.06)] grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
      >
        <div>
          <label className="text-xs font-medium">Título</label>
          <input
            required
            placeholder="Digite o título do livro"
            value={novoLivro.titulo}
            onChange={(e) => setNovoLivro({ ...novoLivro, titulo: e.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium">Autor</label>
          <select
            required
            value={novoLivro.autor}
            onChange={(e) => setNovoLivro({ ...novoLivro, autor: e.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Selecione um autor</option>
            {(autores || []).map((autor) => (
              <option key={autor.id} value={autor.nome}>{autor.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium">Gênero</label>
          <input
            required
            placeholder="Digite o gênero"
            value={novoLivro.genero}
            onChange={(e) => setNovoLivro({ ...novoLivro, genero: e.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium">Exemplares</label>
          <input
            required
            type="number"
            placeholder="Digite a quantidade"
            min="1"
            value={novoLivro.total}
            onChange={(e) => setNovoLivro({ ...novoLivro, total: e.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-indigo-700"
        >
          <Plus size={16} /> Cadastrar Livro
        </button>
      </form>

      <div className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.06)] space-y-4">
        <div className="flex flex-wrap justify-between gap-3">
          <input
            placeholder="Buscar por título ou autor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="rounded-lg bg-slate-50 px-3 py-1.5 text-sm w-full md:w-72 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            className="rounded-lg bg-slate-50 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="titulo">Ordenar por Título</option>
            <option value="autor">Ordenar por Autor</option>
            <option value="disponiveis">Ordenar por Disponibilidade</option>
          </select>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full min-w-190 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Título</th>
              <th className="px-4 py-3 font-semibold">Autor</th>
              <th className="px-4 py-3 font-semibold">Gênero</th>
              <th className="px-4 py-3 text-center font-semibold">Disponíveis / Total</th>
              <th className="px-4 py-3 text-center font-semibold">Emprestados</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {livrosFiltrados.map((livro) => (
              <tr key={livro.id} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{livro.titulo}</td>
                <td className="px-4 py-3 text-slate-600">{livro.autor}</td>
                <td className="px-4 py-3 text-slate-600">{livro.genero}</td>
                <td className="px-4 py-3 text-center">
                  {livro.disponiveis} / {livro.totalExemplares}
                </td>
                <td className="px-4 py-3 text-center">{livro.emprestados}</td>
                <td className="px-4 py-3">
                  <StatusBadge tipo="livro" valor={livro.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}