# CodiGO!

O CodiGO! é uma aplicação web B2B para escolas, voltada ao desenvolvimento do pensamento computacional de crianças por meio de atividades interativas.

O monorepo possui duas aplicações frontend:

* `apps/adults` — aplicação para usuários adultos, principalmente administradores e professores;
* `apps/students` — aplicação para alunos.

Existem também packages compartilhados em `packages/`.

O comportamento do produto e suas regras de negócio podem evoluir. Antes de propor mudanças, considere o código atual e os decision docs relacionados.

## Como Trabalhar

* o usuário possui a palavra final sobre decisões arquiteturais;
* discuta trade-offs, segurança, manutenibilidade, desempenho e dívida técnica quando relevantes;
* questione decisões técnicas quando houver motivos concretos;
* apresente alternativas quando existirem;
* diferencie recomendações de decisões já tomadas;
* busque manter os padrões de projeto já estabelecidos.

## Repositório

O código-fonte está em:

`github.com/leo3b3b/codi-go`

O código existente é a referência para a estrutura atual. Este texto não deve ser tratado como mais atualizado que o repositório.

Antes de propor alterações que dependam da implementação atual, consulte os arquivos relevantes.

Não realizar operações de escrita no GitHub. Não criar, alterar ou excluir branches, commits, pull requests ou arquivos em nome do desenvolvedor.

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

Não substituir tecnologias existentes ou adicionar novas tecnologias sem justificativa técnica.

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

Cada aplicação atualmente organiza o código principalmente por:

```text
apps/<app>/
├── components/
├── layouts/
├── pages/
├── schemas/
├── services/
└── ...
```

Essa é a organização atual de referência para novas funcionalidades da aplicação.

Use:

* `pages/` para páginas;
* `layouts/` para estruturas de layout e navegação;
* `components/` para componentes reutilizáveis da aplicação;
* `schemas/` para schemas de validação;
* `services/` para lógica de integração e operações de negócio.
* `router/` para loaders, middlewares e outros componentes associados ao router, mas não o router em si.

Não criar novas camadas como `repositories/`, `data-access/` ou equivalentes sem uma decisão arquitetural explícita.

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

Não introduzir outra estratégia de acesso a dados sem avaliar a arquitetura existente.

Por padrão, o acesso a dados deve permanecer encapsulado nos services existentes.

Componentes, layouts e páginas não devem acessar diretamente o cliente Supabase para executar operações de persistência.

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

## Modelo de negócio

O modelo de negócio, bem como estratégias para implementação de features específicas, como routing, autenticação, etc. possuem decisões documentadas em `docs/decisions/`.

Quando uma alteração envolver esses assuntos, consulte o decision doc correspondente antes de propor uma mudança.

## Regra geral

Antes de modificar o projeto:

1. identifique a aplicação ou package afetado;
2. consulte a implementação atual;
3. consulte os decision docs relacionados;
4. preserve as convenções existentes;
5. determine se a mudança é local ou arquitetural;
6. faça a menor alteração coerente com a arquitetura atual;
7. execute os checks relevantes.
