export type GameGuidanceTexts = readonly [string, string, string];

export const GAME_GUIDANCE: Record<string, GameGuidanceTexts> = {
	maze: [
		"Neste jogo, o aluno organiza uma sequência de comandos para levar o Codi até o destino, planejando o percurso antes de executá-lo.",
		"Resolver o labirinto desenvolve o pensamento computacional: o aluno pratica o sequenciamento de instruções, a antecipação de resultados e a revisão de estratégias para solucionar um problema.",
		"Quando a diferença de comandos está disponível, sucesso com diferença 0 indica que o aluno chegou ao destino usando a quantidade esperada de comandos; sucesso com diferença positiva indica que chegou, mas precisou de passos adicionais; falha indica que não concluiu o percurso. A falha, por si só, não revela a causa. Observe se, ao longo das tentativas, o aluno passa a concluir os níveis e reduz os comandos adicionais.",
	],

	kit: [
		"Neste jogo, o aluno interpreta a instrução da fase e seleciona, entre várias opções, os itens que atendem ao critério solicitado.",

		"A atividade trabalha a compreensão de instruções, a classificação de elementos, a atenção às características relevantes e a tomada de decisões com base em um conjunto de opções.",

		"Sucesso indica que o aluno selecionou todos os itens corretos; resultado parcial indica que acertou parte dos itens, mas não o conjunto completo; falha indica que não selecionou nenhum item correto. Observe se as tentativas parciais evoluem para acertos completos. Os registros também permitem consultar a quantidade de itens corretos em relação ao total esperado.",
	],

	box: [
		"Neste jogo, o aluno observa os objetos de uma caixa e escolhe uma alternativa que segue a mesma regra dos objetos apresentados.",
		"A atividade desenvolve o reconhecimento de padrões e o raciocínio lógico, pois exige comparar objetos, identificar características relevantes e aplicar uma regra a um novo exemplo.",
		"Cada resposta confirmada representa uma tentativa: sucesso indica que a escolha segue a regra; falha indica que a alternativa escolhida não corresponde ao padrão. Observe a proporção de acertos e a evolução dos resultados em cada nível. Como o registro não guarda a alternativa escolhida, ele não revela, sozinho, qual característica o aluno interpretou incorretamente.",
	],

	hunt: [
		"Neste jogo, o aluno percorre um mapa em grade para encontrar objetos na ordem indicada pelas instruções da fase.",
		"A atividade desenvolve orientação espacial, sequenciamento, planejamento de percurso e atenção à ordem dos objetivos. O aluno precisa escolher movimentos que respeitem as passagens do mapa.",
		"Sucesso indica que todos os objetos foram encontrados na ordem correta; falha indica que o aluno alcançou um objeto fora da sequência esperada. Os registros incluem a quantidade de movimentos e quantos objetos já haviam sido encontrados corretamente, permitindo observar a evolução entre tentativas.",
	],
};
