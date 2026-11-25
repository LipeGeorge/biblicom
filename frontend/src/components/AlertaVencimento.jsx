import { AlertTriangle } from 'lucide-react';

export function AlertaVencimento({ alertas, livros, leitores }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-[0_2px_8px_rgba(15,23,42,0.06)] space-y-3">
      <h3 className="font-semibold flex items-center gap-2 text-amber-700">
        <AlertTriangle size={18} /> Avisos de Vencimento e Atrasos
      </h3>
      {alertas.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum empréstimo próximo do vencimento ou atrasado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-170 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 font-semibold">Leitor</th>
                <th className="px-3 py-2 font-semibold">Livro</th>
                <th className="px-3 py-2 font-semibold">Contato</th>
                <th className="px-3 py-2 font-semibold">Prazo</th>
                <th className="px-3 py-2 font-semibold">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alertas.map((emp) => {
                const leitor = leitores.find((l) => l.id === emp.leitorId);
                const livro = livros.find((l) => l.id === emp.livroId);
                const isAtrasado = emp.statusCirculacao === 'ATRASADO';
                return (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-800">{leitor?.nome}</td>
                    <td className="px-3 py-3 text-slate-600">{livro?.titulo}</td>
                    <td className="px-3 py-3 text-slate-600">{leitor?.contato}</td>
                    <td className="px-3 py-3 text-slate-600">{emp.dataPrevista}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isAtrasado ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
                        {isAtrasado ? `Atrasado há ${Math.abs(emp.diasRestantes)} dia(s)` : `Vence em ${emp.diasRestantes} dia(s)`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}