# Fluxo institucional do CodiGO! (4) — Turmas

## 1. Turma

A turma é a principal unidade de organização dos estudantes no CodiGO!.

O produto é voltado às escolas dos anos iniciais do ensino fundamental, nas quais uma turma normalmente possui um professor responsável que acompanha os estudantes e conduz as atividades pedagógicas.

Por isso, uma turma possui um único professor responsável no contexto do CodiGO!.

Não existe uma associação de múltiplos professores com uma turma para representar diferentes disciplinas. Professores de componentes específicos, como Artes e Educação Física, não fazem parte do fluxo operacional do CodiGO!.

## 2. Professor responsável

O professor responsável por uma turma é quem possui acesso operacional àquela turma.

Um professor pode ser responsável por várias turmas da mesma escola.

Uma turma, por sua vez, possui apenas um professor responsável.

A relação pode ser representada conceitualmente como:

```text
Escola
│
├── Professor A
│   ├── Turma 1
│   └── Turma 2
│
├── Professor B
│   └── Turma 3
│
└── Administrador C
    └── Turma 4
```

A alteração do professor responsável transfere a responsabilidade operacional pela turma para o novo professor.

Não existe um conceito próprio de professor substituto no modelo. Uma substituição prolongada pode ser representada pela alteração do professor responsável pela turma. Ausências pontuais não exigem uma alteração no vínculo da turma.

## 3. Acesso do professor

Um professor possui acesso operacional somente às turmas pelas quais é responsável.

A existência de um vínculo do usuário com a escola não concede, por si só, acesso operacional a todas as turmas daquela escola.

Assim, a seleção de turmas de um professor corresponde às turmas sob sua responsabilidade.

O professor pode, dentro dessas turmas, utilizar as funcionalidades destinadas à operação pedagógica da turma, incluindo a execução das atividades disponibilizadas pelo CodiGO!.

Assim como acontece com escolas, a tela de seleção de turma é pulada caso o usuário tenha responsabilidade por apenas uma turma.

## 4. Acesso do administrador

O administrador possui acesso de leitura a todas as turmas da escola, independentemente do professor responsável por cada uma delas.

O administrador não precisa ser o professor responsável por uma turma para visualizar seus dados.

Essa regra permite que a administração acompanhe a escola como um todo sem transformar o administrador em professor responsável de todas as turmas.

O acesso administrativo às turmas é, portanto, distinto do acesso operacional do professor:

```text
Professor
└── acesso operacional
    └── suas turmas

Administrador
└── acesso de leitura
    └── todas as turmas
```

## 5. Criação e gerenciamento

Turmas pertencem a uma escola e são administradas dentro do contexto daquela escola.

Um administrador pode criar, visualizar, editar e excluir turmas.

A criação de uma turma **não inclui** a definição de seu professor responsável. Uma turma, a qualquer momento, pode não ter um professor responsável.

A alteração do professor responsável transfere o acesso operacional da turma para o novo professor.

A exclusão de uma turma é uma operação física e deve exigir confirmação explícita antes de ser realizada.

Quando existirem entidades que dependam da existência da turma, sua remoção seguirá as regras de exclusão em cascata estabelecidas para o domínio.

## 6. Atividade da turma

Uma turma pode estar ou não em atividade.

O estado de atividade representa que uma atividade do CodiGO! está sendo executada naquela turma.

O professor responsável pode iniciar e pausar a atividade da turma de acordo com as funcionalidades do produto.

O estado de atividade não pode ser alterado a partir da tela de gerenciamento administrativo da turma.

Enquanto uma turma estiver em atividade, ela não pode ser editada.

A administração da configuração da turma e a operação de uma atividade são, portanto, responsabilidades distintas.

## 7. Código de acesso

Cada turma possui um código de acesso alfabético aleatório utilizado para gerar o link de acesso para realização de atividades.

O código pode ser visualizado pelos usuários que possuem acesso à administração da turma ou que são responsáveis por ela.

Sua alteração ocorre por meio da geração de um novo código, e não pela edição arbitrária de seu valor.

A alteração do código deve ser tratada como uma operação sensível e exigir confirmação quando aplicável.

## 8. Escopo do modelo

O modelo de turmas é intencionalmente orientado aos anos iniciais do ensino fundamental.

O CodiGO! não pretende, neste momento, representar a estrutura completa de atribuição de docentes típica dos anos finais, na qual diferentes professores podem lecionar diferentes disciplinas para diferentes turmas.

Da mesma forma, não há necessidade de representar professores substitutos como uma categoria própria de relacionamento.

Caso o escopo do produto seja ampliado futuramente para outros segmentos escolares, o modelo de turmas poderá ser revisitado.

Até que isso ocorra, a relação simples entre **turma e professor responsável** é suficiente para representar o funcionamento previsto do CodiGO!.
