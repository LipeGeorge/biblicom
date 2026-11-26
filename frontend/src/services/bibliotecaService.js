const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

let csrfToken = null;

async function request(path, { method = 'GET', body } = {}) {
  const normalizedMethod = method.toUpperCase();
  const headers = new Headers({ Accept: 'application/json' });

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (unsafeMethods.has(normalizedMethod)) {
    csrfToken = await obterTokenCsrf();
    headers.set('X-XSRF-TOKEN', csrfToken);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: normalizedMethod,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend está em execução.');
  }

  if (path === '/auth/login' && response.ok) {
    csrfToken = null;
  }
  if (path === '/auth/logout' && response.ok) {
    csrfToken = null;
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = payload?.detail || payload?.message || payload?.error;
    const error = new Error(
      response.status === 401
        ? 'E-mail ou senha inválidos.'
        : message || `A API respondeu com erro (${response.status}).`
    );
    error.status = response.status;
    throw error;
  }

  return payload;
}

async function obterTokenCsrf() {
  if (csrfToken) {
    return csrfToken;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/csrf`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend está em execução.');
  }

  if (!response.ok) {
    throw new Error(`Não foi possível obter o token CSRF (${response.status}).`);
  }

  const payload = await response.json();
  csrfToken = payload.token;
  if (!csrfToken) {
    throw new Error('A API não retornou o token CSRF esperado.');
  }
  return csrfToken;
}

export const bibliotecaService = {
  login: (email, senha) => request('/auth/login', {
    method: 'POST',
    body: { email, senha },
  }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  getCurrentUser: () => request('/auth/me'),

  getAutores: () => request('/autores'),
  criarAutor: (nome) => request('/autores', {
    method: 'POST',
    body: { nome },
  }),

  getLivros: () => request('/livros'),
  getExemplares: (livroId) => request(`/livros/${encodeURIComponent(livroId)}/exemplares`),
  criarLivro: ({ titulo, genero, autorId, quantidadeExemplares }) => request('/livros', {
    method: 'POST',
    body: { titulo, genero, autorId: String(autorId), quantidadeExemplares },
  }),

  getLeitores: () => request('/leitores'),
  criarLeitor: (leitor) => request('/leitores', {
    method: 'POST',
    body: leitor,
  }),

  getEmprestimos: () => request('/emprestimos'),
  getEmprestimosDoLeitor: (leitorId) =>
    request(`/emprestimos/leitores/${encodeURIComponent(leitorId)}`),
  criarEmprestimo: ({ leitorId, exemplarId, dataPrevistaDevolucao }) =>
    request('/emprestimos', {
      method: 'POST',
      body: { leitorId, exemplarId, dataPrevistaDevolucao },
    }),
  registrarDevolucao: (emprestimoId) =>
    request(`/emprestimos/${encodeURIComponent(emprestimoId)}/devolucao`, {
      method: 'PATCH',
    }),
  getRelatorio: () => request('/emprestimos/relatorios'),
};
