# Fluxo institucional do CodiGO! (3) — Administrar

A administração de uma escola está disponível aos usuários que possuem o cargo de administrador naquela escola.

A escola é sempre implícita nas telas administrativas, sendo determinada pelo contexto atual da aplicação.

## 1. Usuários

O administrador pode visualizar uma tabela contendo todos os usuários associados à escola.

Para cada usuário, são exibidos:

* nome;
* username;
* cargo;
* status.

O status indica se o usuário possui um vínculo ativo ou se existe um convite pendente. Os estados são apresentados, respectivamente, como **ativo** (`active`) e **pendente** (`pending`).

O administrador pode promover um professor a administrador ou rebaixar um administrador a professor.

Uma escola não pode ficar sem administradores. Portanto, quando existir apenas um administrador associado à escola, ele não pode ser rebaixado nem removido.

Para usuários com vínculo ativo, o administrador pode utilizar a ação **remover da escola**. A operação requer uma etapa de confirmação antes de ser efetivada.

Para usuários que ainda possuem um convite pendente, a ação disponível é **cancelar convite**. O cancelamento também deve exigir confirmação.

No topo da área de usuários existe a ação **convidar usuário**.

Para criar um convite, o administrador informa:

* username do usuário;
* cargo que será recebido.

O convite não pode ser criado caso o username informado não corresponda a um usuário existente.

Também não pode ser criado caso o usuário já possua qualquer vínculo com a escola, independentemente de esse vínculo estar ativo ou pendente.

## 2. Turmas

O administrador pode visualizar as turmas da escola em uma tabela.

Para cada turma, são exibidos:

* nome;
* código de acesso;
* indicação de atividade.

A indicação de atividade corresponde ao estado `is_playing` da turma.

A tela permite o CRUD físico completo das turmas. Operações sensíveis, especialmente exclusões, devem possuir uma etapa de confirmação antes de serem efetivadas.

O estado de atividade da turma não pode ser alterado a partir dessa tela.

Enquanto uma turma estiver em atividade, ela não pode ser editada.

Ao editar uma turma, um administrador pode escolher livremente o nome, mas apenas aleatorizar o código de acesso.

A partir da tabela de turmas, o administrador pode acessar a tela de gerenciamento de uma turma específica.

## 3. Turma (Alunos)

A tela de gerenciamento de uma turma apresenta seus alunos em uma tabela.

Para cada aluno, são exibidos:

* nome;
* código de identificação;
* ilustração correspondente ao código de acesso.

O código de identificação pode corresponder a uma matrícula ou a um identificador aleatório.

A ilustração correspondente ao código de acesso permanece inicialmente oculta e pode ser revelada por meio de uma ação específica da interface.

A tela permite o CRUD físico completo dos alunos. Operações sensíveis devem possuir uma etapa de confirmação antes de serem efetivadas.

O nome do aluno pode ser alterado livremente.

O código de acesso não pode ser editado arbitrariamente. Ele pode apenas ser aleatorizado novamente.

Um aluno também pode ser transferido para outra turma por meio de uma ação específica.

Quando uma entidade for excluída, suas dependências que fizerem parte de sua existência no domínio também serão excluídas em cascata. A aplicação deve, entretanto, preservar dados que pertençam a outros contextos do domínio e que não devam ser eliminados pela exclusão daquela entidade.

## 4. Escola

Os dados institucionais da escola são apenas visualizáveis.

Não existem operações administrativas para alterar esses dados dentro da aplicação e, consequentemente, não há necessidade de uma tela específica destinada exclusivamente ao gerenciamento da escola ou à visualização de seus dados.

Caso seja necessário alterar alguma informação institucional, o usuário deve entrar em contato com a equipe do CodiGO!.

A exigência de que esse contato seja realizado por alguém autorizado a representar a escola pertence ao relacionamento comercial e contratual entre a instituição e o CodiGO!, não constituindo uma regra do modelo de funcionamento da aplicação.

## 5. Regra geral

Todas as operações desta área são realizadas dentro do contexto de uma escola.

A escola não é selecionada individualmente nas telas administrativas. O contexto da escola é determinado pela navegação atual da aplicação.

Assim, as operações administrativas são sempre interpretadas como operações sobre a escola atualmente selecionada pelo usuário.

```text
Escola atual
│
├── Usuários
│   ├── convidar
│   ├── promover/rebaixar
│   ├── remover
│   └── cancelar convite
│
├── Turmas
│   ├── criar
│   ├── visualizar
│   ├── editar
│   └── excluir
│
│   └── Turma
│       └── Alunos
│           ├── criar
│           ├── visualizar
│           ├── editar
│           ├── transferir
│           └── excluir
│
└── Escola
    └── visualizar
```

A capacidade de realizar essas operações decorre do cargo de administrador no vínculo do usuário com a escola atual. Um usuário que seja administrador em uma escola e professor em outra possui essas capacidades somente enquanto estiver atuando no contexto da escola em que seu cargo é administrador.
