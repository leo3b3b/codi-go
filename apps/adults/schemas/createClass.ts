import * as v from "valibot";

export const createClassSchema = v.object({
	name: v.pipe(
		v.string("O nome da turma deve ser um texto."),
		v.trim(),
		v.nonEmpty("O nome da turma é obrigatório."),
	),
});

export type CreateClassOutput = v.InferOutput<typeof createClassSchema>;
