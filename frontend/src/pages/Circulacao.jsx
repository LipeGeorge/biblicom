import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Livro } from '../models/Livro';
import { Emprestimo } from '../models/Emprestimo';
import { validarNovoEmprestimo } from '../services/bibliotecaService';
import { StatusBadge } from '../components/StatusBadge';

export function Circulacao({ livros, setLivros, leitores, emprestimos, setEmprestimos }) {
  const [novoEmp, setNovoEmp] = useState({ leitorId: '', livroId: '', dataPrevista: '' });

  const handleRegistrarEmprestimo = (e) => {
    e.preventDefault();
    const livro = livros.find((l) => l.id === Number(novoEmp.livroId));
    const leitorId = Number(novoEmp.leitorId);

    const validacao = validarNovoEmprestimo(livro, leitorId, emprestimos);
    if (!validacao.valido) {
      alert(validacao.erro);
      return;
    }

    const hoje = new Date().toISOString().split('T')[0];
    const registro = new Emprestimo(Date.now(), leitorId, livro.id, hoje, novoEmp.dataPrevista);

    setEmprestimos([registro, ...emprestimos]);
    setLivros(
      livros.map((l) =>
        l.id === livro.id
          ? new Livro(l.id, l.titulo, l.autor, l.genero, l.totalExemplares, l.disponiveis - 1)
          : l
      )
    );
    setNovoEmp({ leitorId: '', livroId: '', dataPrevista: '' });
  };

  const handleDevolucao = (empId) => {
    const emp = emprestimos.find((e) => e.id === empId);
    if (!emp || !emp.isAtivo) return;

    const hoje = new Date().toISOString().split('T')[0];
    setEmprestimos(
      emprestimos.map((e) =>
        e.id === empId
          ? new Emprestimo(e.id, e.leitorId, e.livroId, e.dataEmprestimo, e.dataPrevista, hoje)
          : e
      )
    );

    setLivros(
      livros.map((l) =>
        l.id === emp.livroId
          ? new Livro(l.id, l.titulo, l.autor, l.genero, l.totalExemplares, l.disponiveis + 1)
          : l
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Empréstimos</h1>
      <form
        onSubmit={handleRegistrarEmprestimo}
        className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.06)] grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
      >
        <div>
          <label className="text-xs font-medium">Leitor</label>
          <select
            required
            value={novoEmp.leitorId}
            onChange={(e) => setNovoEmp({ ...novoEmp, leitorId: e.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Selecione um leitor</option>
            {leitores.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium">Livro</label>
          <select
            required
            value={novoEmp.livroId}
            onChange={(e) => setNovoEmp({ ...novoEmp, livroId: e.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Selecione um livro</option>
            {livros.map((l) => (
              <option key={l.id} value={l.id} disabled={!l.podeEmprestar()}>
                {l.titulo} ({l.disponiveis} disp.)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium">Devolução Prevista</label>
          <input
            required
            type="date"
            aria-label="Selecione a data da devolução prevista"
            value={novoEmp.dataPrevista}
            onChange={(e) => setNovoEmp({ ...novoEmp, dataPrevista: e.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Registrar Empréstimo
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
        <table className="w-full min-w-205 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Leitor</th>
              <th className="px-4 py-3 font-semibold">Livro</th>
              <th className="px-4 py-3 font-semibold">Retirada</th>
              <th className="px-4 py-3 font-semibold">Prevista</th>
              <th className="px-4 py-3 font-semibold">Situação</th>
              <th className="px-4 py-3 font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {emprestimos.map((emp) => {
              const leitor = leitores.find((l) => l.id === emp.leitorId);
              const livro = livros.find((l) => l.id === emp.livroId);
              return (
                <tr key={emp.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{leitor?.nome}</td>
                  <td className="px-4 py-3 text-slate-600">{livro?.titulo}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.dataEmprestimo}</td>
                  <td className="px-4 py-3 text-slate-600">{emp.dataPrevista}</td>
                  <td className="px-4 py-3">
                    <StatusBadge tipo="circulacao" valor={emp.statusCirculacao} />
                  </td>
                  <td>
                    {emp.isAtivo ? (
                      <button
                        onClick={() => handleDevolucao(emp.id)}
                        className="flex items-center gap-1 text-emerald-700 hover:underline font-medium"
                      >
                        <CheckCircle size={15} /> Devolver
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">Em {emp.dataDevolucao}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}