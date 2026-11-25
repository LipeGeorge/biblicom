export class Emprestimo {
  constructor(id, leitorId, livroId, dataEmprestimo, dataPrevista, dataDevolucao = null) {
    this.id = id;
    this.leitorId = leitorId;
    this.livroId = livroId;
    this.dataEmprestimo = dataEmprestimo; // Formato YYYY-MM-DD
    this.dataPrevista = dataPrevista;     // Formato YYYY-MM-DD
    this.dataDevolucao = dataDevolucao;
  }

  get isAtivo() {
    return this.dataDevolucao === null;
  }

  get diasRestantes() {
    if (!this.isAtivo) return null;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const prevista = new Date(this.dataPrevista + 'T00:00:00');
    const diffTime = prevista - hoje;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get statusCirculacao() {
    if (!this.isAtivo) return 'DEVOLVIDO';
    const dias = this.diasRestantes;
    if (dias < 0) return 'ATRASADO';
    if (dias <= 2) return 'PROXIMO_VENCIMENTO';
    return 'NO_PRAZO';
  }
}