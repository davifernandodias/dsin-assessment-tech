# Desafio Técnico da Cabeleleila Leila

## Tecnologias Utilizadas

### Backend
- **Node.js**: Runtime para execução do servidor.
- **Express**: Framework para construção da API.
- **Drizzle ORM**: ORM para interação com o banco de dados PostgreSQL.
- **PostgreSQL**: Banco de dados relacional.
- **Zod**: Validação de esquemas para entrada de dados.
- **Pino**: Logger para monitoramento e depuração.

### Frontend
- **Next.js 15**: Framework React com suporte a Server-Side Rendering (SSR) e Client-Side Rendering (CSR).
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
- **Clerk**: Serviço de autenticação e gerenciamento de usuários.
- **Shadcn**: Biblioteca de componentes estilizados.

## Estrutura do Projeto
- **Monorepo**: O projeto está organizado em um monorepo com os seguintes diretórios:
  - `server/`: Contém as rotas da API.
  - `web/`: Contém o frontend.
  - `db/`: Contém os schemas e modelos do banco de dados.

## Configuração do Ambiente

- **Clone esse repositório**

### 1. Instalar Dependências

Certifique-se de ter instalado:
- **Node.js** (versão 18 ou superior)
- **Docker** (para rodar o container do PostgreSQL)
- **npm** (vem com o Node.js)
- **Ngrok** (para expor localmente a aplicação ao Clerk)

### 2. Configurar Variáveis de Ambiente
O projeto usa dois arquivos `.env` devido à limitação do frontend em acessar o `.env` da raiz em um monorepo. 

Crie um arquivo `.env` na raiz do projeto e configure conforme abaixo:

```env
API_URL_FRONTEND_LOCAL=http://localhost:3000/
API_PORT=8080
LOG_LEVEL=info
DATABASE_URL=postgresql://postgres:senha@localhost:5432/ecommecer
```

Para o frontend (`web/`), crie um arquivo `.env`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/agenda
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/agenda
```

### 3. Subir o Banco de Dados com Docker

Execute o comando para rodar o PostgreSQL:

```sh
docker compose up -d
```

### 4. Aplicar Migrações ao Banco

Entre no diretório `db/` e rode:

```sh
cd packages/db
npm install
npm run push
```

### 5. Instalar Dependências da API e Web

```sh
npm install
cd apps/server
npm install
cd ../web
npm install
```

### 6. Rodar o Servidor

```sh
cd apps/server
npm run dev
```

Se tudo estiver correto, você verá a mensagem:

```
✅ Conexão ao banco de dados estabelecida com sucesso!
```

### 7. Configurar Webhooks do Clerk

Para sincronizar os usuários com a API, configure o `ngrok`:

```sh
cd apps/web
npm run dev
depois
npm run ngrok
```

Copie a URL gerada e configure-a no painel do Clerk em `Configurações > Webhooks`, adicionando o endpoint `/api/auth/webhook`.

### 8. Criar um Usuário Admin

O primeiro usuário criado via Clerk tem a role `client`. Para promovê-lo a `Admin`, rode:

```sh
docker ps
```

Copie o nome do container PostgreSQL e execute:

```sh
sudo docker exec -it nome-do-container psql -U postgres -d ecommecer -c "UPDATE users SET role = 'Admin' WHERE id = (SELECT id FROM users LIMIT 1);"
```

## Funcionalidades

### Admin
- Painel com todos os agendamentos filtrados por pendentes e confirmados.
![Image](https://github.com/user-attachments/assets/a42f9b37-a25c-4eda-aa2c-234463269026)

- Dashboard exclusivo para administradores.
  ![Image](https://github.com/user-attachments/assets/2e6d5929-7962-42c5-a9e7-130eff7b5f37)

- Histórico completo de agendamentos.
![Image](https://github.com/user-attachments/assets/611d0e0b-25cb-4143-9073-676035c290f2)



### Cliente
- Painel com os próprios agendamentos.
  ![Image](https://github.com/user-attachments/assets/a7337176-26be-4106-9ec3-f6f8062f1f88)

- Opção de agendar serviços com recomendação caso tenha um agendamento na mesma semana na qual o cliente quer agendar o novo serviço.
  ![Image](https://github.com/user-attachments/assets/5980078c-f3ab-4259-9073-ce1e084ada1b)

- Reagendamento com restrições (se faltar menos de 2 dias, somente o admin pode reagendar), alerta com número do admin/dono(a).
  ![Image](https://github.com/user-attachments/assets/eb77051a-2fc5-4631-a255-d1cf3cea8ac2)
- Histórico simplificado e intuitivo.
  ![Image](https://github.com/user-attachments/assets/58849ddb-a1d5-4f9f-abde-f7e143c2dcfa)


