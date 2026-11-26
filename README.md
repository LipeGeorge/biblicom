# Biblicom

Sistema de gerenciamento de biblioteca comunitária para cadastro do acervo, controle de exemplares, leitores, empréstimos e devoluções.

## Funcionalidades

- Cadastro de autores, livros, exemplares e leitores.
- Consulta de disponibilidade do acervo e de exemplares individuais.
- Registro e devolução de empréstimos com datas e histórico por leitor.
- Indicadores de empréstimos ativos, atrasados e realizados por mês.
- Alertas de vencimento próximo.
- Autenticação do responsável por sessão HTTP, com senha armazenada usando BCrypt.

## Tecnologias

- **Frontend:** React, Vite, Tailwind CSS.
- **Backend:** Java 21, Spring Boot, Spring Web MVC, Spring Data JPA e Spring Security.
- **Banco de dados:** MySQL 8.4.
- **Execução:** Docker Compose, Nginx e Maven.

## Executar com Docker

Requisitos: Docker Engine e Docker Compose v2.

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/LipeGeorge/biblicom.git
   cd biblicom
   ```

2. Construa e inicie os serviços:

   ```bash
   docker compose up --build -d
   ```

3. Acesse a aplicação em `http://localhost:3000` e entre com as credenciais de demonstração:

   - **E-mail:** `admin@biblicom.local`
   - **Senha:** `Biblicom-Curso-2026!`

O Docker Compose inicia MySQL, API e frontend sem exigir configuração prévia. O Nginx serve a aplicação e encaminha `/api` ao backend; assim, a sessão e a proteção CSRF funcionam na mesma origem. O banco persiste no volume `mysql_data`. A primeira inicialização cria a conta de demonstração se ainda não houver um responsável cadastrado.

Os valores padrão são exclusivos para execução local/demonstração de curso; não os use em produção. Para sobrescrever, crie `.env` com base em `.env.example` antes de iniciar os containers.

Se você já tiver um `.env` de uma execução anterior, os valores nele podem sobrescrever as credenciais de demonstração acima. O bootstrap também não altera a senha de uma conta que já existe. Para começar uma demonstração do zero, ajuste ou remova o `.env` antigo e, **somente se puder apagar os dados locais**, execute `docker compose down -v` antes de `docker compose up --build -d`.

Para acompanhar os serviços:

```bash
docker compose ps
docker compose logs -f backend frontend
```

Para parar a aplicação:

```bash
docker compose down
```

Para apagar também os dados persistidos do banco:

```bash
docker compose down -v
```

> `docker compose down -v` remove permanentemente o volume local do banco.

## Desenvolvimento local

O modo recomendado para executar a aplicação completa é Docker Compose. Para trabalhar separadamente:

### Backend

Inicie um MySQL e defina `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD`. Para criar a conta inicial, defina também `BIBLICOM_ADMIN_BOOTSTRAP_ENABLED=true`, `BIBLICOM_ADMIN_EMAIL` e `BIBLICOM_ADMIN_PASSWORD`.

```bash
cd backend/backend
./mvnw spring-boot:run
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm ci
npm run dev
```

O Vite encaminha `/api` para `http://localhost:8080`. Para outra URL local, configure `BACKEND_URL` no ambiente do processo Vite. O frontend usa sessão HTTP e cookies; mantenha o proxy no mesmo host para evitar configuração adicional de CORS e cookies cross-origin.

## API

A API usa JSON. As rotas de negócio exigem uma sessão autenticada.

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/auth/login` | Inicia sessão do responsável |
| `GET` | `/auth/me` | Consulta a sessão atual |
| `POST` | `/auth/logout` | Encerra sessão |
| `GET`, `POST` | `/autores` | Lista e cadastra autores |
| `GET`, `POST` | `/livros` | Lista o acervo e cadastra livros com quantidade de exemplares |
| `GET` | `/livros/{id}/exemplares` | Lista os exemplares de um livro |
| `GET`, `POST` | `/leitores` | Lista e cadastra leitores |
| `GET` | `/emprestimos` | Lista empréstimos |
| `GET` | `/emprestimos/{id}` | Consulta um empréstimo |
| `GET` | `/emprestimos/leitores/{leitorId}` | Consulta histórico do leitor |
| `POST` | `/emprestimos` | Registra empréstimo de um exemplar |
| `PATCH` | `/emprestimos/{id}/devolucao` | Registra devolução |
| `GET` | `/emprestimos/relatorios` | Consulta indicadores e totais mensais |

O frontend obtém o token CSRF em `GET /auth/csrf` e o envia automaticamente em operações que alteram dados.

## Testes e verificações

Backend:

```bash
cd backend/backend
./mvnw clean test
```

Frontend:

```bash
cd frontend
npm ci
npm run lint
npm run build
```

## Requisitos do trabalho

A implementação cobre a parte de Orientação a Objetos descrita no trabalho: cadastro de livros e leitores, quantidade e disponibilidade de exemplares, empréstimos, devoluções, histórico, relatórios de circulação e autenticação com senha armazenada como hash. Os avisos de vencimento próximo também estão disponíveis.

A exportação de relatórios em PDF não faz parte do backend; o painel permite impressão pelo navegador. As questões dos paradigmas Funcional e Lógico descritas no PDF do trabalho não estão incluídas neste repositório.

## Segurança e configuração de produção

- Nunca publique o `.env`; o arquivo está ignorado pelo Git.
- As credenciais padrão são públicas e servem apenas para demonstração local. Configure senhas fortes e exclusivas antes de qualquer implantação acessível pela rede.
- Em produção, sirva o frontend sobre HTTPS e configure `SESSION_COOKIE_SECURE=true`.
- O token CSRF e o cookie de sessão não substituem HTTPS.
- O bootstrap da conta só deve ser habilitado na inicialização em que a primeira conta precisa ser criada. Depois, pode ser desabilitado.
- O backend cria/atualiza o schema via Hibernate (`ddl-auto=update`); para produção com dados importantes, use migrações versionadas antes de evoluir o schema.

## Desenvolvedores

- Backend — [@LipeGeorge](https://github.com/LipeGeorge)
- Frontend — [@avelinofaco](https://github.com/avelinofaco)
