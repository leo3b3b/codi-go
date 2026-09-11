import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUp } from "@/features/auth";

function SignUpPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmation, setConfirmation] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password !== confirmation) {
            setError("As senhas não coincidem.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const { session } = await signUp(email, password);

            if (session) {
                navigate("/app", { replace: true });
            } else {
                navigate("/login", {
                    replace: true,
                });
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Não foi possível criar sua conta.",
            );
        } finally {
            setLoading(false);
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
                        minLength={6}
                        autoComplete="new-password"
                        className="border rounded px-3 py-2 bg-bg"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span>Confirmar senha</span>
                    <input
                        type="password"
                        value={confirmation}
                        onChange={(event) => setConfirmation(event.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
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
                    {loading ? "Criando..." : "Criar conta"}
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