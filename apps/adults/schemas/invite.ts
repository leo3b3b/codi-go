import * as v from "valibot";

export const inviteSchema = v.object({
	username: v.pipe(
		v.string("O nome de usuário deve ser um texto."),
		v.minLength(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
		v.maxLength(30, "O nome de usuário pode ter no máximo 30 caracteres."),
		v.regex(
			/^[a-z0-9._-]+$/,
			"Use apenas letras minúsculas, números, pontos, traços ou sublinhados.",
		),
	),
	role: v.union(
		[v.literal("teacher"), v.literal("admin")],
		"O usuário deve ser administrador ou professor.",
	),
});

export type InviteOutput = v.InferOutput<typeof inviteSchema>;
