import { Link, useLocation } from "react-router";

type CheckEmailLocationState = {
    email?: string;
};

function CheckEmailPage() {
    const location = useLocation();
    const state = location.state as CheckEmailLocationState | null;
    const email = state?.email;

    return (
        <section>
            <header className="mb-8">
                <h1 className="text-3xl font-bold">
                    Confirme seu e-mail
                </h1>

                <p className="mt-2 text-muted">
                    Enviamos uma mensagem para confirmar sua conta.
                </p>
            </header>

            <div className="flex flex-col gap-4">
                {email && (
                    <p>
                        Verifique a caixa de entrada de{" "}
                        <strong>{email}</strong>.
                    </p>
                )}

                <p>
                    Se a conta puder ser criada, você receberá um e-mail de{" "}
                    <strong>noreply@mail.app.supabase.io</strong>, enviado
                    pelo Supabase Auth, com as instruções para confirmar seu
                    endereço de e-mail.
                </p>

                <p className="text-muted">
                    Se não encontrar a mensagem, verifique também a pasta de
                    spam ou lixo eletrônico.
                </p>

                <p>
                    Depois de confirmar seu e-mail, você poderá entrar na sua
                    conta.
                </p>
            </div>

            <p className="mt-6 text-center text-muted">
                Já confirmou seu e-mail?{" "}
                <Link to="/login" className="text-primary">
                    Entrar
                </Link>
            </p>
        </section>
    );
}

export default CheckEmailPage;
