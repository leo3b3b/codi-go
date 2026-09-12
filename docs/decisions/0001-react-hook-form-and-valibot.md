# ADR-0001: React Hook Form e Valibot

**Status:** Aceito

## Contexto

O CodiGO! possui e terá uma quantidade significativa de formulários, principalmente nos fluxos de autenticação, onboarding e funcionalidades administrativas de CRUD.

Inicialmente, os formulários utilizavam useState e validações implementadas manualmente nos componentes. Essa abordagem funciona para formulários simples, mas tende a aumentar a quantidade de código de controle de estado, tratamento de erros e regras de validação conforme os formulários se tornam mais complexos.

Além disso, algumas entradas do sistema, como importações de CSV, precisarão de validação em runtime fora do contexto de um componente React. Portanto, a solução de validação deve ser independente da camada de UI.

Foram consideradas abordagens como gerenciamento manual com React, React Hook Form, TanStack Form e diferentes bibliotecas de validação em runtime.

## Decisão

Adotar **React Hook Form** para gerenciamento do estado e ciclo de vida dos formulários e **Valibot** para definição e execução das validações em runtime.

A integração será feita por meio de `@hookform/resolvers/valibot`.

Os schemas Valibot devem permanecer independentes dos componentes React sempre que representarem regras de domínio ou validação reutilizáveis. Os tipos dos formulários devem, quando apropriado, ser derivados dos próprios schemas para evitar duplicação entre tipos e regras de validação.

A responsabilidade de cada camada será:

- **React Hook Form:** estado do formulário, registro dos campos, submissão, erros e estado de interação.
- **Valibot:** validação estrutural e semântica dos dados em runtime.
- **Services:** execução das operações de negócio, como integração com Supabase.
- **Supabase:** persistência e garantias de integridade no backend.

A validação realizada no frontend não será considerada mecanismo de segurança ou substituto para validações e restrições no backend.

Para fluxos que não são formulários React, como importação de CSV, os mesmos schemas Valibot poderão ser utilizados diretamente, seguindo um fluxo de parsing, validação, normalização e processamento independente do React Hook Form.

## Consequências

- Formulários terão uma estrutura mais consistente entre features.
- Validações deixam de ficar acopladas aos componentes React.
- Schemas podem ser reutilizados em fluxos como importação de CSV e outras entradas externas.
- Tipos podem ser derivados dos schemas, reduzindo duplicação.
- O tratamento de erros de campo e de submissão fica mais padronizado.
- React Hook Form adiciona uma dependência e uma abstração adicional ao projeto.
- Valibot adiciona uma dependência para validação em runtime.
- Desenvolvedores precisam conhecer tanto a API do React Hook Form quanto a do Valibot.
- A adoção não implica a criação imediata de uma abstração própria de formulários; padrões adicionais devem surgir apenas quando houver necessidade recorrente.
- Formulários existentes podem ser migrados gradualmente, sem exigir uma refatoração global imediata.