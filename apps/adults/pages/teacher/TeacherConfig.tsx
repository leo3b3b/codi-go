import { useNavigate } from "react-router";

function TeacherConfig() {
    const navigate = useNavigate();

    return (
        <main className="h-screen overflow-hidden bg-gradient-to-br from-[#c9a8ed] via-[#f1dfd4] to-[#c9a8ed]">
            <header className="flex min-h-24 items-center justify-between bg-gradient-to-r from-[#f4ddd8] via-[#dfc9dc] to-[#bd91f0] px-8 shadow-xl">
                <button
                    type="button"
                    onClick={() => navigate("/app")}
                    className="text-2xl font-bold text-white"
                >
                    CodiGO!
                </button>

                <h1 className="text-3xl font-bold text-black">
                    Configurações
                </h1>

                <button
                    type="button"
                    onClick={() => navigate("/app")}
                    className="rounded-xl bg-white px-5 py-2 text-lg font-bold text-black"
                >
                    Voltar
                </button>
            </header>

            <section className="flex h-[calc(100vh-96px)] items-center justify-center px-8">
                <div className="rounded-3xl bg-white px-16 py-12 text-center shadow-2xl">
                    <h2 className="text-3xl font-bold text-[#372a58]">
                        Configurações
                    </h2>

                    <p className="mt-4 text-xl text-[#716886]">
                        Área de configurações do professor.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default TeacherConfig;