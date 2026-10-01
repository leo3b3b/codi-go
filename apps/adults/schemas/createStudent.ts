import * as v from "valibot";

const studentNameRegex =
	/^\p{L}+(?: +\p{L}+)*(?:\s*,\s*\p{L}+(?: +\p{L}+)*)*$/u;

export const createStudentSchema = v.object({
	names: v.pipe(
		v.string("Os nomes dos alunos devem ser um texto."),
		v.trim(),
		v.nonEmpty("O nome do aluno é obrigatório."),
		v.regex(
			studentNameRegex,
			"Os nomes devem conter apenas letras e espaços, separados por vírgulas.",
		),
	),
});

export type CreateStudentOutput = v.InferOutput<typeof createStudentSchema>;
