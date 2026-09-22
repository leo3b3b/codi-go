# CodiGO!

O CodiGO! é uma aplicação web B2B para escolas, voltada ao desenvolvimento do pensamento computacional de crianças por meio de atividades interativas.

O monorepo possui duas aplicações frontend:

* `apps/adults` — aplicação para usuários adultos, principalmente administradores e professores;
* `apps/students` — aplicação para alunos.

Existem também packages compartilhados em `packages/`.

O comportamento do produto e suas regras de negócio podem evoluir. Antes de propor mudanças, considere o código atual e os decision docs relacionados.

## Equipe

Os chats de desenvolvimento são utilizados por Leonardo, Laura ou Vinicius.

### Leonardo

Leonardo é o responsável técnico e possui a palavra final sobre decisões arquiteturais.

Ao trabalhar com Leonardo:

* utilize linguagem técnica compatível com seu nível;
* discuta trade-offs, segurança, manutenibilidade, desempenho e dívida técnica quando relevantes;
* questione decisões técnicas quando houver motivos concretos;
* apresente alternativas quando existirem;
* diferencie recomendações de decisões já tomadas.

### Laura e Vinicius

Ao trabalhar com Laura ou Vinicius:

* explique o que será alterado, onde e por quê antes da implementação;
* explique conceitos relevantes para a alteração;
* destaque dependências entre arquivos, aplicações e packages;
* preserve os padrões existentes;
* divida mudanças complexas em etapas quando isso facilitar a compreensão;
* indique como verificar a alteração;
* sinalize decisões que precisam ser avaliadas por Leonardo.

Laura e Vinicius não devem introduzir novas bibliotecas, camadas, abstrações, padrões arquiteturais ou estratégias de autenticação, autorização, persistência, estado ou validação sem consultar Leonardo.

Se existir uma solução utilizando os padrões atuais, ela deve ser priorizada.

### Identificação

No início de uma nova conversa técnica, confirme se o interlocutor é Leonardo, Laura ou Vinicius, caso isso ainda não tenha sido informado.

Não tente inferir a identidade pelo estilo ou pelo nível técnico da pergunta.

## Repositório

O código-fonte está em:

`github.com/leo3b3b/codi-go`

O código existente é a referência para a estrutura atual. Este documento não deve ser tratado como mais atualizado que o repositório.

Antes de propor alterações que dependam da implementação atual, consulte os arquivos relevantes.

Não realizar operações de escrita no GitHub. Não criar, alterar ou excluir branches, commits, pull requests ou arquivos em nome do desenvolvedor.

## Workflow

O projeto utiliza branches para features e mudanças significativas.

Prefira:

* uma branch por mudança logicamente independente;
* commits pequenos e coesos;
* mensagens de commit que descrevam a alteração;
* alterações relacionadas agrupadas no mesmo commit;
* alterações não relacionadas separadas.

Branches, commits e pull requests existentes podem ser consultados para entender o workflow utilizado pela equipe.

## Stack

O projeto utiliza atualmente:

* React;
* TypeScript;
* Vite;
* React Router em Data Mode;
* Supabase JS;
* UnoCSS;
* Biome;
* npm workspaces.

A versão exata das dependências deve ser obtida dos `package.json` e do lockfile, em vez de ser duplicada neste documento.

A aplicação de adultos utiliza React Hook Form, Valibot e `@hookform/resolvers`.

Não substituir tecnologias existentes ou adicionar novas tecnologias sem justificativa técnica e, quando necessário, avaliação de Leonardo.

## Monorepo

A estrutura principal é:

```text
codi-go/
├── apps/
│   ├── adults/
│   └── students/
├── packages/
│   ├── supabase/
│   └── ui/
├── docs/
│   └── decisions/
├── package.json
├── package-lock.json
├── vite.config.ts
├── uno.config.ts
├── biome.json
├── tsconfig.json
├── tsconfig.base.json
└── tsconfig.node.json
```

As aplicações não possuem `src/`. Cada aplicação utiliza seu próprio diretório como source root.

Não criar `src/` dentro de `apps/adults` ou `apps/students`.

O root utiliza npm workspaces:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

Dependências devem ser declaradas no workspace que realmente depende delas.

Não promover dependências específicas de uma aplicação para o root apenas por conveniência.

## Aplicações

### `apps/adults`

A aplicação de adultos atualmente organiza o código principalmente por:

```text
apps/adults/
├── components/
├── layouts/
├── pages/
├── schemas/
├── services/
└── ...
```

Essa é a organização atual de referência para novas funcionalidades da aplicação.

Não reintroduzir automaticamente a antiga organização baseada em `features/`.

Use:

* `pages/` para páginas;
* `layouts/` para estruturas de layout e navegação;
* `components/` para componentes reutilizáveis da aplicação;
* `schemas/` para schemas de validação;
* `services/` para lógica de integração e operações de negócio.

Não criar novas camadas como `repositories/`, `data-access/` ou equivalentes sem uma decisão arquitetural explícita.

### `apps/students`

A aplicação de estudantes é independente da aplicação de adultos, mas compartilha das mesmas bases.

## Packages

Packages compartilhados ficam em `packages/`.

Exemplo:

```text
packages/
├── supabase/
└── ui/
```

Crie um novo package somente quando existir uma fronteira real de compartilhamento entre aplicações.

Não criar packages genéricos como `shared` ou `utils` antecipadamente.

### `@codi-go/supabase`

O package `@codi-go/supabase` fornece o cliente Supabase compartilhado e os tipos relacionados ao banco.

As aplicações devem utilizar sua API pública:

```ts
import { supabase } from "@codi-go/supabase";
```

Não importar diretamente arquivos internos de outro workspace quando existir uma API pública definida pelo package.

### `@codi-go/ui`

O package `@codi-go/ui` concentra estilos, tokens e configurações de UI compartilhadas.

A configuração do UnoCSS utiliza esse package.

Não duplicar tokens, estilos ou configurações compartilhadas nas aplicações sem necessidade.

## Dados e Supabase

Alterações envolvendo Supabase, PostgreSQL, migrations, RLS, policies, RPCs, autenticação, autorização ou acesso a dados devem seguir:

`docs/decisions/0005-database.md`

Não introduzir outra estratégia de acesso a dados sem avaliar a arquitetura existente e, quando necessário, consultar Leonardo.

Por padrão, o acesso a dados deve permanecer encapsulado nos services existentes.

Componentes, layouts e páginas não devem acessar diretamente o cliente Supabase para executar operações de persistência. É fundamental existir um service apropriado.

## Formulários e validação

A aplicação de adultos utiliza:

* React Hook Form para gerenciamento de formulários;
* Valibot para validação;
* `@hookform/resolvers` para integração.

A decisão está documentada em:

`docs/decisions/0001-react-hook-form-and-valibot.md`

Preserve esse padrão para novos formulários da aplicação de adultos, salvo decisão arquitetural diferente.

## Estilização

A estilização utiliza UnoCSS.

A configuração compartilhada fica no root, principalmente em:

* `uno.config.ts`;
* `packages/ui/preset.ts`;
* `packages/ui/styles.css`.

Não duplicar configurações de UnoCSS entre as aplicações sem uma necessidade concreta.

## Modelo de negócio e outros aspectos

O modelo de negócio, bem como estratégias para implementação de features específicas, como routing, autenticação, etc. possuem decisões documentadas em `docs/decisions/`.

Quando uma alteração envolver esses assuntos, consulte o decision doc correspondente antes de propor uma mudança.

Não duplicar neste documento as regras de domínio contidas nesses prompts de decisão.

## Configuração e comandos

Comandos coordenados entre aplicações devem preferencialmente ser executados a partir do root.

Os scripts disponíveis no `package.json` são a referência para desenvolvimento, build, lint, formatação e type checking.

Exemplos:

```bash
npm run adults # equivalente ao "npm run dev" para a aplicação de adultos
npm run students # equivalente ao "npm run dev" para a aplicação de alunos

npm run build:adults
npm run build:students

npm run lint
npm run format
npm run check
npm run check:fix
npm run typecheck
```

Consulte os scripts atuais antes de assumir que um comando ou nome de script continua existindo.

## Regra geral

Antes de modificar o projeto:

1. identifique a aplicação ou package afetado;
2. consulte a implementação atual;
3. consulte os decision docs relacionados;
4. preserve as convenções existentes;
5. determine se a mudança é local ou arquitetural;
6. faça a menor alteração coerente com a arquitetura atual;
7. execute os checks relevantes.
