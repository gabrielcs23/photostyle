# AGENTS.md

Guia rápido para agentes de IA (Claude Code e similares) trabalhando neste repositório.

## Visão geral

PhotoStyle é um sistema web de mostruário de fotos escolares. É um monorepo com dois projetos independentes: a API (`./api`) e o Frontend (`./web`). O sistema lida com dados de alunos (menores de idade, em geral) e de seus responsáveis — ver "Direções gerais" abaixo.

Veja [README.md](README.md) para o conceito de negócio (Código de Acesso) e configuração de deploy na AWS (RDS, Elastic Beanstalk, S3).

Melhorias já identificadas e ainda pendentes estão em [FOLLOWUPS.md](FOLLOWUPS.md), com evidência e objetivo de cada uma — consulte antes de abrir trabalho novo e remova o item ao concluí-lo.

## Direções gerais

*(rascunho — ampliar conforme surgirem novos casos)*

- **Esteja baseado em evidências.** Antes de afirmar como o sistema se comporta ou de alterar uma regra, verifique no código, nos testes, no schema (Liquibase) ou em logs — não presuma pelo nome de uma classe/variável ou por como sistemas parecidos costumam funcionar. Se não for possível confirmar, diga isso explicitamente em vez de apresentar uma suposição como fato.
- **Não use ontologia negativa.** Descreva regras, requisitos, erros e validações pelo que algo *é* ou deve fazer, não apenas pelo que não é ou não deve fazer (ex.: em vez de "matrícula não pode ser inválida", diga o formato/condição que a torna válida). Isso vale para mensagens de erro, comentários, nomes de método e descrições de commit/PR.
- **Cuidado para não vazar dados sensíveis em chat ou artefatos.** O sistema armazena dados pessoais de alunos (nome, matrícula, fotos, dados de contato do responsável) e credenciais de infraestrutura (AWS, JWT, SMTP, datasource). Nunca reproduza esses valores em respostas de chat, artefatos, logs colados ou commits — use placeholders/redação ao ilustrar exemplos, e trate qualquer dado real encontrado em `application-dev.properties`, logs ou banco como confidencial.

## API Backend

- Reside em [`./api`](api).
- Java 8 + Spring Boot 2.2 + Maven, expõe uma API REST (Escolas, Turmas, Alunos, Fotos, autenticação JWT).
- Build: `mvn clean install` (dentro de `api/`)
- Rodar local: `mvn spring-boot:run`
- Testes: `mvn test`
- Pacotes principais em `br.com.photostyle.api`: `controller`, `service`, `repository`, `model`, `security`, `email`, `infra`, `component`, `utils`.
- Migrações de banco via Liquibase (`src/main/resources/db/changelog`, `db/master.yaml`) — MySQL. Não editar changelogs já aplicados/commitados; adicionar novos changesets quando uma entidade JPA muda o schema.
- Configuração via variáveis de ambiente (ver `application.properties`): datasource MySQL, credenciais AWS (S3), JWT, SMTP, dados de personalização de email (Pix, contato).
- `application-dev.properties` é local/não versionado (config de ambiente de dev) — não commitar, pode conter segredos.
- Domínio e nomes de classes/variáveis em português (Escola, Turma, Aluno, Irmão, Matrícula) — manter esse padrão em código novo, não traduzir para inglês.
- Rodar `mvn test` ao alterar lógica de negócio, antes de considerar a tarefa concluída.

## Frontend

- Reside em [`./web`](web).
- ReactJS 16 (Create React App), consome a API. Tem uma área pública (código de acesso do aluno) e uma área `/admin`.
- Instalar dependências: `npm install`
- Rodar em dev: `npm run start-dev`
- Build de produção: `npm run build`
- Testes: `npm run test`
- Estrutura em `src/`: `Pages` (rotas/telas, incl. `AreaAdmin` e `AreaAluno`), `Model`.
- Estilo: Materialize CSS + Sass (`node-sass`).
- URL do backend configurada via `REACT_APP_BACKEND_URL`.
- Mudanças de UI: subir o frontend (`npm run start-dev`) e validar visualmente o fluxo afetado antes de considerar a tarefa concluída.

## Convenções gerais

- Não commitar credenciais/segredos (AWS, JWT, SMTP, datasource) — sempre via variável de ambiente.
- Sem suíte de lint/format automatizada configurada — seguir o estilo já presente no arquivo sendo editado.
