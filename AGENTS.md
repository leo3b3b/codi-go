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

Não substitua essas tecnologias sem uma justificativa técnica clara e sem considerar o impacto sobre o projeto.

## 5. Supabase

O Supabase é utilizado como backend da aplicação, incluindo autenticação e banco de dados PostgreSQL.

Você pode tentar utilizar o conector do Supabase para verificar o estado atual do projeto (usando consultas somente de leitura), consultar dados ou entender a estrutura existente.

Operações que alterem a estrutura do banco ou outros aspectos estruturais do Supabase (consultas de escrita) exigem aprovação do Leonardo antes de serem executadas.

Isso inclui, por exemplo:

* criação ou remoção de tabelas;
* alteração de colunas;
* alteração de constraints;
* criação ou remoção de relacionamentos;
* alterações estruturais relevantes em funções, triggers ou políticas;
* mudanças que possam afetar a arquitetura do banco.

RLS e outras proteções do Supabase estarão desativadas deliberadamente durante o desenvolvimento para facilitar iteração, testes e inspeção. Isso é um estado de desenvolvimento, não uma decisão arquitetural para produção.

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

O projeto possui o alias `@`, que aponta para `src/`.

Exemplo:

```ts
import { signInWithPassword } from '@/features/auth';
```

Além de `features/`, a organização do projeto também utiliza diretórios com responsabilidades gerais, como:

* `pages/` — páginas associadas às rotas;
* `types/` — tipos compartilhados;
* `assets/` — recursos estáticos;
* outros diretórios existentes no projeto.

Antes de criar uma nova pasta ou padrão de organização, verifique como o projeto já organiza responsabilidades semelhantes.

## 7. Estilização

A estilização utiliza UnoCSS.

A configuração utiliza principalmente:

* `presetWind4`;
* `presetIcons`;
* `transformerDirectives`;
* `transformerVariantGroup`;
* configurações de `theme`.

Os principais arquivos relacionados à estilização global são:

* `uno.config.ts`;
* `src/index.css`.

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

Respeite o sistema de estilos existente antes de introduzir CSS isolado, bibliotecas de componentes ou outro mecanismo de estilização.

## 8. Funcionamento geral do CodiGO!

O CodiGO! é uma plataforma educacional utilizada por escolas.

O fluxo geral do sistema separa:

* a identidade do usuário;
* sua relação com uma escola;
* suas permissões;
* as funcionalidades disponíveis para cada perfil.

Adultos podem atuar em uma ou mais escolas. Ser professor ou administrador é uma relação com uma escola, e não uma característica global da conta.

Administradores possuem as permissões dos professores e capacidades adicionais de administração, como CRUD de alunos e turmas, além de convidar novos usuários como membros da instituição.

Alunos pertencem ao contexto escolar e utilizam a plataforma principalmente para realizar jogos e atividades.

As atividades devem permitir registrar informações relevantes sobre o desempenho do aluno, como resultado, tentativas, tempo ou outras métricas necessárias para acompanhar sua evolução.

A plataforma deve manter a distinção entre funcionalidades administrativas, pedagógicas e atividades destinadas aos alunos.

Este documento descreve apenas o funcionamento geral. Regras específicas de negócio devem ser verificadas no código, no banco e nas decisões mais recentes da equipe antes de serem assumidas como definitivas.

## 9. Regras para trabalhar no projeto

Antes de propor uma alteração significativa:

1. verifique o código existente;
2. identifique como funcionalidades semelhantes são implementadas;
3. preserve os padrões já adotados quando forem adequados;
4. evite adicionar dependências ou abstrações sem necessidade;
5. considere o impacto da alteração nas outras partes do sistema;
6. se a alteração envolver uma decisão arquitetural relevante, sinalize para Leonardo.

Nunca trate uma sugestão ou exemplo gerado anteriormente como uma decisão definitiva do projeto. O estado atual do código e as decisões explícitas da equipe têm prioridade.

### Regra de preservação arquitetural

Ao trabalhar em algo, trate o padrão existente do projeto como a escolha padrão até que Leonardo decida de forma diferente.

Não introduza novos padrões, dependências, abstrações ou tecnologias apenas porque parecem melhores, mais modernas ou mais convenientes.

Você pode sugerir mudanças arquiteturais, mas deve separá-las da implementação solicitada e deixar claro quando dependem de decisão de Leonardo.

Se uma mudança puder estabelecer um novo padrão para o projeto, consulte Leonardo antes de adotá-la.

Essa regra se aplica mesmo quando a mudança afetar inicialmente apenas uma feature.

## 10. Início de uma conversa

Ao iniciar uma nova conversa de desenvolvimento:

1. Identifique se você está trabalhando com Leonardo, Laura ou Vinicius.
2. Entenda o objetivo inicial do desenvolvedor antes de propor uma implementação.
3. Consulte o repositório `github.com/leo3b3b/codi-go` para verificar o estado atual do código, branches e padrões recentes de desenvolvimento. Identifique também decisões em `docs/decisions/` que possam influenciar a tarefa, caso existam.
4. Se a tarefa envolver banco de dados, autenticação ou outra funcionalidade dependente do Supabase, consulte também o estado atual do projeto no Supabase quando isso for necessário.
5. Depois das verificações necessárias, proponha a abordagem ou comece a implementação.

Se o desenvolvedor informar que o repositório ou o banco foram alterados recentemente, dê prioridade à verificação do estado atual antes de utilizar informações de conversas anteriores.

Não repita verificações que já tenham sido realizadas e ainda sejam válidas dentro da mesma conversa.