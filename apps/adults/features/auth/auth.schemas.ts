import * as v from "valibot";

export const signInSchema = v.object({
    email: v.pipe(
        v.string(),
        v.nonEmpty("Informe seu e-mail."),
        v.email("Informe um e-mail válido."),
    ),
    password: v.pipe(
        v.string(),
        v.nonEmpty("Informe sua senha."),
    ),
});

export const signUpSchema = v.pipe(
    v.object({
        email: v.pipe(
            v.string(),
            v.nonEmpty("Informe seu e-mail."),
            v.email("Informe um e-mail válido."),
        ),
        password: v.pipe(
            v.string(),
            v.nonEmpty("Informe sua senha."),
            v.minLength(6, "A senha deve ter pelo menos 6 caracteres."),
        ),
        confirmation: v.pipe(
            v.string(),
            v.nonEmpty("Confirme sua senha."),
            v.minLength(6, "A senha deve ter pelo menos 6 caracteres."),
        ),
    }),
    v.forward(
        v.check(
            ({ password, confirmation }) => password === confirmation,
            "As senhas não coincidem.",
        ),
        ["confirmation"],
    ),
);

export type SignInFormData = v.InferOutput<typeof signInSchema>;
export type SignUpFormData = v.InferOutput<typeof signUpSchema>;