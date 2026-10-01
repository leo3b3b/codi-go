import * as v from "valibot";

export const onboardingSchema = v.object({
	name: v.pipe(
		v.string("O nome deve ser um texto."),
		v.trim(),
		v.nonEmpty("Informe seu nome."),
	),
	username: v.pipe(
		v.string("O nome de usuário deve ser um texto."),
		v.trim(),
		v.nonEmpty("Informe um nome de usuário."),
		v.minLength(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
		v.maxLength(30, "O nome de usuário pode ter no máximo 30 caracteres."),
		v.regex(
			/^[a-z0-9._-]+$/,
			"Use apenas letras minúsculas, números, pontos, traços ou sublinhados.",
		),
	),
});

export type OnboardingOutput = v.InferOutput<typeof onboardingSchema>;
