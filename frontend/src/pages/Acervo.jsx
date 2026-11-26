import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { bibliotecaService } from '../services/bibliotecaService';

function statusLivro(livro) {
  if (livro.exemplaresDisponiveis === 0) return 'ESGOTADO';
  if (livro.exemplaresEmprestados > 0) return 'PARCIAL';
  return 'DISPONIVEL';
}

export function Acervo({ livros, autores, onLivroCriado }) {
  const [ordenacao, setOrdenacao] = useState('titulo');
  const [busca, setBusca] = useState('');
  const [novoLivro, setNovoLivro] = useState({
    titulo: '',
    autorId: '',
    genero: '',
    quantidadeExemplares: 1,
  });
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const livrosFiltrados = useMemo(() => {
    return [...livros]
      .filter((livro) =>
        `${livro.titulo} ${livro.autor}`.toLowerCase().includes(busca.toLowerCase())
      )
      .sort((a, b) => {
        if (ordenacao === 'exemplaresDisponiveis') {
          return b.exemplaresDisponiveis - a.exemplaresDisponiveis;
        }
        return a[ordenacao].localeCompare(b[ordenacao]);
      });
  }, [livros, busca, ordenacao]);

  const handleAddLivro = async (event) => {
    event.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await bibliotecaService.criarLivro({
        ...novoLivro,
        quantidadeExemplares: Number(novoLivro.quantidadeExemplares),
      });
      setNovoLivro({ titulo: '', autorId: '', genero: '', quantidadeExemplares: 1 });
      await onLivroCriado();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Acervo</h1>
      <form
        onSubmit={handleAddLivro}
        className="grid grid-cols-1 items-end gap-3 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] md:grid-cols-5"
      >
        <div>
          <label htmlFor="book-title" className="text-xs font-medium">Título</label>
          <input
            id="book-title"
            required
            maxLength={255}
            value={novoLivro.titulo}
            onChange={(event) => setNovoLivro({ ...novoLivro, titulo: event.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="book-author" className="text-xs font-medium">Autor</label>
          <select
            id="book-author"
            required
            value={novoLivro.autorId}
            onChange={(event) => setNovoLivro({ ...novoLivro, autorId: event.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Selecione um autor</option>
            {autores.map((autor) => (
              <option key={autor.id} value={autor.id}>{autor.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="book-genre" className="text-xs font-medium">Gênero</label>
          <input
            id="book-genre"
            required
            maxLength={255}
            value={novoLivro.genero}
            onChange={(event) => setNovoLivro({ ...novoLivro, genero: event.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="book-copies" className="text-xs font-medium">Exemplares</label>
          <input
            id="book-copies"
            required
            type="number"
            min="0"
            step="1"
            value={novoLivro.quantidadeExemplares}
            onChange={(event) =>
              setNovoLivro({ ...novoLivro, quantidadeExemplares: event.target.value })
            }
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={salvando || autores.length === 0}
          className="flex items-center justify-center gap-1 rounded-lg bg-indigo-600 p-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} /> Cadastrar Livro
        </button>
        {autores.length === 0 && (
          <p className="text-sm text-amber-700 md:col-span-5">
            Cadastre um autor antes de cadastrar livros.
          </p>
        )}
        {erro && <p role="alert" className="text-sm text-red-600 md:col-span-5">{erro}</p>}
      </form>

      <div className="space-y-4 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap justify-between gap-3">
          <input
            aria-label="Buscar por título ou autor"
            placeholder="Buscar por título ou autor..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            className="w-full rounded-lg bg-slate-50 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 md:w-72"
          />
          <select
            aria-label="Ordenar livros"
            value={ordenacao}
            onChange={(event) => setOrdenacao(event.target.value)}
            className="rounded-lg bg-slate-50 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="titulo">Ordenar por Título</option>
            <option value="autor">Ordenar por Autor</option>
            <option value="exemplaresDisponiveis">Ordenar por Disponibilidade</option>
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
                    {livro.exemplaresDisponiveis} / {livro.totalExemplares}
                  </td>
                  <td className="px-4 py-3 text-center">{livro.exemplaresEmprestados}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tipo="livro" valor={statusLivro(livro)} />
                  </td>
                </tr>
              ))}
              {livrosFiltrados.length === 0 && (
                <tr><td className="px-4 py-6 text-center text-slate-500" colSpan="6">Nenhum livro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
