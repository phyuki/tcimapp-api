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
- A única configuração manual necessária é a criação do banco no ambiente de escolha.
- As tabelas e seus conteúdos serão inseridos de acordo com migrações
- ORM utilizado: **Sequelize**
- A configuração da conexão entre servidor e banco está contido no arquivo `config.json`.

### Estrutura do arquivo de configuração

Este arquivo deve ser criado com as informações geradas de acesso ao banco após a implantação do mesmo.

```bash
{
  "username": "user",
  "password": "root",
  "database": "tcimapp",
  "host": "127.0.0.1",
}
```

### Execução das Migrações

Assim que a conexão estiver funcionando, as migrações podem ser executadas com apenas um comando:

```bash
npx sequelize db:migrate
```
