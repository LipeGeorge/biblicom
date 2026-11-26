import { useState } from 'react';
import { Plus, UserRound } from 'lucide-react';
import { bibliotecaService } from '../services/bibliotecaService';

export function Autores({ autores, onAutorCriado }) {
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await bibliotecaService.criarAutor(nome.trim());
      setNome('');
      await onAutorCriado();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Autores</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] md:grid-cols-[1fr_auto] md:items-end"
      >
        <div>
          <label className="text-xs font-medium">Nome do autor</label>
          <input
            id="author-name"
            required
            maxLength={255}
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            className="mt-1 w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={salvando}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 p-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={16} /> {salvando ? 'Salvando...' : 'Cadastrar Autor'}
        </button>
        {erro && <p role="alert" className="text-sm text-red-600 md:col-span-2">{erro}</p>}
      </form>

      <div className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
        <h2 className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <UserRound size={18} /> Autores Cadastrados
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Nome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {autores.map((autor) => (
                <tr key={autor.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{autor.nome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
