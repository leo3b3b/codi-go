import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";

import { signUp } from "@/features/auth";

const signUpSchema = v.pipe(
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

type SignUpFormData = v.InferOutput<typeof signUpSchema>;

function SignUpPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: valibotResolver(signUpSchema),
    });

    async function onSubmit({ email, password }: SignUpFormData) {
        try {
            await signUp(email, password);

            navigate("/check-email", {
                replace: true,
                state: { email },
            });
        } catch {
            setError("root", {
                message: "Não foi possível criar sua conta. Tente novamente.",
            });
        }
    }

    return (
        <section>
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Criar conta</h1>

                <p className="mt-2 text-muted">
                    Crie sua conta no CodiGO!
                </p>
            </header>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-4"
            >
                <label className="flex flex-col gap-1">
                    <span>E-mail</span>

                    <input
                        type="email"
                        {...register("email")}
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        className="rounded border px-3 py-2 bg-bg"
                    />

                    {errors.email && (
                        <p className="text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </label>

                <label className="flex flex-col gap-1">
                    <span>Senha</span>

                    <input
                        type="password"
                        {...register("password")}
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.password)}
                        className="rounded border px-3 py-2 bg-bg"
                    />

                    {errors.password && (
                        <p className="text-sm text-red-500">
                            {errors.password.message}
                        </p>
                    )}
                </label>

                <label className="flex flex-col gap-1">
                    <span>Confirmar senha</span>

                    <input
                        type="password"
                        {...register("confirmation")}
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.confirmation)}
                        className="rounded border px-3 py-2 bg-bg"
                    />

                    {errors.confirmation && (
                        <p className="text-sm text-red-500">
                            {errors.confirmation.message}
                        </p>
                    )}
                </label>

                {errors.root && (
                    <p role="alert" className="text-red-500">
                        {errors.root.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded px-4 py-2 bg-primary text-white disabled:opacity-50"
                >
                    {isSubmitting ? "Criando..." : "Criar conta"}
                </button>
            </form>

            <p className="mt-6 text-center text-muted">
                Já possui uma conta?{" "}
                <Link to="/login" className="text-primary">
                    Entrar
                </Link>
            </p>
        </section>
    );
}

export default SignUpPage;
