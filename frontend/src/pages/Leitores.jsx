import { useRef, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { bibliotecaService } from '../services/bibliotecaService';

export function Leitores({ leitores, emprestimos, onLeitorCriado }) {
  const [novoLeitor, setNovoLeitor] = useState({ nome: '', email: '', cpf: '' });
  const [leitorHistoricoId, setLeitorHistoricoId] = useState(null);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
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
    setNovoLeitor((current) => ({ ...current, cpf: cpfFormatado }));
  };

  const handleAddLeitor = async (event) => {
    event.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await bibliotecaService.criarLeitor({
        ...novoLeitor,
        nome: novoLeitor.nome.trim(),
        email: novoLeitor.email.trim(),
        cpf: novoLeitor.cpf.replace(/\D/g, ''),
      });
      setNovoLeitor({ nome: '', email: '', cpf: '' });
      await onLeitorCriado();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const historico = emprestimos.filter((emprestimo) => emprestimo.leitorId === leitorHistoricoId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Leitores</h1>
      <div className="grid grid-cols-1 gap-6">
        <form onSubmit={handleAddLeitor} className="space-y-3 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
          <h2 className="font-semibold">Novo Leitor</h2>
          <div>
            <label htmlFor="reader-name" className="sr-only">Nome completo</label>
            <input
              id="reader-name"
              required
              maxLength={255}
              placeholder="Nome completo"
              value={novoLeitor.nome}
              onChange={(event) => setNovoLeitor({ ...novoLeitor, nome: event.target.value })}
              className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="reader-email" className="sr-only">E-mail</label>
            <input
              id="reader-email"
              required
              type="email"
              maxLength={254}
              placeholder="E-mail"
              value={novoLeitor.email}
              onChange={(event) => setNovoLeitor({ ...novoLeitor, email: event.target.value })}
              className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="reader-cpf" className="sr-only">CPF</label>
            <input
              id="reader-cpf"
              required
              placeholder="CPF"
              inputMode="numeric"
              maxLength={14}
              value={novoLeitor.cpf}
              onChange={(event) => handleCpf(event.target.value)}
              className="w-full rounded-lg bg-slate-50 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {erro && <p role="alert" className="text-sm text-red-600">{erro}</p>}
          <button
            type="submit"
            disabled={salvando}
            className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Cadastrar Leitor'}
          </button>
        </form>

        <div className="rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
          <h2 className="mb-3 font-semibold">Leitores Cadastrados</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Nome</th>
                  <th className="px-3 py-2 font-semibold">E-mail</th>
                  <th className="px-3 py-2 font-semibold">CPF</th>
                  <th className="px-3 py-2 text-right font-semibold">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leitores.map((leitor) => (
                  <tr key={leitor.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-800">{leitor.nome}</td>
                    <td className="px-3 py-3 text-slate-600">{leitor.email}</td>
                    <td className="px-3 py-3 text-slate-600">{leitor.cpf}</td>
                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => mostrarHistorico(leitor.id)}
                        className="rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                      >
                        Ver Histórico
                      </button>
                    </td>
                  </tr>
                ))}
                {leitores.length === 0 && (
                  <tr><td className="px-3 py-6 text-center text-slate-500" colSpan="4">Nenhum leitor cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <section ref={historicoRef} className="scroll-mt-20 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
        <h2 className="mb-3 font-semibold">Histórico Individual de Empréstimos</h2>
        {leitorHistoricoId === null ? (
          <p className="text-sm text-slate-500">Selecione um leitor para consultar seu histórico.</p>
        ) : historico.length === 0 ? (
          <p className="text-sm text-slate-500">Este leitor ainda não possui empréstimos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Livro</th>
                  <th className="px-3 py-2 font-semibold">Empréstimo</th>
                  <th className="px-3 py-2 font-semibold">Prazo</th>
                  <th className="px-3 py-2 font-semibold">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historico.map((emprestimo) => (
                  <tr key={emprestimo.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-800">{emprestimo.livroTitulo}</td>
                    <td className="px-3 py-3 text-slate-600">{emprestimo.dataEmprestimo}</td>
                    <td className="px-3 py-3 text-slate-600">{emprestimo.dataPrevistaDevolucao}</td>
                    <td className="px-3 py-3">
                      <StatusBadge tipo="circulacao" valor={emprestimo.situacao} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
