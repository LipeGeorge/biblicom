export function StatusBadge({ tipo, valor }) {
  if (tipo === 'livro') {
    const estilos = {
      ESGOTADO: 'bg-red-100 text-red-700',
      PARCIAL: 'bg-amber-100 text-amber-800',
      DISPONIVEL: 'bg-emerald-100 text-emerald-700',
    };
    const rotulos = {
      ESGOTADO: 'Sem exemplares',
      PARCIAL: 'Emprestado (Parcial)',
      DISPONIVEL: 'Disponível',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estilos[valor]}`}>
        {rotulos[valor]}
      </span>
    );
  }

  const estilosCirculacao = {
    DEVOLVIDO: 'bg-slate-100 text-slate-600',
    ATRASADO: 'bg-red-100 text-red-700',
    PROXIMO_VENCIMENTO: 'bg-amber-100 text-amber-800',
    NO_PRAZO: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estilosCirculacao[valor]}`}>
      {valor.replace('_', ' ')}
    </span>
  );
}