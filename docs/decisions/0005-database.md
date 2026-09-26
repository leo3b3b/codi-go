# Banco de dados e acesso a dados

**Status:** Aceito

## Decisões

1. O CodiGO! utiliza Supabase como backend e o cliente compartilhado é consumido através de `@codi-go/supabase`.

2. O acesso ao banco deve ser encapsulado em services. Queries, mutations e chamadas a RPC do Supabase devem ficar, por padrão, em arquivos `services/*.ts`.

3. Páginas, componentes e layouts nunca devem executar queries diretamente nem importar o cliente do Supabase para acesso a dados da aplicação.

Exemplo:

```text
services/
  ├── students.ts
  ├── auth.ts
  └── index.ts
```

```ts
// services/students.ts
import { supabase } from '@codi-go/supabase';

export async function getStudentsByClass(classId: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('class_id', classId);

  if (error) throw error;

  return data;
}
```

O consumidor utiliza:

```ts
import { getStudentsByClass } from '@/services';
```

e não acessa `supabase.from(...)` diretamente.

## Segurança e schema

Alterações em RLS, policies, autenticação, autorização ou schema do banco devem seguir o mecanismo de migrations adotado pelo projeto e exigem avaliação arquitetural do usuário quando representarem mudança relevante.

## Diretriz para novos casos

Antes de introduzir uma nova forma de acesso ao banco, verificar este documento e o código existente. Não criar novas camadas de persistência, repositórios ou abstrações equivalentes sem uma decisão arquitetural explícita.
