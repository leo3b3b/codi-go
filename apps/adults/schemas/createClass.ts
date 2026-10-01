import * as v from "valibot";

export const createClassSchema = v.object({
	name: v.pipe(
		v.string("O nome da classe deve ser um texto."),
		v.trim(),
		v.nonEmpty("O nome da classe é obrigatório."),
	),
});

export type CreateClassOutput = v.InferOutput<typeof createClassSchema>;
