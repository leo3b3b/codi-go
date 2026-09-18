# Contexto do CodiGO!

Este documento fornece o contexto essencial para trabalhar no projeto CodiGO!. Use-o como referência antes de propor alterações.

## 1. O que é o CodiGO!

O CodiGO! é uma aplicação web B2B voltada para escolas, criada para desenvolver o pensamento computacional de crianças de 7 a 11 anos por meio de jogos e atividades interativas.

O sistema possui três grupos principais:

* **Administradores:** gerenciam aspectos institucionais da escola e possuem as permissões de professores.
* **Professores:** acompanham turmas e alunos e utilizam os recursos pedagógicos da plataforma.
* **Alunos:** realizam atividades e jogos, enquanto seu desempenho é registrado para acompanhamento da evolução.

O objetivo do sistema não é apenas disponibilizar jogos. As atividades devem contribuir para o desenvolvimento de habilidades relacionadas ao pensamento computacional e permitir que educadores acompanhem o desempenho dos alunos.

O funcionamento do produto, suas regras de negócio e sua arquitetura podem evoluir durante o desenvolvimento. Quando houver código existente que contradiga este documento, investigue o estado atual do projeto antes de propor mudanças.

## 2. Equipe e forma de trabalho

Os chats de desenvolvimento são utilizados por Leonardo, Laura ou Vinicius.

### 2.1 Leonardo

Leonardo é o responsável técnico pelo desenvolvimento e possui o maior nível de experiência técnica da equipe. Ele é a principal referência para decisões de arquitetura e implementação e possui a palavra final sobre decisões arquiteturais do sistema.

Ao trabalhar com Leonardo:

* utilize linguagem técnica compatível com seu nível de conhecimento;
* discuta arquitetura, trade-offs, segurança, manutenibilidade, desempenho, escalabilidade e dívida técnica quando forem relevantes;
* não simplifique conceitos desnecessariamente;
* questione decisões técnicas quando houver motivos concretos para isso;
* apresente alternativas quando existirem abordagens razoáveis diferentes;
* diferencie claramente recomendações de decisões já tomadas;
* não trate uma solução como correta apenas por ser comum ou considerada uma boa prática;
* considere que Leonardo decide se uma mudança arquitetural deve ser adotada.

Você pode recomendar mudanças arquiteturais a Leonardo, mas não deve tratá-las como decisões já tomadas.

### 2.2 Laura e Vinicius

Laura e Vinicius atuam como desenvolvedores auxiliares. Ambos conseguem implementar funcionalidades completas utilizando IA como apoio, mas ainda estão desenvolvendo domínio sobre os conceitos envolvidos nas implementações.

Ao trabalhar com qualquer um dos dois:

* explique os conceitos necessários antes ou durante a implementação;
* explique o que deve ser alterado, onde e por quê (faça isso antes de alterar qualquer coisa);
* destaque dependências entre arquivos, componentes, serviços e outras partes do sistema;
* não entregue código complexo sem explicar sua finalidade quando isso for relevante para a compreensão;
* evite abstrações ou padrões avançados sem justificar sua necessidade;
* divida tarefas complexas em etapas menores quando isso facilitar a compreensão;
* indique como verificar se a alteração funcionou;
* sinalize quando uma decisão exigir avaliação de Leonardo;
* incentive a compreensão da solução em vez de simplesmente copiar e colar código.

Isso não significa assumir que Laura ou Vinicius sejam incapazes de trabalhar com assuntos avançados. Ajuste o nível da explicação conforme o conhecimento demonstrado durante a conversa.

#### Limites de autonomia

Laura e Vinicius devem seguir os padrões e tecnologias já adotados no projeto. Eles não devem introduzir novos padrões arquiteturais por conta própria.

Consulte Leonardo antes de:

* adicionar ou substituir bibliotecas, frameworks ou tecnologias;
* criar novas camadas, abstrações ou convenções;
* estabelecer novas estratégias de validação, estado, autenticação, autorização, persistência, APIs ou tratamento de erros;
* alterar significativamente a organização ou o fluxo de dados do sistema;
* fazer mudanças relevantes em segurança, Supabase, RLS ou estilização.

Uma biblioteca popular ou considerada uma boa prática não é, por si só, motivo para adotá-la.

Quando houver uma solução usando os padrões existentes, priorize-a. Se uma nova abordagem parecer melhor, explique o problema, as alternativas e o impacto, mas não a adote como padrão sem a decisão de Leonardo.

Na dúvida, preserve o padrão existente e consulte Leonardo.

### 2.3 Identificação do interlocutor

No início de uma nova conversa, identifique se você está trabalhando com Leonardo, Laura ou Vinicius. Se a pessoa já tiver informado quem é, não pergunte novamente. Se não estiver claro, pergunte antes de iniciar uma tarefa técnica. Não tente determinar a identidade com base no estilo de escrita, no nível das perguntas ou na complexidade da tarefa.

A identidade deve ser usada principalmente para ajustar:

* nível de detalhamento;
* terminologia;
* quantidade de contexto explicada;
* forma de apresentar decisões e trade-offs;
* grau de autonomia esperado.

A identidade não deve ser usada para presumir conhecimento específico. Uma pessoa pode ter conhecimento avançado sobre uma tecnologia mesmo que seu nível geral de desenvolvimento seja menor.

## 3. Estado do projeto e repositório

O código-fonte está no repositório:

`github.com/leo3b3b/codi-go`

Você pode consultar o repositório para entender o estado atual do projeto.

É especialmente recomendado consultar o repositório:

* ao iniciar uma nova conversa sobre desenvolvimento;
* quando não houver contexto suficiente sobre a implementação atual;
* quando o usuário informar que outros integrantes fizeram alterações;
* antes de propor alterações que dependam da estrutura atual do código.

### 3.1 Workflow de desenvolvimento

O projeto utiliza, como regra geral, uma branch por feature ou mudança significativa. Commits devem ser pequenos e focados, representando alterações logicamente relacionadas.

Ao orientar o desenvolvimento, especialmente com Laura ou Vinicius:

* recomende a criação ou utilização de uma branch específica para a feature ou mudança;
* incentive commits pequenos, coesos e com mensagens que descrevam claramente a alteração;
* evite acumular alterações não relacionadas no mesmo commit ou branch;
* use o histórico e as branches existentes no GitHub como referência para explicar o padrão utilizado pelo projeto.

Você pode consultar branches, commits, pull requests e outros elementos do repositório para entender ou demonstrar o workflow adotado pela equipe. Essas informações devem ser usadas como referência, não como regras imutáveis.

Você não deve realizar operações de escrita no GitHub. Não crie, altere ou exclua branches, commits, pull requests ou arquivos do repositório. Quando uma alteração precisar ser feita no GitHub, oriente o desenvolvedor sobre como fazê-la.

Não presuma que a estrutura descrita neste documento está mais atualizada que o código existente. Use o repositório para verificar a implementação atual.

## 4. Stack

A aplicação utiliza atualmente:

* React 19;
* TypeScript 7;
* Vite 8;
* React Router 8 (Data Mode);
* SupabaseJS 2.116;
* UnoCSS 66.10.

O projeto utiliza npm com npm workspaces para organizar as aplicações e packages.

Não substitua essas tecnologias sem uma justificativa técnica clara e sem considerar o impacto sobre o projeto.

## 5. Arquitetura do monorepo

O repositório contém múltiplas aplicações frontend independentes dentro de `apps/` e packages compartilhados dentro de `packages/`.

A estrutura atual é:

```text
codi-go/
├── apps/
│   └── (adults || students)/
│       ├── assets/
│       ├── features/
│       ├── pages/
│       ├── layouts/
│       ├── main.tsx
│       ├── index.html
│       ├── styles.css
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── supabase/
│       ├── index.ts
│       └── package.json
│
├── .env.local
├── package.json
├── package-lock.json
├── vite.config.ts
├── uno.config.ts
├── tsconfig.json
├── tsconfig.base.json
└── tsconfig.node.json
```

As aplicações são projetos npm independentes dentro do mesmo repositório:

* `apps/adults` — aplicação destinada aos usuários adultos: administradores e professores;
* `apps/students` — aplicação destinada aos alunos.

Cada aplicação possui seu próprio `package.json`, scripts e `tsconfig.json`, mas compartilha o tooling principal definido no root do repositório.

Os packages em `packages/` representam dependências compartilhadas entre aplicações. Eles só devem ser criados quando existir uma fronteira de compartilhamento real.

Não crie antecipadamente packages genéricos como `packages/shared` ou `packages/utils` sem uma necessidade concreta.

### 5.1 Aplicações não possuem `src/`

Cada aplicação possui seu próprio diretório como source root.

Por exemplo:

```text
apps/adults/
├── features/
├── pages/
├── layouts/
├── lib/
├── main.tsx
└── index.html
```

e não:

```text
apps/adults/
└── src/
    ├── features/
    ├── pages/
    └── main.tsx
```

Portanto, ao adicionar código específico de uma aplicação, coloque-o diretamente em `apps/*/` ou `packages/*/`, de acordo com a aplicação.

Não crie um novo `src/` dentro de uma aplicação.

### 5.2 Configuração compartilhada

React, TypeScript, Vite e UnoCSS utilizam uma configuração centralizada no root sempre que não houver uma divergência real entre as aplicações.

Os principais arquivos compartilhados são:

* `vite.config.ts`;
* `uno.config.ts`;
* `tsconfig.base.json`;
* `tsconfig.node.json`;
* `package.json`.

As aplicações possuem apenas a configuração específica necessária para representar seu próprio contexto.

Não duplique configurações de tooling entre `apps/adults` e `apps/students` sem uma necessidade concreta.

A existência de duas aplicações não significa que cada uma deva possuir uma configuração completamente independente.

### 5.3 npm workspaces

O root do projeto define os workspaces:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

Os comandos que precisam coordenar as aplicações devem ser executados preferencialmente a partir do root.

Exemplos:

```bash
npm run adults # "npm run dev" para a aplicação de adultos
npm run students # "npm run dev" para a aplicação de estudantes
npm run build:adults
npm run build:students
npm run lint
npm run typecheck
```

Também é possível executar scripts diretamente em um workspace utilizando os comandos do npm.

As dependências devem ser declaradas no `package.json` do workspace que realmente depende delas.

Dependências específicas de uma aplicação não devem ser promovidas para o root apenas para facilitar imports ou instalação.

Ferramentas compartilhadas de desenvolvimento, como TypeScript, Vite, UnoCSS e plugins de build, permanecem no root quando são utilizadas pelo tooling comum.

### 5.4 Packages compartilhados

Packages compartilhados ficam em `packages/`.

Por exemplo, o package atual de Supabase é:

```text
packages/supabase/
├── index.ts
└── package.json
```

Ele expõe o cliente compartilhado utilizado pelas aplicações.

Como apps, o package não possui `src/`. O mesmo princípio vale para novos packages, salvo se uma decisão arquitetural futura estabelecer outro padrão.

Uma aplicação deve consumir o package pelo nome público:

```ts
import { supabase } from '@codi-go/supabase';
```

Não importe diretamente arquivos internos de outro workspace quando existir uma API pública definida pelo `package.json` do package.

### 5.5 Dependências específicas de cada aplicação

A separação das aplicações também permite que cada uma possua dependências específicas.

Por exemplo, ferramentas utilizadas exclusivamente por adultos para formulários e validação podem permanecer em `apps/adults/package.json`:

* `react-hook-form`;
* `@hookform/resolvers`;
* `valibot`.

Não adicione essas dependências a `apps/students` ou ao root enquanto elas não forem necessárias nesses contextos.

O fato de o npm fazer hoisting ou deduplicação de dependências não muda a responsabilidade de cada `package.json`.

## 6. Organização do código

O projeto utiliza uma organização baseada em funcionalidades.

Quando uma funcionalidade possuir múltiplos arquivos relacionados, eles devem ficar agrupados em:

```text
features/
└── <feat>/
    ├── <arquivos relacionados, como feat.service.ts, feat.types.ts, etc.>
    └── index.ts
```

O `index.ts` da feature funciona como ponto de reexportação público.

Exemplo:

```ts
// features/auth/index.ts

export * from './auth.service';
```

Ao importar funcionalidades de outros módulos, prefira utilizar o ponto de entrada da feature quando isso fizer sentido, em vez de acessar diretamente arquivos internos.

As mesmas convenções de organização de features podem ser utilizadas nas diferentes aplicações, mas uma feature pertence à aplicação em que sua responsabilidade existe.

O projeto possui o alias `@`, que aponta para a raiz da aplicação corrente.

Em `apps/adults`, por exemplo:

```ts
import { signInWithPassword } from '@/features/auth';
```

Nesse contexto, `@` aponta para:

```text
apps/adults/
```

Em `apps/students`, `@` aponta para:

```text
apps/students/
```

Além de `features/`, a organização das aplicações também utiliza diretórios com responsabilidades gerais, como:

* `pages/` — páginas associadas às rotas;
* `types/` — tipos da aplicação;
* `assets/` — recursos estáticos;
* `layouts/` — layouts da aplicação.

Antes de criar uma nova pasta ou padrão de organização, verifique como o projeto já organiza responsabilidades semelhantes.

## 7. Estilização

A estilização utiliza UnoCSS.

A configuração é compartilhada entre as aplicações através do `uno.config.ts` localizado no root do monorepo.

A configuração utiliza principalmente:

* `presetWind4`;
* `presetIcons`;
* `transformerDirectives`;
* `transformerVariantGroup`;
* configurações de `theme`;
* classes de atalho definidas no package de UI com `--at-apply:`.

Os arquivos relacionados à configuração global de estilização são:

* `uno.config.ts`;
* o package `@codi-go/ui`, editável nos arquivos `preset.ts` e `styles.css`.

O `presetIcons` possui configuração adicional para manter os ícones alinhados ao comportamento esperado pela interface:

```ts
presetIcons({
  extraProperties: {
    display: 'inline-block',
    'vertical-align': 'middle',
  },
})
```

A estilização global utiliza variáveis CSS e utilitários do UnoCSS. Um exemplo do padrão utilizado é:

```css
:root {
  color-scheme: light dark;
  --color-bg: light-dark(oklch(90% 0 none), oklch(20% 0 none));
  --color-fg: light-dark(#111111, #ffffff);
  --color-primary: oklch(70% 0.18 306);
  --color-muted: light-dark(#6b7280, #9ca3af);
}

/* Exemplo de componente CSS fictício */
.button {
  @apply bg-primary text-white;
}
```
