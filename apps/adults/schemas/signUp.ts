import * as v from "valibot";

export const signUpSchema = v.pipe(
	v.object({
		email: v.pipe(
			v.string("O e-mail deve ser um texto."),
			v.nonEmpty("Informe seu e-mail."),
			v.email("Informe um endereço de e-mail válido (ex: nome@dominio.com)."),
		),
		password: v.pipe(
			v.string("A senha deve ser um texto."),
			v.nonEmpty("Crie uma senha."),
			v.minLength(6, "A senha deve ter no mínimo 6 caracteres."),
		),
		confirmation: v.pipe(
			v.string("A confirmação deve ser um texto."),
			v.nonEmpty("Confirme sua senha."),
		),
	}),
	v.forward(
		v.check(
			({ password, confirmation }) => password === confirmation,
			"As senhas não coincidem. Digite a mesma senha nos dois campos.",
		),
		["confirmation"],
	),
);

export type SignUpOutput = v.InferOutput<typeof signUpSchema>;
