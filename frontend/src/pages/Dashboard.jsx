import { useMemo, useState } from 'react';
import { FileDown } from 'lucide-react';
import { AlertaVencimento } from '../components/AlertaVencimento';

function dataMesAtual() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
}

function diasAte(data) {
  const [ano, mes, dia] = data.split('-').map(Number);
  const vencimento = Date.UTC(ano, mes - 1, dia);
  const hoje = new Date();
  const hojeUTC = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.round((vencimento - hojeUTC) / 86_400_000);
}

export function Dashboard({ livros, leitores, emprestimos, relatorio }) {
  const [mesAnoFiltro, setMesAnoFiltro] = useState('');
  const [opcoesExportacao, setOpcoesExportacao] = useState({
    painel: false,
    ativos: true,
    atrasados: true,
    mesAtual: true,
    historico: true,
    alertas: true,
  });

  const alterarOpcao = (opcao) => {
    setOpcoesExportacao((opcoes) => ({ ...opcoes, [opcao]: !opcoes[opcao] }));
  };

  const exportarPdf = () => {
    const algumConteudoSelecionado = [
      'ativos',
      'atrasados',
      'mesAtual',
      'historico',
      'alertas',
    ].some((opcao) => opcoesExportacao[opcao]);

    if (!algumConteudoSelecionado) {
      alert('Selecione pelo menos uma informação para exportar.');
      return;
    }
    window.print();
  };

  const metricas = useMemo(() => {
    const emprestimosPorMes = relatorio.emprestimosPorMes || [];
    const porMes = emprestimosPorMes.reduce((acc, registro) => {
      const mes = `${registro.ano}-${String(registro.mes).padStart(2, '0')}`;
      acc[mes] = registro.quantidade;
      return acc;
    }, {});
    const alertas = emprestimos
      .filter((emprestimo) => emprestimo.situacao !== 'DEVOLVIDO')
      .map((emprestimo) => ({ ...emprestimo, diasRestantes: diasAte(emprestimo.dataPrevistaDevolucao) }))
      .filter((emprestimo) => emprestimo.diasRestantes <= 2);
    const mesAtual = dataMesAtual();

    return {
      ativos: relatorio.emprestimosAtivos || 0,
      atrasados: relatorio.emprestimosAtrasados || 0,
      alertas,
      porMes,
      mesAtual,
      mesAtualQtd: porMes[mesAtual] || 0,
    };
  }, [emprestimos, relatorio]);

  const meses = Object.keys(metricas.porMes).sort().reverse();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Relatórios &amp; Alertas</h1>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-600">Relatórios de Circulação</h2>
        <div className="print:hidden">
          <button
            type="button"
            onClick={() => setOpcoesExportacao((opcoes) => ({ ...opcoes, painel: !opcoes.painel }))}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700"
          >
            <FileDown size={16} /> Selecionar informações para impressão
          </button>
        </div>
      </div>

      {opcoesExportacao.painel && (
        <div className="flex flex-wrap gap-x-5 gap-y-3 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] print:hidden">
          {[
            ['ativos', 'Empréstimos ativos'],
            ['atrasados', 'Empréstimos atrasados'],
            ['mesAtual', 'Empréstimos do mês atual'],
            ['historico', 'Histórico mensal'],
            ['alertas', 'Avisos de vencimento'],
          ].map(([chave, texto]) => (
            <label key={chave} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={opcoesExportacao[chave]}
                onChange={() => alterarOpcao(chave)}
                className="h-4 w-4 accent-indigo-600"
              />
              {texto}
            </label>
          ))}
          <button
            type="button"
            onClick={exportarPdf}
            className="ml-auto flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <FileDown size={16} /> Imprimir / salvar como PDF
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className={`rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${opcoesExportacao.ativos ? '' : 'print:hidden'}`}>
          <p className="text-sm text-slate-500">Empréstimos Ativos</p>
          <p className="text-3xl font-bold text-indigo-600">{metricas.ativos}</p>
        </div>
        <div className={`rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${opcoesExportacao.atrasados ? '' : 'print:hidden'}`}>
          <p className="text-sm text-slate-500">Empréstimos Atrasados</p>
          <p className="text-3xl font-bold text-red-600">{metricas.atrasados}</p>
        </div>
        <div className={`rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${opcoesExportacao.mesAtual ? '' : 'print:hidden'}`}>
          <p className="text-sm text-slate-500">Empréstimos realizados no mês atual</p>
          <p className="text-3xl font-bold text-emerald-600">{metricas.mesAtualQtd}</p>
          <p className="mt-1 text-xs text-slate-400">{metricas.mesAtual}</p>
        </div>
      </div>

      <section className={`rounded-xl bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] ${opcoesExportacao.historico ? '' : 'print:hidden'}`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Histórico Mensal de Empréstimos</h2>
          <div>
            <label htmlFor="filtro-mes" className="mr-2 text-sm font-medium text-slate-600">
              Filtrar por mês:
            </label>
            <select
              id="filtro-mes"
              value={mesAnoFiltro}
              onChange={(event) => setMesAnoFiltro(event.target.value)}
              className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos os meses</option>
              {meses.map((mes) => <option key={mes} value={mes}>{mes}</option>)}
            </select>
          </div>
        </div>
        {Object.keys(metricas.porMes).some((mes) => !mesAnoFiltro || mes === mesAnoFiltro) ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Mês / Ano</th>
                  <th className="px-4 py-3 text-right font-semibold">Empréstimos realizados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meses
                  .filter((mes) => !mesAnoFiltro || mes === mesAnoFiltro)
                  .map((mes) => (
                    <tr key={mes} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{mes}</td>
                      <td className="px-4 py-3 text-right font-semibold text-indigo-600">{metricas.porMes[mes]}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Nenhum empréstimo encontrado para o período selecionado.</p>
        )}
      </section>

      <div className={opcoesExportacao.alertas ? '' : 'print:hidden'}>
        <AlertaVencimento alertas={metricas.alertas} leitores={leitores} livros={livros} />
      </div>
    </div>
  );
}
