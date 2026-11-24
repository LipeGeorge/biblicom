# Biblicom

Sistema de gerenciamento de uma biblioteca comunitária desenvolvido como projeto final da disciplina de Linguagens de Programação.

## Tecnologias

- Java 21
- Spring Boot 4
- Spring Data JPA
- MySQL 8.4
- Maven
- Docker Compose
- SpringDoc OpenAPI / Swagger

## Pré-requisitos

- Git
- Java 21
- Docker e Docker Compose
- Maven opcional, pois o projeto inclui o Maven Wrapper

## Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/LipeGeorge/biblicom.git
cd biblicom
```

### 2. Configurar as variáveis de ambiente

Entre na pasta da aplicação:

```bash
cd backend/backend
cp .env.example .env
```

Edite o arquivo `.env`:

```dotenv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=meu_banco
DB_USER=dev_user
DB_PASSWORD=dev_password
DB_ROOT_PASSWORD=sua_senha_root
```

### 3. Iniciar o banco MySQL

Na pasta `backend/backend`, execute:

```bash
docker compose --env-file .env -f docker/docker-compose.yml up -d
```

### 4. Executar a aplicação

#### Linux ou macOS

```bash
./mvnw spring-boot:run
```

#### Windows

```cmd
mvnw.cmd spring-boot:run
```

A API ficará disponível em:

```text
http://localhost:8080
```

## Documentação da API

Com a aplicação em execução, acesse o Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

A especificação OpenAPI também pode ser consultada em:

```text
http://localhost:8080/v3/api-docs
```

## Executando os testes

```bash
./mvnw test
```

No Windows:

```cmd
mvnw.cmd test
```

## Estrutura do projeto

```text
backend/backend
├── docker
│   └── docker-compose.yml
├── src
│   ├── main
│   │   ├── java/com/biblicom/backend
│   │   │   ├── controller
│   │   │   ├── entity
│   │   │   ├── repository
│   │   │   └── service
│   │   └── resources
│   │       └── application.properties
│   └── test
├── .env.example
├── mvnw
├── mvnw.cmd
└── pom.xml
```

## Parar os containers

```bash
docker compose --env-file .env -f docker/docker-compose.yml down
```

Para remover também os dados armazenados pelo MySQL:

```bash
docker compose --env-file .env -f docker/docker-compose.yml down -v
```

## Autor

- [Lipe George](https://github.com/LipeGeorge)
