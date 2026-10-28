# API da Loja

API REST para administrar os dados de uma loja, incluindo catálogo de produtos, estoque, clientes, fornecedores, funcionários, pedidos e usuários. A aplicação usa Node.js, Express e MySQL, com o esquema definido em `profcarlosmacedo_loja_oficial.sql`.

## Executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Importe `profcarlosmacedo_loja_oficial.sql` no MariaDB/MySQL.

3. Configure as variáveis de ambiente:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=profcarlosmacedo_loja_oficial
   JWT_SECRET=um_segredo_longo_e_aleatorio
   port=5000
   ```

   `JWT_SECRET` é necessário para o login. O servidor usa `port` (minúsculo) e, se não estiver definido, inicia na porta `5000`.

4. Inicie o servidor:

   ```bash
   npm run dev
   ```

O endereço local padrão é `http://localhost:5000`. As requisições e respostas usam JSON; o CORS está configurado para aceitar qualquer origem.

## Recursos e endpoints

Exceto onde indicado, os recursos CRUD oferecem:

| Método | Caminho | Descrição |
| --- | --- | --- |
| `GET` | `/recurso` | Lista os registros |
| `GET` | `/recurso/:id` | Busca um registro pelo ID |
| `POST` | `/recurso` | Cria um registro |
| `PATCH` | `/recurso/:id` | Atualiza os campos enviados |
| `DELETE` | `/recurso/:id` | Remove um registro |

Os campos abaixo são aceitos nos corpos de `POST` e `PATCH`. Campos de ID e timestamps são gerados ou mantidos pelo banco de dados.

| Recurso | ID | Campos |
| --- | --- | --- |
| `/categoria` | `id_categoria` | `nome`, `descricao`, `ativo` |
| `/cliente` | `id_cliente` | `nome`, `email`, `contato`, `ativo` |
| `/entrada` | `id_entrada` | `id_produto`, `id_fornecedor`, `quantidade`, `valor_unitario`, `data_entrada`, `observacao` |
| `/estoque` | `id_estoque` | `id_produto`, `quantidade`, `estoque_minimo`, `estoque_maximo`, `localizacao` |
| `/fornecedor` | `id_fornecedor` | `nome`, `empresa`, `email`, `telefone`, `cidade`, `estado`, `ativo` |
| `/funcionario` | `id_funcionario` | `nome`, `cargo`, `salario`, `telefone`, `email`, `data_admissao`, `ativo` |
| `/historico-precos` | `id_historico` | `id_produto`, `preco`, `vigencia` |
| `/log` | `id_log` | `usuario`, `tabela_afetada`, `acao`, `registro`, `data_hora` |
| `/movimentacao` | `id_movimentacao` | `id_produto`, `tipo`, `quantidade`, `data_movimentacao`, `observacao` |
| `/pedido` | `id_pedido` | `status`, `data_pedido`, `id_cliente` |
| `/pedido-item` | `id_item` | `id_pedido`, `id_produto`, `quantidade`, `valor_unitario`, `subtotal` |
| `/produto` | `id_produto` | `nome`, `descricao`, `preco`, `imagem_produto`, `id_categoria` |
| `/saida` | `id_saida` | `id_produto`, `id_funcionario`, `quantidade`, `valor_unitario`, `data_saida`, `destino` |
| `/usuario` | `id_usu` | Endpoints descritos abaixo |

Nos demais recursos, `PATCH` altera apenas os campos reconhecidos que forem enviados. Se nenhum campo válido for enviado, retorna `400`.

## Usuários e login

| Método | Caminho | Descrição |
| --- | --- | --- |
| `GET` | `/usuario` | Lista usuários sem incluir as senhas |
| `GET` | `/usuario/:id` | Busca usuário pelo ID sem incluir a senha |
| `POST` | `/usuario` | Cadastra usuário |
| `PATCH` | `/usuario/:id` | Atualiza nome, email e senha |
| `DELETE` | `/usuario/:id` | Remove usuário |
| `POST` | `/usuario/login` | Autentica o usuário pelo email e senha |

O cadastro aceita `nome`, `email`, `senha`, `contato`, `genero` e `ativo`. O `PATCH` de usuário é uma implementação específica e espera `nome`, `email` e `senha`; ele não tem o comportamento parcial dos demais recursos.

Exemplo de login:

```http
POST /usuario/login
Content-Type: application/json
```

```json
{
  "email": "usuario@exemplo.com",
  "senha": "sua_senha"
}
```

Com sucesso, a resposta contém `mensagem`, `token` JWT com validade de 8 horas e os dados do usuário sem a senha. Usuários inativos não podem autenticar. O login atualmente reconhece hashes bcrypt e também senhas armazenadas em texto puro para compatibilidade com os dados existentes.

Os endpoints CRUD não exigem nem validam o token JWT atualmente. O token emitido pelo login, portanto, ainda não protege as demais rotas.

## Exemplo de criação

```http
POST /produto
Content-Type: application/json
```

```json
{
  "nome": "Detergente",
  "descricao": "Detergente líquido 500ml",
  "preco": 3.5,
  "imagem_produto": "https://exemplo.com/detergente.jpg",
  "id_categoria": 1
}
```

## Respostas e observações

- `200`: consulta concluída ou login realizado.
- `201`: registro criado.
- `202`: atualização ou remoção aceita.
- `400`: dados necessários ausentes ou nenhum campo válido para `PATCH`.
- `401`: credenciais inválidas ou usuário inativo.
- `404`: rota ou registro não encontrado, conforme o endpoint.
- `500`: erro de conexão, banco de dados ou configuração do servidor.

Entradas e saídas também têm efeitos definidos por triggers no SQL: inserir uma entrada acrescenta a quantidade ao estoque; inserir uma saída subtrai a quantidade do registro de estoque correspondente. Esses efeitos dependem dos triggers estarem instalados no banco.

Os erros de banco retornados pela API podem incluir detalhes internos. Em ambiente de produção, configure mensagens de erro genéricas e evite expor esses detalhes ao cliente.