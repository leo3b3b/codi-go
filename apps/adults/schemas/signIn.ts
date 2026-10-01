import * as v from "valibot";

export const signInSchema = v.object({
	email: v.pipe(
		v.string("O e-mail deve ser um texto."),
		v.trim(),
		v.nonEmpty("Informe seu e-mail."),
		v.email("Informe um endereço de e-mail válido (ex: nome@dominio.com)."),
	),
	password: v.pipe(
		v.string("A senha deve ser um texto."),
		v.trim(),
		v.nonEmpty("Informe sua senha."),
	),
});

export type SignInOutput = v.InferOutput<typeof signInSchema>;
