import * as v from "valibot";

export const classSchema = v.object({
	name: v.pipe(
		v.string("O nome da classe deve ser um texto."),
		v.nonEmpty("O nome da classe é obrigatório."),
	),
});

export type ClassOutput = v.InferOutput<typeof classSchema>;
