import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signInWithPassword } from "@/features/auth";

function SignInPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setError(null);
        setLoading(true);

        try {
            await signInWithPassword(email, password);
            navigate("/app", { replace: true });
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Não foi possível entrar.",
            );
        } finally {
            setLoading(false);
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    <span>E-mail</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        autoComplete="email"
                        className="border rounded px-3 py-2 bg-bg"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span>Senha</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                        className="border rounded px-3 py-2 bg-bg"
                    />
                </label>

                {error && (
                    <p role="alert" className="text-red-500">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded px-4 py-2 bg-primary text-white disabled:opacity-50"
                >
                    {loading ? "Entrando..." : "Entrar"}
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