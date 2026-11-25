import { useRef, useState } from 'react';
import { Leitor } from '../models/Leitor';
import { StatusBadge } from '../components/StatusBadge';

export function Leitores({ leitores, setLeitores, emprestimos, livros }) {
  const [novoLeitor, setNovoLeitor] = useState({ nome: '', contato: '', documento: '' });
  const [leitorHistoricoId, setLeitorHistoricoId] = useState(null);
  const historicoRef = useRef(null);

  const mostrarHistorico = (leitorId) => {
    setLeitorHistoricoId(leitorId);
    window.requestAnimationFrame(() => {
      historicoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleCpf = (valor) => {
    const digitos = valor.replace(/\D/g, '').slice(0, 11);
    const cpfFormatado = digitos
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setNovoLeitor({ ...novoLeitor, documento: cpfFormatado });
  };

  const handleAddLeitor = (e) => {
    e.preventDefault();
    const cpf = novoLeitor.documento.replace(/\D/g, '');
    if (cpf.length !== 11) {
      alert('Informe um CPF válido com 11 dígitos.');
      return;
    }
    const criado = new Leitor(
      Date.now(),
      novoLeitor.nome,
      novoLeitor.contato,
      novoLeitor.documento
    );
    setLeitores([...leitores, criado]);
    setNovoLeitor({ nome: '', contato: '', documento: '' });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Leitores</h1>
      <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <form onSubmit={handleAddLeitor} className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.06)] space-y-3">
          <h3 className="font-semibold">Novo Leitor</h3>
          <input
            required
            placeholder="Digite o nome completo"
            value={novoLeitor.nome}
            onChange={(e) => setNovoLeitor({ ...novoLeitor, nome: e.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            required
            placeholder="Digite o telefone ou e-mail"
            value={novoLeitor.contato}
            onChange={(e) => setNovoLeitor({ ...novoLeitor, contato: e.target.value })}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            required
            placeholder="Digite o CPF"
            inputMode="numeric"
            maxLength={14}
            value={novoLeitor.documento}
            onChange={(e) => handleCpf(e.target.value)}
            className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Cadastrar Leitor
          </button>
        </form>

        <div className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
          <h3 className="font-semibold mb-3">Leitores Cadastrados</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Nome</th>
                  <th className="px-3 py-2 font-semibold">Contato</th>
                  <th className="px-3 py-2 font-semibold">Documento</th>
                  <th className="px-3 py-2 text-right font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leitores.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-800">{l.nome}</td>
                    <td className="px-3 py-3 text-slate-600">{l.contato}</td>
                    <td className="px-3 py-3 text-slate-600">{l.documento}</td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => mostrarHistorico(l.id)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                      >
                        Ver Histórico
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div ref={historicoRef} className="scroll-mt-20 bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
        <h3 className="font-semibold mb-3">Histórico Individual de Empréstimos</h3>
        {!leitorHistoricoId ? (
          <p className="text-sm text-slate-500">Selecione um leitor ao lado para inspecionar seu histórico.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Livro</th>
                  <th className="px-3 py-2 font-semibold">Data do empréstimo</th>
                  <th className="px-3 py-2 font-semibold">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emprestimos
                  .filter((e) => e.leitorId === leitorHistoricoId)
                  .map((emp) => {
                    const livro = livros.find((l) => l.id === emp.livroId);
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="px-3 py-3 font-medium text-slate-800">{livro?.titulo}</td>
                        <td className="px-3 py-3 text-slate-600">{emp.dataEmprestimo}</td>
                        <td className="px-3 py-3">
                          <StatusBadge tipo="circulacao" valor={emp.statusCirculacao} />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}