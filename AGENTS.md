# CodiGO! — Guia para Agentes

## Visão geral

O CodiGO! é um monorepo npm organizado em workspaces:

* `apps/adults`: aplicação para adultos, professores e administradores.
* `apps/students`: aplicação para alunos.
* `packages/`: pacotes compartilhados pelas aplicações.

As aplicações são independentes, com configuração, execução e build próprios. O workspace raiz fornece scripts para executar, validar e gerar builds de cada aplicação.

O projeto utiliza React, TypeScript, React Router com o tooling de framework de `@react-router/dev`, Vite e Supabase.

Os principais pacotes compartilhados atualmente são:

* `@codi-go/ui`: recursos de interface compartilhados.
* `@codi-go/supabase`: cliente Supabase tipado e utilidades relacionadas.

## Estrutura das aplicações

Cada aplicação mantém sua própria organização interna.

### `apps/adults`

A aplicação de adultos atualmente contém:

* `components/`: componentes específicos da aplicação.
* `forms/`: formulários reutilizáveis dentro da aplicação.
* `layouts/`: layouts do React Router.
* `middlewares/`: middlewares de rota, incluindo proteção de autenticação.
* `pages/`: páginas e telas, organizadas também por área funcional.
* `schemas/`: schemas utilizados pelas funcionalidades da aplicação.
* `services/`: acesso aos dados e regras de interação com os serviços da aplicação.
* `games/`: código relacionado aos jogos utilizados pela aplicação.

Não mova código para `packages/` apenas para reduzir duplicação local. Um pacote compartilhado deve existir quando houver uma necessidade real de compartilhamento entre aplicações.

### `apps/students`

A aplicação de alunos atualmente contém:

* `components/`: componentes específicos da aplicação.
* `engine/`: lógica de execução dos jogos.
* `layouts/`: layouts do React Router.
* `middlewares/`: middlewares de rota e validação da sessão do aluno.
* `pages/`: telas da aplicação.
* `services/`: acesso aos dados e serviços da aplicação.
* `types/`: tipos específicos da aplicação.

A lógica do jogo do labirinto permanece local à aplicação de alunos. O mecanismo do jogo fica em `engine/`, enquanto o acesso aos níveis e ao progresso fica em `services/`.

## React Router

As duas aplicações utilizam o modo framework do React Router.

Cada aplicação possui:

* `react-router.config.ts`;
* `routes.ts`;
* `root.tsx`;
* `entry.client.tsx`.

A configuração atual utiliza `ssr: false`. As rotas são declaradas em `routes.ts` e organizadas usando layouts aninhados, `route`, `index` e `prefix`.

Loaders e middlewares específicos de uma rota permanecem próximos da implementação da rota. É comum encontrar `clientLoader`, `clientMiddleware` e `shouldRevalidate` diretamente em layouts ou páginas.

Os tipos gerados pelo React Router fazem parte da configuração de TypeScript das aplicações. Não remova o suporte ao diretório `.react-router/types`.

Cada aplicação também possui o alias TypeScript `@/*`, apontando para a raiz da própria aplicação.

## Interface e estilos

A camada de UI compartilhada atualmente é baseada em Mantine.

`@codi-go/ui`:

* reexporta `@mantine/core`;
* reexporta `@mantine/hooks`;
* exporta o tema compartilhado em `theme.ts`;
* exporta os estilos globais em `styles.css`;
* contém customizações compartilhadas dos componentes Mantine utilizados pelo projeto.

As aplicações normalmente importam os recursos de interface através de:

```ts
import * as UI from "@codi-go/ui";
```

O tema compartilhado deve ser usado através do `MantineProvider` no `root.tsx` de cada aplicação.

Os estilos globais compartilhados são carregados por:

```ts
import "@codi-go/ui/styles.css";
```

O tema atual define, entre outras coisas, a identidade visual baseada em tons de violeta e os defaults compartilhados de componentes como `Paper`, `Divider`, `TextInput`, `PasswordInput` e `Button`.

Não introduza novamente UnoCSS, presets de UnoCSS ou componentes paralelos para substituir recursos que já são fornecidos pelo Mantine e por `@codi-go/ui`.

Os ícones usados nas aplicações são fornecidos por `lucide-react`.

## PostCSS

O processamento de CSS usa PostCSS com a configuração fornecida por `@codi-go/ui`.

Cada aplicação possui seu próprio `postcss.config.cjs`, que delega a configuração ao pacote compartilhado.

A configuração atual não utiliza arquivos `uno.config.ts`.

## Assets públicos

Os assets estáticos compartilhados pelas aplicações ficam em `public/` na raiz do monorepo.

Entre eles estão:

* logo e elementos visuais do CodiGO!;
* imagens do personagem Codi;
* imagens usadas como credenciais dos alunos;
* sprites e tiles utilizados pelo labirinto.

As configurações de Vite das duas aplicações apontam `publicDir` para esse diretório compartilhado. Portanto, assets desse diretório são referenciados diretamente por caminhos como `/logo.png` e `/tiles/goal.png`.

Não crie cópias dos assets compartilhados dentro de cada aplicação sem necessidade concreta.

## Acesso ao Supabase

O pacote `@codi-go/supabase` fornece:

```ts
import { supabase } from "@codi-go/supabase";
```

Além do cliente tipado, o pacote fornece os tipos derivados do banco e utilidades compartilhadas, como as credenciais de imagem dos alunos.

A interação da aplicação com dados de negócio é organizada principalmente nos diretórios locais `services/` de cada aplicação. Páginas e componentes normalmente consomem funções desses serviços em vez de concentrar consultas e mutações no componente.

Os serviços podem utilizar diretamente o cliente fornecido por `@codi-go/supabase`.

A definição TypeScript do banco fica em:

```text
packages/supabase/database.types.ts
```

Quando for necessário trabalhar com tipos do banco, prefira os tipos exportados pelo pacote em vez de criar duplicações locais sem necessidade.

## Autenticação e sessão

A aplicação de adultos utiliza a autenticação do Supabase. A proteção das áreas autenticadas é implementada por middleware do React Router em `apps/adults/middlewares/`.

A aplicação de alunos possui um modelo de sessão próprio. A identificação do aluno é mantida no navegador usando `sessionStorage`, e o middleware `requireSession` valida a sessão em relação à turma acessada.

Não trate a autenticação das duas aplicações como se fosse necessariamente o mesmo fluxo.

## Dados e estado de página

As páginas seguem predominantemente o modelo do React Router:

* obtenção inicial de dados por `clientLoader`;
* acesso aos dados carregados através de `useLoaderData`;
* navegação através das APIs do React Router;
* revalidação através de `useRevalidator` quando uma mutação exige atualização dos dados.

Antes de introduzir uma solução global de estado ou um novo mecanismo de fetching, verifique primeiro se a funcionalidade pode seguir o padrão já utilizado pela aplicação afetada.

## Configuração e dependências

As dependências devem pertencer ao workspace que realmente as utiliza.

A raiz contém as configurações compartilhadas de TypeScript e Biome, mas cada aplicação mantém sua configuração específica quando necessário.

Não adicione dependências à raiz apenas por conveniência.

Antes de adicionar uma biblioteca, verifique se o monorepo já possui uma solução adequada para o mesmo problema.

## Processo para alterações

Antes de modificar uma área:

1. Identifique a aplicação ou pacote afetado.
2. Inspecione a estrutura e a implementação atual daquela área.
3. Procure usos existentes da mesma solução antes de criar uma nova.
4. Verifique os arquivos relacionados em `docs/decisions/` quando a mudança envolver uma decisão arquitetural.
5. Determine se a mudança é local à aplicação ou realmente compartilhável.
6. Apresente o passo-a-passo da menor alteração coerente com a arquitetura existente.

Não assuma que a estrutura descrita neste arquivo continuará estável. O código atual deve ser inspecionado antes de realizar alterações.

Quando este guia divergir do código efetivamente presente no repositório, trate o código como referência para a implementação e atualize este guia quando necessário.

## Princípios gerais

Preserve os padrões existentes quando eles forem adequados ao problema.

Evite refactors arquiteturais disfarçados de alterações locais.

Evite duplicar código entre `apps/` quando existir uma necessidade real de compartilhamento, mas não transforme código específico de uma aplicação em pacote compartilhado sem justificativa.

Não reintroduza tecnologias, abstrações ou estruturas que já foram removidas da implementação atual.

Considere segurança, manutenibilidade, performance e dívida técnica ao propor alterações.

Diferencie claramente padrões já existentes no código de novas recomendações.
