# Follow-ups

Melhorias identificadas durante o trabalho no repositório que ficaram fora do escopo da tarefa
em que foram descobertas. Cada item registra a evidência (arquivo e linha na data do registro),
o comportamento atual e o objetivo.

Ao concluir um item, remova-o daqui e descreva a mudança na mensagem de commit.

---

## 1. Entropia e previsibilidade do código de acesso do aluno

**Origem:** investigação do lock pessimista na importação de planilhas (2026-09-12).
**Risco:** alto — o código de acesso é credencial de um endpoint público.
**Arquivo:** [`GeradorCodigoAcesso.java`](api/src/main/java/br/com/photostyle/api/component/GeradorCodigoAcesso.java)

O código de acesso (`ALUNO.COD_AC`, UNIQUE) é a única credencial de
`GET /api/kit/{codAcesso}`, declarado `permitAll()` em
[`SecurityConfigurerAdapter.java:41`](api/src/main/java/br/com/photostyle/api/security/SecurityConfigurerAdapter.java).
Formato atual: `XXXX-YYYYYY` — 4 caracteres derivados da escola, hífen, 6 caracteres derivados do aluno.

Comportamento atual:

- `gerarCodEscola` é determinístico, então todos os alunos de uma mesma escola compartilham o
  mesmo prefixo de 4 caracteres.
- `gerarCodMatricula` recebe o **nome** do aluno (a chamada em `AlunoService` passa
  `aluno.getNome()` num parâmetro nomeado `matricula`) e devolve uma substring de 6 caracteres do
  hash MD5 desse nome, a partir de uma posição sorteada. Como o hash em base 32 tem cerca de 26
  caracteres, existem no máximo ~21 códigos possíveis para um par (escola, nome).
- Consequência: de posse de um código qualquer, o prefixo da escola é conhecido; o sufixo de outro
  aluno da mesma escola pertence a um conjunto de ~21 valores deriváveis do nome dele.
- `new Random()` é gerador de números pseudoaleatórios de uso geral.
- `gerarHash` chama `m.update(s.getBytes(), 0, s.length())`, usando contagem de caracteres como
  contagem de bytes — nomes com acento entram truncados no hash. E `s.getBytes()` sem charset
  explícito segue o encoding padrão da JVM, então Windows (local) e Linux (Beanstalk) produzem
  hashes diferentes para o mesmo nome.
- `gerarCodEscola` usa `.substring(11,15)`, que pressupõe comprimento mínimo de 15 caracteres.

Objetivo: manter o formato `XXXX-YYYYYY` (há códigos já distribuídos a responsáveis, que devem
continuar válidos) e sortear os 6 caracteres do sufixo com `SecureRandom` sobre um alfabeto fixo,
elevando o espaço para a ordem de 10⁹ candidatos independentes por aluno. Convém escolher um
alfabeto de caracteres distinguíveis entre si (evitando pares como `0`/`O` e `1`/`I`/`L`), já que
esses códigos são digitados manualmente.

Decisão em aberto: o prefixo da escola permanece derivado de hash — e aí corrigir o `getBytes()`
altera o prefixo de escolas com acento daqui em diante, o que é cosmético, já que a busca usa o
código completo — ou passa a ser uma coluna persistida em `ESCOLA`, calculada uma vez e estável,
com backfill via Liquibase a partir de `LEFT(COD_AC,4)`.

O consumidor é `AlunoService.gerarCodigosAcesso`, que já trata colisão com deduplicação em memória,
verificação em lote no banco e limite de tentativas. A troca do gerador tende a não exigir mudanças
nesse ponto.

---

## 2. Efeitos no S3 executados dentro de transação

**Origem:** revisão da semântica de rollback dos services (2026-09-12).
**Risco:** médio — consistência entre banco e bucket.
**Arquivo:** [`FotoService.java`](api/src/main/java/br/com/photostyle/api/service/FotoService.java)

`upload` chama `imgService.saveImage` e `remover` chama `imgService.deleteImage` de dentro de
métodos `@Transactional`. O S3 fica fora do controle transacional do banco, então:

- Se a transação que engloba o `upload` falhar depois que ele retornou (por exemplo, em
  `TurmaService.adicionarFoto`, que chama `upload` e depois `repository.save(turma)`), o arquivo
  permanece no bucket sem linha correspondente.
- Se a transação que engloba o `remover` falhar, o arquivo já foi apagado e a linha restaurada pelo
  rollback aponta para um objeto ausente.

O `upload` já tem compensação parcial: um `catch` remove a imagem quando o `save` da entidade falha.
A lacuna está nas falhas que acontecem depois do retorno do método.

Objetivo: fazer com que a escrita no S3 e a escrita no banco fiquem consistentes — por exemplo,
publicando o efeito no S3 após o commit (`TransactionSynchronization`) ou registrando compensação
explícita no rollback. Vale medir antes qual dos dois sentidos (órfão no bucket ou referência
quebrada no banco) realmente ocorre em produção.

---

## 3. Inserção em lote dos alunos na importação

**Origem:** correção do lock pessimista na importação (2026-09-12).
**Risco:** baixo — condicionado a medição.
**Arquivos:** [`EscolaService.importarTurmasEAlunos`](api/src/main/java/br/com/photostyle/api/service/EscolaService.java),
[`AlunoService.salvarAlunosDaTurma`](api/src/main/java/br/com/photostyle/api/service/AlunoService.java)

A importação passou a fazer parse e geração de códigos fora da transação, que hoje contém apenas os
inserts. Resta que cada aluno é um round-trip: `BaseEntity` usa `GenerationType.IDENTITY`, e o
Hibernate 5 desliga o batching JDBC nesse modo, porque precisa da chave gerada a cada `save`.

Objetivo: se a medição em produção mostrar que a duração da transação ainda incomoda, trocar o
`saveAll` dos alunos por um `INSERT` multi-linha via `JdbcTemplate` — os IDs gerados dos alunos não
são consumidos pela importação. A alternativa de trocar a estratégia de ID do `BaseEntity` afeta
todas as entidades e exige migração; convém evitá-la enquanto a primeira resolver.

Medir antes de agir: registrar duração da importação e número de linhas da planilha em produção.

---

## 4. Validação em produção do diagnóstico do lock

**Origem:** correção do lock pessimista na importação (2026-09-12).
**Risco:** informativo — confirma se a correção endereçou a causa observada.

A correção da importação partiu do mecanismo identificado no código (transação longa segurando
locks de FK em `ESCOLA` e `TURMA` durante todo o processamento da planilha). A confirmação em
produção ficou pendente. O que coletar:

- A mensagem e o código exatos no log da aplicação: 1205 (`Lock wait timeout exceeded`) e 1213
  (`Deadlock found`) têm diagnósticos diferentes.
- Durante uma importação real: `information_schema.innodb_trx` (`trx_started`, `trx_rows_locked`)
  para duração e volume de linhas travadas; `performance_schema.data_lock_waits` com `data_locks`
  para identificar a contraparte.
- `SHOW ENGINE INNODB STATUS`, seção `LATEST DETECTED DEADLOCK`.

---

## 5. Itens menores

- **`@Transactional` em método `protected`.** `FotoService.remover(Long)`
  ([`FotoService.java`](api/src/main/java/br/com/photostyle/api/service/FotoService.java)) é
  `protected` e anotado; o Spring aplica a anotação apenas em métodos públicos, então ela fica sem
  efeito ali. Hoje é inofensivo, porque todos os chamadores já são transacionais. Convém tornar o
  método público ou remover a anotação, deixando explícito que a transação vem do chamador.
- **Padronizar logging.** `AcessoKitService` passou a usar SLF4J; `GeradorCodigoAcesso`,
  `ImageService` e `EmailService` ainda usam `e.printStackTrace()`, que escreve em stderr sem
  contexto. Convém adotar SLF4J nesses pontos para que as falhas apareçam no log da aplicação.
