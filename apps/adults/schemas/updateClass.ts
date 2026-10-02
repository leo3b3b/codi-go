import * as v from "valibot";

export const updateClassSchema = v.object({
	name: v.pipe(
		v.string("O nome da turma deve ser um texto."),
		v.trim(),
		v.nonEmpty("O nome da turma não pode estar vazio."),
	),
	teacher_username: v.optional(
		v.union([
			v.literal(""),
			v.pipe(
				v.string("O nome de usuário deve ser um texto."),
				v.trim(),
				v.minLength(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
				v.maxLength(30, "O nome de usuário pode ter no máximo 30 caracteres."),
				v.regex(
					/^[a-z0-9._-]+$/,
					"Use apenas letras minúsculas, números, pontos, traços ou sublinhados.",
				),
			),
		]),
	),
	access_code: v.pipe(
		v.string("O código de acesso deve ser um texto."),
		v.length(6, "O código de acesso deve ter 6 caracteres."),
		v.regex(
			/^[A-Z]{6}$/,
			"O código de acesso deve conter apenas letras maiúsculas.",
		),
	),
});

export type UpdateClassOutput = v.InferOutput<typeof updateClassSchema>;
