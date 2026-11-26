import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Acervo } from './pages/Acervo';
import { Circulacao } from './pages/Circulacao';
import { Leitores } from './pages/Leitores';
import { Autores } from './pages/Autores';
import { bibliotecaService } from './services/bibliotecaService';

const initialData = {
  autores: [],
  livros: [],
  leitores: [],
  emprestimos: [],
  relatorio: {
    emprestimosAtivos: 0,
    emprestimosAtrasados: 0,
    emprestimosPorMes: [],
  },
};

export default function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [estadoInicial, setEstadoInicial] = useState('carregando');
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [dados, setDados] = useState(initialData);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [erroDados, setErroDados] = useState('');

  const carregarDados = useCallback(async () => {
    setCarregandoDados(true);
    setErroDados('');
    try {
      const [autores, livros, leitores, emprestimos, relatorio] = await Promise.all([
        bibliotecaService.getAutores(),
        bibliotecaService.getLivros(),
        bibliotecaService.getLeitores(),
        bibliotecaService.getEmprestimos(),
        bibliotecaService.getRelatorio(),
      ]);
      setDados({ autores, livros, leitores, emprestimos, relatorio });
    } catch (error) {
      if (error.status === 401) {
        setAutenticado(false);
        setUsuario(null);
      }
      setErroDados(error.message);
    } finally {
      setCarregandoDados(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    bibliotecaService.getCurrentUser()
      .then((profile) => {
        if (!active) return;
        setUsuario(profile);
        setAutenticado(true);
        setEstadoInicial('pronto');
      })
      .catch((error) => {
        if (!active) return;
        if (error.status !== 401) {
          setErroDados(error.message);
        }
        setEstadoInicial('pronto');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (autenticado) {
      carregarDados();
    }
  }, [autenticado, carregarDados]);

  const handleLogin = async (email, senha) => {
    const profile = await bibliotecaService.login(email, senha);
    setUsuario(profile);
    setAutenticado(true);
    setErroDados('');
  };

  const handleLogout = async () => {
    try {
      await bibliotecaService.logout();
      setErroDados('');
      setAutenticado(false);
      setUsuario(null);
      setDados(initialData);
      setAbaAtiva('dashboard');
    } catch (error) {
      setErroDados(error.message);
    }
  };

  if (estadoInicial === 'carregando') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Verificando sessão...
      </main>
    );
  }

  if (!autenticado) {
    return (
      <Login
        onLoginSuccess={handleLogin}
        erroApi={erroDados}
      />
    );
  }

  if (carregandoDados && dados.autores.length === 0 && dados.livros.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Carregando dados da biblioteca...
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
        usuario={usuario}
        onLogout={handleLogout}
      />

      <main className="min-h-screen p-4 sm:p-6 md:ml-64">
        <div className="mx-auto max-w-6xl space-y-6">
          {erroDados && (
            <div role="alert" className="flex items-center justify-between gap-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{erroDados}</span>
              <button
                type="button"
                onClick={carregarDados}
                className="shrink-0 font-semibold underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {abaAtiva === 'dashboard' && (
            <Dashboard
              livros={dados.livros}
              leitores={dados.leitores}
              emprestimos={dados.emprestimos}
              relatorio={dados.relatorio}
            />
          )}
          {abaAtiva === 'acervo' && (
            <Acervo
              livros={dados.livros}
              autores={dados.autores}
              onLivroCriado={carregarDados}
            />
          )}
          {abaAtiva === 'circulacao' && (
            <Circulacao
              livros={dados.livros}
              leitores={dados.leitores}
              emprestimos={dados.emprestimos}
              onDadosAlterados={carregarDados}
            />
          )}
          {abaAtiva === 'leitores' && (
            <Leitores
              leitores={dados.leitores}
              emprestimos={dados.emprestimos}
              onLeitorCriado={carregarDados}
            />
          )}
          {abaAtiva === 'autores' && (
            <Autores
              autores={dados.autores}
              onAutorCriado={carregarDados}
            />
          )}
        </div>
      </main>
    </div>
  );
}
