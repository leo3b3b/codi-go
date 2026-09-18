# Fluxo institucional do CodiGO! (1) — Acessar

## 1. Modelo B2B

O CodiGO! é uma aplicação B2B destinada a escolas. A entrada de uma nova instituição ocorre inicialmente fora do fluxo operacional da aplicação.

Uma escola pode conhecer o CodiGO! por meio de uma landing page ou outro canal de contato e entrar em contato com a equipe. A equipe realiza a negociação comercial e, após a contratação, cadastra a escola no sistema.

A criação da escola e a criação da conta do primeiro administrador são processos distintos.

O cadastro da escola é realizado pela equipe do CodiGO!. O primeiro administrador, por sua vez, precisa possuir uma conta de usuário adulto antes de ser associado à escola.

Essa separação é compatível com o modelo conceitual no qual `profile` e `school` são entidades independentes, relacionadas posteriormente pela associação `school_memberships`.

## 2. Criação de contas de adultos

A criação de contas de adultos utiliza o Supabase Auth.

O usuário fornece:

* email;
* senha.

Após o cadastro, o usuário deve confirmar seu endereço de email.

A autenticação é responsabilidade do mecanismo de autenticação, enquanto as informações de perfil utilizadas pela aplicação pertencem ao usuário no domínio do CodiGO!.

Depois da confirmação do email, no primeiro acesso, o usuário passa por um onboarding para completar seu perfil. Nesse momento, informa:

* nome de exibição;
* username.

O nome de exibição é utilizado para identificar o usuário na interface. O username funciona como identificador **único** da aplicação e pode ser alterado posteriormente, não sendo utilizado como chave primária.

O username deve obedecer à expressão regular:

```regex
^[a-z0-9._-]{3,30}$
```

Nesse estágio, possuir uma conta não significa possuir acesso a uma escola.

## 3. Associação do primeiro administrador

Depois que o usuário cria e confirma sua conta, a equipe do CodiGO! solicita seu email e username para identificá-lo.

A equipe então cria diretamente, pelo dashboard do Supabase, a associação entre o usuário e a escola, com cargo de administrador.

## 4. Usuário e vínculo institucional

O cargo não é uma característica global do usuário.

Um mesmo usuário pode atuar em diferentes escolas e possuir cargos diferentes em cada uma delas. O modelo de dados utiliza `school_memberships` justamente para representar essa relação. Assim, um usuário pode ser professor em uma escola e administrador em outra.

Para o CodiGO!, administrador é uma especialização funcional do professor: todo administrador possui as capacidades de professor, além das capacidades administrativas adicionais.

Como exemplo, um usuário associado a três escolas:

```text
Usuário
│
├── Escola A
│   └── Administrador
│
├── Escola B
│   └── Professor
│
└── Escola C
    └── Professor
```

Nesse caso, o usuário possui acesso às funcionalidades de professor nas três escolas e às funcionalidades administrativas somente na Escola A.

Não existe, portanto, um `role` global que determine a experiência do usuário. A autorização depende do vínculo entre o usuário e a escola no contexto em que ele está trabalhando.

## 5. Escola como contexto da aplicação

A aplicação utiliza a escola como contexto institucional.

A experiência do usuário deve determinar qual escola está sendo utilizada antes que as funcionalidades contextualizadas sejam apresentadas.

A relação pode ser representada conceitualmente como: *usuário → vínculos com escolas → escola atual → permissões naquele vínculo e funcionalidades disponíveis*.

Isso estabelece uma separação entre três conceitos:

- **Identidade:** quem é o usuário.
- **Contexto:** em qual escola o usuário está trabalhando.
- **Autorização:** quais operações ele pode realizar naquela escola.

## 6. Seleção da escola após o login

Depois da autenticação, o sistema consulta os vínculos institucionais disponíveis para o usuário.

O comportamento depende da quantidade de escolas às quais ele está associado.

Se o usuário não possui nenhuma escola associada, ele está autenticado, mas não possui contexto institucional. Esse estado deve ser tratado separadamente do estado de autenticação.

Se o usuário possui exatamente uma escola, essa escola é determinada automaticamente e o usuário é encaminhado diretamente para o dashboard da instituição.

Se o usuário possui duas ou mais escolas, o sistema apresenta uma tela de seleção de escola.

A tela de seleção pode apresentar, além da identificação da escola, o cargo exercido pelo usuário naquela instituição. Isso permite que um usuário que atue como administrador em uma escola e professor em outras reconheça claramente o contexto que está selecionando.

A seleção não determina as permissões. Ela apenas estabelece qual vínculo institucional será utilizado como contexto atual. As permissões continuam sendo determinadas pelo vínculo efetivo entre o usuário e a escola.

## 7. Escola representada na URL

Foi definida a **URL como representação do contexto atual da escola**.

Consequentemente, a escola corrente deve fazer parte da estrutura de navegação da aplicação.

Conceitualmente, as rotas contextualizadas assumem uma estrutura semelhante a:

```text
/:schoolId/dashboard
/:schoolId/turmas
/:schoolId/alunos
…
```

O identificador presente na URL representa o contexto que está sendo acessado. Ele não constitui, por si só, uma autorização.

Ao acessar uma URL contendo determinado `schoolId`, a aplicação deve verificar se existe um vínculo válido entre o usuário autenticado e aquela escola e, a partir desse vínculo, determinar suas permissões.

A utilização da URL como representação do contexto também permite que o contexto sobreviva ao recarregamento da página e seja preservado em navegação, histórico e links diretos.

## 8. Contexto, estado e persistência

A URL foi escolhida como representação principal do contexto institucional, em vez de manter `currentSchool` exclusivamente em estado interno da aplicação ou em armazenamento local.

Isso não impede que a aplicação mantenha informações derivadas do contexto em memória para facilitar o funcionamento da interface.

A distinção é que o estado interno não é a fonte primária da identificação da escola atual. O contexto pode ser reconstruído a partir da URL.
