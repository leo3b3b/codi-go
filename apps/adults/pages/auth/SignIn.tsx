import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";

import { signInWithPassword } from "@/features/auth";

const signInSchema = v.object({
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

type SignInFormData = v.InferOutput<typeof signInSchema>;

function SignInPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        resolver: valibotResolver(signInSchema),
    });

    async function onSubmit({ email, password }: SignInFormData) {
        try {
            await signInWithPassword(email, password);

            navigate("/app", { replace: true });
        } catch {
            setError("root", {
                message: "Não foi possível entrar. Verifique seu e-mail e senha.",
            });
        }
    }

    return (
        <section>
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Entrar no CodiGO!</h1>

                <p className="mt-2 text-muted">
                    Entre na sua conta para continuar.
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
                        autoComplete="current-password"
                        aria-invalid={Boolean(errors.password)}
                        className="rounded border px-3 py-2 bg-bg"
                    />

                    {errors.password && (
                        <p className="text-sm text-red-500">
                            {errors.password.message}
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
                    {isSubmitting ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p className="mt-6 text-center text-muted">
                Ainda não tem uma conta?{" "}
                <Link to="/signup" className="text-primary">
                    Criar conta
                </Link>
            </p>
        </section>
    );
}

export default SignInPage;
