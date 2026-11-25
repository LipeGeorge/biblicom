import { Livro } from '../models/Livro';
import { Leitor } from '../models/Leitor';
import { Emprestimo } from '../models/Emprestimo';

export const dadosIniciais = {
  autores: [
    { id: 1, nome: 'Machado de Assis', nacionalidade: 'Brasileira' },
    { id: 2, nome: 'Jorge Amado', nacionalidade: 'Brasileira' },
    { id: 3, nome: 'Antoine de Saint-Exupéry', nacionalidade: 'Francesa' },
  ],
  livros: [
    new Livro(1, 'Dom Casmurro', 'Machado de Assis', 'Romance', 5, 3),
    new Livro(2, 'Capitães da Areia', 'Jorge Amado', 'Ficção', 2, 0),
    new Livro(3, 'O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'Infantil', 4, 4),
  ],
  leitores: [
    new Leitor(1, 'Maria Silva', '(88) 99911-2233', '123.456.789-00'),
    new Leitor(2, 'João Santos', '(88) 98822-3344', '987.654.321-11'),
  ],
  emprestimos: [
    new Emprestimo(1, 1, 1, '2026-11-10', '2026-11-20', null), // Atrasado
    new Emprestimo(2, 2, 2, '2026-11-20', '2026-11-27', null), // Próximo do vencimento
    new Emprestimo(3, 1, 2, '2026-11-15', '2026-11-25', null), // No prazo
  ],
};

export function validarNovoEmprestimo(livro, leitorId, emprestimos) {
  // RN01: Disponibilidade
  if (!livro || !livro.podeEmprestar()) {
    return { valido: false, erro: 'Regra de Negócio (RN01): Livro sem exemplares disponíveis.' };
  }

  // RN02: Bloqueio por Atraso
  const atrasosLeitor = emprestimos.filter(
    (emp) => emp.leitorId === leitorId && emp.statusCirculacao === 'ATRASADO'
  );
  if (atrasosLeitor.length > 0) {
    return { valido: false, erro: 'Regra de Negócio (RN02): Leitor possui empréstimos em atraso.' };
  }

  // RN03: Limite de 3 exemplares simultâneos
  const ativosLeitor = emprestimos.filter(
    (emp) => emp.leitorId === leitorId && emp.isAtivo
  );
  if (ativosLeitor.length >= 3) {
    return { valido: false, erro: 'Regra de Negócio (RN03): Limite máximo de 3 empréstimos ativos atingido.' };
  }

  return { valido: true, erro: null };
}
