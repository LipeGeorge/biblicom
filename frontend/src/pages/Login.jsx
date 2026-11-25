import { useState } from 'react';
import { AlertCircle, BookOpen, Eye, EyeOff } from 'lucide-react';

export function Login({ bibliotecario, onLoginSuccess, onAbrirCadastro }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      email.trim().toLowerCase() !== bibliotecario.email.toLowerCase() ||
      senha !== bibliotecario.senha
    ) {
      setErro('E-mail ou senha inválidos.');
      return;
    }
    setErro('');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-[0_2px_10px_rgba(15,23,42,0.08)] w-full max-w-md space-y-4">
        <h1 className="flex items-center gap-2 text-indigo-700 font-bold text-xl">
          <BookOpen /> <span>Login do Bibliotecário</span>
        </h1>
        <p className="text-sm text-slate-500">Acesso restrito ao responsável pelo acervo</p>
        <div>
          <label className="block text-sm font-medium text-slate-700">Usuário / E-mail</label>
          <input
            required
            type="text"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg bg-slate-50 p-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Senha</label>
          <div className="relative mt-1">
            <input
              required
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg bg-slate-50 p-2 pr-10 outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((valor) => !valor)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-500 hover:text-indigo-600"
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {erro && (
          <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle size={16} /> {erro}
          </p>
        )}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
        >
          Entrar no Sistema
        </button>
        <p className="text-center text-sm text-slate-500">
          Ainda não possui cadastro?{' '}
          <button
            type="button"
            onClick={onAbrirCadastro}
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Cadastre-se
          </button>
        </p>
      </form>
    </div>
  );
}