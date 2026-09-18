import { Link, useLocation } from "react-router";
import logo from "@codi-go/ui/images/logo.png";

type CheckEmailLocationState = {
    email?: string;
};

function CheckEmailPage() {
    const location = useLocation();
    const state = location.state as CheckEmailLocationState | null;
    const email = state?.email;

    return (
        <section className="ui-card">
            <header className="mb-8 text-center">
                <img
                    src={logo}
                    alt="CodiGO!"
                    className="mx-auto h-24 w-auto object-contain"
                />

                <h1 className="mt-6 text-(3xl heading) font-black tracking-tight">
                    Confirme seu e-mail
                </h1>

                <p className="mt-2 text-muted">
                    Enviamos uma mensagem para confirmar sua conta.
                </p>
            </header>

            <div className="flex-(~ col) gap-4 text-fg">
                {email && (
                    <p className="rounded-xl bg-primary-soft px-4 py-3">
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

            <p className="mt-7 text-(center sm muted)">
                Já confirmou seu e-mail?{" "}
                <Link to="/login" className="ui-link">
                    Entrar
                </Link>
            </p>
        </section>
    );
}

export default CheckEmailPage;
