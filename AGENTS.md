# CodiGO! — Guia para Agentes

## Visão geral

O CodiGO! é um monorepo npm com duas aplicações frontend independentes e pacotes compartilhados:

* `apps/adults`: aplicação destinada a adultos, professores e administradores.
* `apps/students`: aplicação destinada aos alunos.
* `packages/`: código compartilhado entre as aplicações.

As aplicações são produtos independentes e possuem configuração, build e deploy próprios.

O projeto utiliza React, TypeScript, React Router e Supabase. A interface compartilhada fica em `@codi-go/ui` e o acesso ao Supabase fica em `@codi-go/supabase`.

## Estrutura e arquitetura

Não assuma que uma determinada pasta, arquivo ou organização interna continuará existindo. Antes de alterar código, inspecione a estrutura atual da aplicação ou pacote afetado.

As aplicações utilizam React Router com o tooling de framework fornecido por `@react-router/dev`. A configuração de rotas faz parte da própria aplicação e deve seguir os padrões estabelecidos pelo código atual.

Cada aplicação possui sua própria configuração de Vite e UnoCSS. O preset compartilhado de UnoCSS é fornecido por `@codi-go/ui`.

O código compartilhado entre aplicações deve permanecer em `packages/` quando houver uma necessidade real de compartilhamento. Evite mover código para um pacote compartilhado apenas para eliminar duplicação local.

## Acesso a dados

O cliente Supabase é disponibilizado por `@codi-go/supabase`:

```ts
import { supabase } from "@codi-go/supabase";
```

O acesso aos dados deve ser encapsulado em serviços. Componentes e páginas não devem realizar diretamente operações de persistência no Supabase.

Ao trabalhar com dados, consulte primeiro a implementação existente e `docs/decisions/0005-database.md` para entender as convenções do projeto.

Não altere a arquitetura de acesso a dados sem avaliar o impacto nas aplicações e nos pacotes compartilhados.

## Formulários

Na aplicação de adultos, formulários devem seguir o padrão estabelecido pelo projeto:

* React Hook Form;
* Valibot;
* `@hookform/resolvers`.

Antes de introduzir outra biblioteca ou padrão de formulário, verifique `docs/decisions/0001-react-hook-form-and-valibot.md`.

## UI e estilos

`@codi-go/ui` concentra recursos compartilhados de interface, incluindo componentes, estilos, imagens e configuração/preset de UnoCSS.

Quando uma necessidade de UI for compartilhada entre as aplicações, prefira os recursos existentes em `@codi-go/ui` antes de criar implementações paralelas.

Cada aplicação integra o UnoCSS usando o preset compartilhado. Respeite a configuração existente da aplicação afetada.

## TypeScript e dependências

O projeto utiliza TypeScript com configurações compartilhadas na raiz e configurações específicas por workspace quando necessário.

As dependências devem ser declaradas no workspace que realmente depende delas. Não adicione dependências à raiz apenas por conveniência.

Antes de adicionar uma biblioteca, verifique se o monorepo já possui uma solução equivalente.

## Decisões arquiteturais

As decisões específicas do projeto ficam em `docs/decisions/`.

Esses documentos são a fonte de referência para decisões arquiteturais e de domínio. Não replique seu conteúdo neste arquivo.

Antes de alterar uma área relevante, procure as decisões existentes relacionadas ao assunto. Atualmente, há decisões importantes relacionadas a:

* formulários;
* banco de dados e acesso a dados;
* deploy e roteamento;
* funcionalidades administrativas;
* turmas.

Quando uma mudança contradizer uma decisão existente, não simplesmente contorne a decisão no código. Avalie se a decisão continua válida e, se necessário, proponha sua revisão.

## Processo para alterações

Antes de implementar uma mudança:

1. Identifique a aplicação ou pacote afetado.
2. Inspecione a implementação atual e os padrões utilizados naquela área.
3. Procure decisões relevantes em `docs/decisions/`.
4. Determine se a mudança é local ou se altera uma convenção compartilhada.
5. Faça a menor alteração coerente com a arquitetura atual.

Não introduza abstrações, camadas ou pacotes compartilhados sem necessidade concreta.

Quando houver divergência entre este arquivo e o código atual, trate o código como a referência para a implementação. Este documento deve ser atualizado quando suas orientações deixarem de refletir o projeto.

## Princípios gerais

* Preserve os padrões já estabelecidos quando eles forem adequados.
* Evite mudanças arquiteturais disfarçadas de refactors locais.
* Não duplique lógica compartilhada sem uma justificativa clara.
* Considere segurança, manutenibilidade, performance e dívida técnica ao propor alterações.
* Questione decisões técnicas quando houver um motivo concreto para isso, apresentando os trade-offs.
* Diferencie claramente o que já existe no projeto de uma recomendação nova.
* Não assuma que a estrutura atual permanecerá estável; o código deve ser inspecionado antes de realizar alterações.
* Em caso de dúvida sobre uma decisão arquitetural, consulte os documentos em `docs/decisions/` antes de criar um novo padrão.
