import { useState } from 'react';
import { dadosIniciais } from './services/bibliotecaService';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Dashboard } from './pages/Dashboard';
import { Acervo } from './pages/Acervo';
import { Circulacao } from './pages/Circulacao';
import { Leitores } from './pages/Leitores';
import { Autores } from './pages/Autores';

export default function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [telaAcesso, setTelaAcesso] = useState('login');
  const [bibliotecario, setBibliotecario] = useState({
    nome: 'Bibliotecário',
    email: 'bibliotecario@ufc.br',
    senha: '123456',
  });
  const [abaAtiva, setAbaAtiva] = useState('dashboard');

  const [livros, setLivros] = useState(dadosIniciais.livros);
  const [leitores, setLeitores] = useState(dadosIniciais.leitores);
  const [emprestimos, setEmprestimos] = useState(dadosIniciais.emprestimos);
  const [autores, setAutores] = useState(dadosIniciais.autores);

  if (!autenticado) {
    if (telaAcesso === 'cadastro') {
      return (
        <Cadastro
          onCadastroSuccess={(dados) => {
            setBibliotecario(dados);
            setTelaAcesso('login');
          }}
          onVoltarLogin={() => setTelaAcesso('login')}
        />
      );
    }

    return (
      <Login
        bibliotecario={bibliotecario}
        onLoginSuccess={() => setAutenticado(true)}
        onAbrirCadastro={() => setTelaAcesso('cadastro')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        onLogout={() => setAutenticado(false)}
      />

      <main className="min-h-screen p-4 sm:p-6 md:ml-64">
        <div className="mx-auto max-w-6xl space-y-6">
        {abaAtiva === 'dashboard' && (
          <Dashboard livros={livros} leitores={leitores} emprestimos={emprestimos} />
        )}
        {abaAtiva === 'acervo' && (
          <Acervo livros={livros} setLivros={setLivros} autores={autores} />
        )}
        {abaAtiva === 'circulacao' && (
          <Circulacao
            livros={livros}
            setLivros={setLivros}
            leitores={leitores}
            emprestimos={emprestimos}
            setEmprestimos={setEmprestimos}
          />
        )}
        {abaAtiva === 'leitores' && (
          <Leitores
            leitores={leitores}
            setLeitores={setLeitores}
            emprestimos={emprestimos}
            livros={livros}
          />
        )}
        {abaAtiva === 'autores' && (
          <Autores autores={autores} setAutores={setAutores} />
        )}
        </div>
      </main>
    </div>
  );
}