import * as v from "valibot";

export const profileSchema = v.object({
	name: v.optional(
		v.union([
			v.literal(""),
			v.pipe(
				v.string("O nome deve ser um texto."),
				v.trim(),
				v.nonEmpty("O nome não pode estar vazio."),
				v.regex(
					/^\p{L}+(?: +\p{L}+)*$/u,
					"O nome deve conter apenas letras e espaços.",
				),
			),
		]),
	),
	username: v.optional(
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
});

export type ProfileOutput = v.InferOutput<typeof profileSchema>;
