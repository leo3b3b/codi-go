# Fluxo institucional do CodiGO! (2) — Escola

## 1. Escola

A escola é a instituição que utiliza o CodiGO! no contexto B2B.

Uma escola possui identificação institucional, incluindo:

* CNPJ;
* razão social;
* nome fantasia.

A escola também possui um estado de atividade que determina se a instituição está atualmente ativa no CodiGO!.

O cadastro inicial da escola é realizado pela equipe do CodiGO!, conforme definido no fluxo de entrada institucional.

## 2. Visibilidade das informações da escola

As informações institucionais que identificam uma escola são visíveis para qualquer usuário que possua um vínculo com ela, seja esse vínculo pendente ou ativo.

A visualização dessas informações não depende do cargo exercido pelo usuário.

Assim, professores e administradores associados à mesma escola, bem como os convidados a participar, podem consultar sua identificação institucional, incluindo CNPJ, razão social e nome fantasia.

A diferença entre professor e administrador está relacionada às operações que cada um pode realizar, e não à visibilidade básica dos dados da escola.

## 3. Vínculo entre usuário e escola

O vínculo entre um usuário e uma escola representa a participação daquele usuário na instituição.

Esse vínculo é contextual à escola e possui um cargo.

Um usuário pode possuir vínculos com várias escolas simultaneamente e exercer cargos diferentes em cada uma delas.

Os cargos disponíveis são:

* professor;
* administrador.

O administrador possui todas as capacidades de professor, além das capacidades administrativas adicionais.

Não existe, portanto, uma relação global de usuário com uma única escola ou um único cargo. Cada vínculo representa a atuação daquele usuário em uma instituição específica.

## 4. Primeiro administrador

O primeiro administrador de uma escola é associado pela equipe do CodiGO!.

Esse vínculo inicial é criado depois que o usuário já possui uma conta de adulto e foi identificado pela equipe.

A associação inicial estabelece o usuário como administrador da escola.

A partir desse momento, a gestão dos demais vínculos pode ser realizada pelos administradores da própria instituição.

## 5. Convites para uma escola

Um administrador pode convidar um usuário para participar da escola.

O convite é direcionado a um username específico e é recebido dentro do próprio CodiGO!.

O usuário convidado visualiza as informações necessárias para reconhecer a instituição e a origem do convite, incluindo:

* escola que realizou o convite;
* usuário que realizou o convite;
* cargo que será recebido;
* opção para aceitar o convite.

O convite não cria imediatamente um vínculo institucional ativo.

Enquanto aguarda a decisão do usuário, o vínculo encontra-se pendente.

## 6. Aceitação e recusa de convites

Um convite pendente pode ser aceito ou recusado pelo usuário convidado.

Ao aceitar o convite, o vínculo passa a estar ativo e o usuário passa a possuir acesso à escola de acordo com o cargo recebido.

Ao recusar o convite, o vínculo pendente deixa de existir.

A ausência do vínculo após uma recusa permite que a escola possa realizar um novo convite ao mesmo usuário posteriormente.

Não é necessário manter, no vínculo atual, um estado permanente representando uma recusa ou uma revogação quando não existe mais uma relação vigente entre o usuário e a escola.

Assim, o modelo distingue:

```text
Usuário sem vínculo
        │
        └── convite ──→ vínculo pendente
                              │
                    ┌─────────┴─────────┐
                    │                   │
                 aceitar             recusar
                    │                   │
                    ↓                   ↓
             vínculo ativo          sem vínculo
```

## 7. Gestão dos vínculos

Administradores podem gerenciar os usuários associados à escola.

Um administrador pode alterar o cargo de outro usuário dentro daquela escola.

Como o administrador possui as capacidades de professor, um usuário não precisa acumular múltiplos cargos simultaneamente no mesmo vínculo.

Um administrador também pode remover um usuário da escola.

A remoção encerra o vínculo daquele usuário com a instituição. Ela não implica a exclusão da conta do usuário nem altera sua participação em outras escolas.

## 8. Histórico da escola

A permanência de um usuário como membro da escola não determina a existência dos dados históricos produzidos no contexto institucional.

A remoção de um professor, portanto, não remove o histórico da escola nem os dados que já foram produzidos no contexto daquela instituição.

O vínculo representa a participação atual do usuário na escola, enquanto os dados históricos pertencem aos contextos e entidades aos quais efetivamente se referem.

A exclusão de um vínculo não deve ser interpretada como exclusão dos dados históricos relacionados à escola.

## 9. Escola inativa

Uma escola pode deixar de estar ativa no CodiGO!.

A alteração do estado da escola pode ocorrer por solicitação de um administrador, mas a efetivação da mudança é realizada pela equipe do CodiGO!.

A desativação pode ocorrer por diferentes motivos institucionais, incluindo solicitação da própria escola, questões contratuais ou irregularidades relacionadas à contratação.

A desativação da escola não implica exclusão de seus dados.

Enquanto estiver inativa, a escola continua existindo como instituição no sistema e pode ser identificada como inativa pelos usuários que possuem vínculo com ela.

Administradores podem solicitar a reativação da escola, mas a efetivação dessa alteração continua sendo responsabilidade da equipe do CodiGO!.

## 10. Estado do vínculo e acesso à escola

O vínculo entre usuário e escola possui um ciclo de vida próprio.

Um vínculo pendente representa uma relação ainda não aceita pelo usuário e, portanto, não estabelece acesso institucional à escola.

Um vínculo ativo representa uma relação institucional vigente e permite que o usuário atue na escola de acordo com seu cargo.

Quando o vínculo deixa de existir, o usuário deixa de possuir relação institucional com aquela escola.

A existência de uma conta de usuário, isoladamente, não concede acesso a nenhuma escola. O acesso institucional depende da existência de um vínculo vigente entre o usuário e a instituição.

## 11. Relação entre escola, usuário e vínculo

O modelo institucional pode ser representado conceitualmente como:

```text
Usuário
   │
   ├── vínculo ──→ Escola A
   │                 └── Professor
   │
   ├── vínculo ──→ Escola B
   │                 └── Administrador
   │
   └── vínculo ──→ Escola C
                     └── Professor
```

O vínculo é, portanto, a entidade que conecta identidade e instituição.

Ele determina se a participação está pendente ou ativa e qual cargo o usuário exerce naquela escola.

A escola, por sua vez, mantém sua própria identidade institucional e seu estado de atividade independentemente dos vínculos individuais existentes com seus usuários.
