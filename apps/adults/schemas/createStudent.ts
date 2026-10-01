import * as v from "valibot";

export const createStudentSchema = v.object({
	name: v.pipe(
		v.string("O nome do aluno deve ser um texto."),
		v.trim(),
		v.nonEmpty("O nome do aluno é obrigatório."),
	),
});

export type CreateStudentOutput = v.InferOutput<typeof createStudentSchema>;
