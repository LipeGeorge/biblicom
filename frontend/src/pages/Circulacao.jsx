import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { bibliotecaService } from '../services/bibliotecaService';

function dataLocalHoje() {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

export function Circulacao({ livros, leitores, emprestimos, onDadosAlterados }) {
  const [novoEmprestimo, setNovoEmprestimo] = useState({
    leitorId: '',
    livroId: '',
    exemplarId: '',
    dataPrevistaDevolucao: '',
  });
  const [exemplaresDisponiveis, setExemplaresDisponiveis] = useState([]);
  const [erro, setErro] = useState('');
  const [carregandoExemplares, setCarregandoExemplares] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [devolvendoId, setDevolvendoId] = useState(null);

  const handleSelecionarLivro = async (livroId) => {
    setErro('');
    setExemplaresDisponiveis([]);
    setNovoEmprestimo((current) => ({ ...current, livroId, exemplarId: '' }));
    if (!livroId) return;

    setCarregandoExemplares(true);
    try {
      const exemplares = await bibliotecaService.getExemplares(livroId);
      setExemplaresDisponiveis(exemplares.filter((exemplar) => exemplar.status === 'DISPONIVEL'));
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregandoExemplares(false);
    }
  };

  const handleRegistrarEmprestimo = async (event) => {
    event.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await bibliotecaService.criarEmprestimo({
        leitorId: Number(novoEmprestimo.leitorId),
        exemplarId: Number(novoEmprestimo.exemplarId),
        dataPrevistaDevolucao: novoEmprestimo.dataPrevistaDevolucao,
      });
      setNovoEmprestimo({
        leitorId: '',
        livroId: '',
        exemplarId: '',
        dataPrevistaDevolucao: '',
      });
      setExemplaresDisponiveis([]);
      await onDadosAlterados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const handleDevolucao = async (emprestimoId) => {
    setErro('');
    setDevolvendoId(emprestimoId);
    try {
      await bibliotecaService.registrarDevolucao(emprestimoId);
      await onDadosAlterados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setDevolvendoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Empréstimos</h1>
      <form
        onSubmit={handleRegistrarEmprestimo}
        className="grid grid-cols-1 items-end gap-3 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] md:grid-cols-5"
      >
        <div>
          <label htmlFor="loan-reader" className="text-xs font-medium">Leitor</label>
          <select
            id="loan-reader"
            required
            value={novoEmprestimo.leitorId}
            onChange={(event) =>
              setNovoEmprestimo({ ...novoEmprestimo, leitorId: event.target.value })
            }
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Selecione um leitor</option>
            {leitores.map((leitor) => (
              <option key={leitor.id} value={leitor.id}>{leitor.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="loan-book" className="text-xs font-medium">Livro</label>
          <select
            id="loan-book"
            required
            value={novoEmprestimo.livroId}
            onChange={(event) => handleSelecionarLivro(event.target.value)}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Selecione um livro</option>
            {livros.map((livro) => (
              <option
                key={livro.id}
                value={livro.id}
                disabled={livro.exemplaresDisponiveis === 0}
              >
                {livro.titulo} ({livro.exemplaresDisponiveis} disp.)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="loan-copy" className="text-xs font-medium">Exemplar</label>
          <select
            id="loan-copy"
            required
            disabled={!novoEmprestimo.livroId || carregandoExemplares}
            value={novoEmprestimo.exemplarId}
            onChange={(event) =>
              setNovoEmprestimo({ ...novoEmprestimo, exemplarId: event.target.value })
            }
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="">
              {carregandoExemplares ? 'Carregando...' : 'Selecione um exemplar'}
            </option>
            {exemplaresDisponiveis.map((exemplar) => (
              <option key={exemplar.id} value={exemplar.id}>Exemplar #{exemplar.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="loan-due-date" className="text-xs font-medium">Devolução Prevista</label>
          <input
            id="loan-due-date"
            required
            type="date"
            min={dataLocalHoje()}
            value={novoEmprestimo.dataPrevistaDevolucao}
            onChange={(event) =>
              setNovoEmprestimo({
                ...novoEmprestimo,
                dataPrevistaDevolucao: event.target.value,
              })
            }
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={salvando || leitores.length === 0 || !novoEmprestimo.exemplarId}
          className="rounded-lg bg-indigo-600 p-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {salvando ? 'Registrando...' : 'Registrar Empréstimo'}
        </button>
        {erro && <p role="alert" className="text-sm text-red-600 md:col-span-5">{erro}</p>}
      </form>

      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
        <table className="w-full min-w-205 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Leitor</th>
              <th className="px-4 py-3 font-semibold">Livro / Exemplar</th>
              <th className="px-4 py-3 font-semibold">Retirada</th>
              <th className="px-4 py-3 font-semibold">Prevista</th>
              <th className="px-4 py-3 font-semibold">Situação</th>
              <th className="px-4 py-3 font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {emprestimos.map((emprestimo) => (
              <tr key={emprestimo.id} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{emprestimo.leitorNome}</td>
                <td className="px-4 py-3 text-slate-600">
                  {emprestimo.livroTitulo} <span className="text-xs text-slate-400">#{emprestimo.exemplarId}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{emprestimo.dataEmprestimo}</td>
                <td className="px-4 py-3 text-slate-600">{emprestimo.dataPrevistaDevolucao}</td>
                <td className="px-4 py-3">
                  <StatusBadge tipo="circulacao" valor={emprestimo.situacao} />
                </td>
                <td className="px-4 py-3">
                  {emprestimo.situacao !== 'DEVOLVIDO' ? (
                    <button
                      type="button"
                      disabled={devolvendoId === emprestimo.id}
                      onClick={() => handleDevolucao(emprestimo.id)}
                      className="flex items-center gap-1 font-medium text-emerald-700 hover:underline disabled:opacity-50"
                    >
                      <CheckCircle size={15} />
                      {devolvendoId === emprestimo.id ? 'Salvando...' : 'Devolver'}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">{emprestimo.dataDevolucao}</span>
                  )}
                </td>
              </tr>
            ))}
            {emprestimos.length === 0 && (
              <tr><td className="px-4 py-6 text-center text-slate-500" colSpan="6">Nenhum empréstimo registrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
