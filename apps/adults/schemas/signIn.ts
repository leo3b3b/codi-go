import * as v from "valibot";

export const signInSchema = v.object({
	email: v.pipe(
		v.string(),
		v.nonEmpty("Informe seu e-mail."),
		v.email("Informe um e-mail válido."),
	),
	password: v.pipe(v.string(), v.nonEmpty("Informe sua senha.")),
});

export type SignInOutput = v.InferOutput<typeof signInSchema>;
