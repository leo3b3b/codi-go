import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { signUp } from "./auth.service";
import { signUpSchema, type SignUpFormData } from "./auth.schemas";

export default function SignUpPage() {
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

            navigate("/verificar-email", {
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
        <section className="ui-card">
            <header className="mb-8 text-center">
                <h1 className="mt-4 text-(2xl heading) font-black tracking-tight">Crie sua conta</h1>
            </header>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex-(~ col) gap-5"
            >
                <label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
                    <span>E-mail</span>

                    <input
                        type="email"
                        {...register("email")}
                        autoComplete="email"
                        placeholder="Digite seu e-mail"
                        aria-invalid={Boolean(errors.email)}
                        className="ui-field"
                    />

                    {errors.email && (
                        <p role="alert" className="text-(sm danger) font-medium">
                            {errors.email.message}
                        </p>
                    )}
                </label>

                <label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
                    <span>Senha</span>

                    <input
                        type="password"
                        {...register("password")}
                        autoComplete="new-password"
                        placeholder="Crie uma senha"
                        aria-invalid={Boolean(errors.password)}
                        className="ui-field"
                    />

                    {errors.password && (
                        <p role="alert" className="text-(sm danger) font-medium">
                            {errors.password.message}
                        </p>
                    )}
                </label>

                <label className="flex-(~ col) gap-2 text-(sm fg) font-bold">
                    <span>Confirmar senha</span>

                    <input
                        type="password"
                        {...register("confirmation")}
                        autoComplete="new-password"
                        placeholder="Confirme sua senha"
                        aria-invalid={Boolean(errors.confirmation)}
                        className="ui-field"
                    />

                    {errors.confirmation && (
                        <p role="alert" className="text-(sm danger) font-medium">
                            {errors.confirmation.message}
                        </p>
                    )}
                </label>

                {errors.root && (
                    <p role="alert" className="ui-alert-danger">
                        {errors.root.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ui-button-primary mt-1"
                >
                    {isSubmitting ? "Criando..." : "Criar conta"}
                </button>
            </form>

            <p className="mt-7 text-(center sm muted)">
                Já possui uma conta?{" "}
                <Link to="/login" className="ui-link">
                    Entrar
                </Link>
            </p>
        </section>
    );
}