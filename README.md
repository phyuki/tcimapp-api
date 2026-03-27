# tcimapp-api

Serviço em formato API responsável por receber requisições HTTP, realizar operações no banco de dados e retornar dados processados.

- Esta API atua como uma camada intermediária entre usuário e banco de dados.
- O serviço é responsável por validação básica, processamento e resposta de dados.
- Não possui regras de negócio complexas ou criptografia para senhas, sendo focado em leitura e escrita de dados em um ambiente de teste controlado para homologação dos resultados.

---

## Arquitetura e stack

Este serviço segue uma arquitetura simples baseada em camadas:

- **Controller**: recebe e responde requisições HTTP.
- **Service**: processa os dados.
- **Model**: realiza o mapeamento de objetos e tabelas do banco de dados.

Detalhes da stack e integrações:

- Implementação em **Node.js**.
- Uso do framework **Express**.
- Persistência de dados em banco **MySQL**.
- Comunicação via protocolo HTTP/REST.
- Dependências do projeto disponíveis em `package.json`.

---

## Execução do código

Para execução do serviço é necessário configurar as variáveis de ambiente:

- `NODE_ENV`: string contendo o ambiente de implantação (development | production).
- `DB_URL`: string de conexão com o banco de dados.
- `PORT`: porta onde a aplicação será executada (default: 3000).

### Executando localmente

```bash
npm install
npm run dev
```

---

## Configuração do Banco de Dados

- Estruturado em **MySQL**
- A única configuração manual necessária é a criação do banco no ambiente de escolha com o nome `tcimapp`.
- As tabelas e seus conteúdos serão inseridos de acordo com migrações
- ORM utilizado: **Sequelize**

### Estrutura do arquivo de configuração

Após a implantação do banco, é simples permitir a conexão da API a partir da URL gerada com as credenciais de acesso.
Eis um exemplo:

```bash
DB_URL="mysql://usuario:senha@host:5432/nome_do_banco"
```

### Execução das Migrações

Assim que a conexão estiver funcionando, as migrações podem ser executadas com apenas um comando:

```bash
npx sequelize db:migrate
```

---

## Rotas
- Operações básicas de cadastro (CRUD - Create, Read, Update and Delete)
- Padrão **RESTful**
Para simplificar o processo de desenvolvimento, as rotas podem ser acessadas sem controle de acesso, removendo a etapa de validação de tokens, por exemplo.

### Exemplos

- GET - /reportsByDisorder?patient=1&disorder="TEI"
- Patient -> Filtra os dados de acordo com o id do paciente escolhido
- Disorder -> Filtra os dados de acordo com o transtorno selecionado
- Descrição: Retorna o relatório, isto é, a lista dos scores de cada entrevista do paciente.
- Response (200 OK):
```bash
[
  ["1", "1", "19/03/2026"],
  ["1", "3", "22/01/2026"],
  ["3", "3", "23/03/2025"],
]
```

POST - /patients
- Descrição: Cadastro de pacientes
- Request Body:
```bash
{
  "name": "Jane Doe",
  "phone": "73999999999",
  "email": "teste@email.com",
  "address": "Rua ABC, 123",
  "professionalId": 3
}
```

PUT - /professionals
- Descrição: Atualização dos dados de um profissional da saúde
```bash
{
  "id": 1,
  "name": "Jane Doe",
  "phone": "73999999999",
  "email": "teste@email.com",
}
```
