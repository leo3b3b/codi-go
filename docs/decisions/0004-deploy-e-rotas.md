# 0004: Deploy e rotas

O CodiGO! possui duas aplicações frontend:

* `apps/adults`: aplicação para administradores e professores;
* `apps/students`: aplicação para alunos.

As aplicações devem ser tratadas como produtos frontend separados, com deployments independentes na Vercel. Como o projeto é um TCC desenvolvido para o contexto brasileiro, os endereços expostos aos usuários devem priorizar clareza, simplicidade e português brasileiro.

Para os deployments, considerar inicialmente:

```text
codigo-escola.vercel.app
codigo-alunos.vercel.app
```

A aplicação de adultos é chamada de `escola` no domínio porque seu contexto é institucional: ela atende tanto professores quanto administradores. O nome `adultos` descreve a idade dos usuários, mas não o propósito da aplicação.

A aplicação dos alunos deve utilizar `alunos`, evitando termos como `students` ou `kids` desnecessariamente.

Os nomes reais devem ser verificados na Vercel. Caso estejam indisponíveis, procurar variações curtas que preservem a mesma ideia e a marca CodiGO!.

## Rotas

As URLs devem utilizar português brasileiro quando representarem conceitos do produto:

```text
/login
/dashboard
/turmas
/alunos
/atividades
/jogos
/configuracoes
```

`/login` pode permanecer em inglês por ser uma expressão amplamente estabelecida no uso brasileiro.

Não é necessário traduzir conceitos puramente técnicos ou nomes internos do código apenas para manter consistência linguística. A preocupação é principalmente com as URLs expostas na navegação e com a UX que elas proporcionam.

As rotas também não precisam reproduzir a estrutura do monorepo. `adults` e `students` são nomes de aplicações no código, não necessariamente nomes de produto.

## Contexto da escola

Conforme definido anteriormente, a URL representa o contexto institucional atual. Rotas que dependem de uma escola devem preservar esse contexto, por exemplo:

```text
/:schoolId/dashboard
/:schoolId/turmas
/:schoolId/alunos
```

O `schoolId` identifica o contexto, mas não concede acesso. A autorização continua dependendo do vínculo do usuário com a escola.

Ao discutir deploy ou routing, considerar sempre a separação entre:

* **deployment**: qual aplicação está sendo acessada;
* **rota**: qual recurso ou funcionalidade está sendo acessado;
* **contexto**: em qual escola a operação ocorre;
* **autorização**: o que o usuário pode fazer naquele contexto.

Decisões de infraestrutura, domínio, routing ou organização do frontend devem preservar essa separação.
