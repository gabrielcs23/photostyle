# PhotoStyle

Sistema Web para servir como mostruário online de fotos escolares.

### Conceito

Para cada Aluno cadastrado no sistema será designado um Código de Acesso. Este código identifica a Escola do Aluno bem como sua matrícula. 
Portanto o código é único e exclusivo de cada Aluno.

Exemplo de um Código de Acesso seria:
```
GNL8-RB8GEP
```

Ao acessar o site e inserir este código, o responsável pelo Aluno terá acesso a uma mostra composta pela foto individual do mesmo, pelas fotos de sua Turma e, no caso 
de ter irmãos na mesma escola, pelas fotos com Irmãos.

## Backend

Composto por uma aplicação [Java](api) com Spring Boot e Maven cujo papel é o de uma API REST, ou seja, realizar cadastro, remoção, atualização e recuperação de Escolas,
Turmas, Alunos e Fotos.

Inicializado através da classe [ApiApplication](api/src/main/java/br/com/photostyle/api/ApiApplication.java).

### Banco de Dados
Foi utilizado MySQL como SGDB. As tabelas são geradas automaticamente ao inicializar o backend.

###### Atenção para a [seção de configurações](#configurações)

## Frontend

Composto por uma aplicação [ReactJS](web) com papel de representar toda a parte visual do site.

Contém duas seções centrais:
  1. A página de **administração**, com intuito de intermediar o cadastro e atualização das Fotos, Alunos etc. Acessada por ``` /admin ```, ex: ``` localhost:3000/admin ``` e
  2. A home page por onde o Código de Acesso é inserido, o mostruário e uma área para contato são exibidos.

###### Futuramente a seção de administração será acessada apenas mediante login de usuário administrador.

#### Levantar o frontend

- Para utilizar o site localmente utilize o comando:

  ``` npm run start-dev ```
  
- Para deploy utilize:

  ``` npm run ```
  
  Já configurado para instalar dependências, buildar e rodar servidor frontend.

## Configurações

O projeto foi idealizado para ser deployado (instalado, colocado, utilizado em) na [Amazon AWS](https://aws.amazon.com/pt/), serviço de nuvem da Amazon.

- Banco de Dados
Para o banco de dados existe o serviço [RDS](https://aws.amazon.com/pt/rds/). **Não esqueça de permitir o acesso via URL**

- Servidor
Para servidor Java existe o [Elastic Beanstalk](https://aws.amazon.com/pt/elasticbeanstalk)

- Envio de Fotos
Para envio de Fotos foi utilizado o [S3](https://aws.amazon.com/pt/s3) junto com configuração de acesso feito através de [IAM](https://aws.amazon.com/pt/iam).
**Todo envio de Fotos na aplicação foi projetado para utilizar o S3**

Para o funcionamento correto da aplicação faz-se necessário configurar as seguintes variáveis de ambiente no Beanstalk:
```
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD

AMAZON_ACCESSKEY
AMAZON_BUCKET
AMAZON_REGION
AMAZON_SECRETKEY
```
e da variável ``` REACT_APP_BACKEND_URL ``` para o frontend.

