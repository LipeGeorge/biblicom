export class Livro {
  constructor(id, titulo, autor, genero, totalExemplares, disponiveis = totalExemplares) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.genero = genero;
    this.totalExemplares = Number(totalExemplares);
    this.disponiveis = Number(disponiveis);
  }

  get emprestados() {
    return this.totalExemplares - this.disponiveis;
  }

  get status() {
    if (this.disponiveis === 0) return 'ESGOTADO';
    if (this.emprestados > 0) return 'PARCIAL';
    return 'DISPONIVEL';
  }

  podeEmprestar() {
    return this.disponiveis > 0;
  }
}