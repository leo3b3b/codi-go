import { useNavigate } from "react-router";

function TeacherConfig() {
  const navigate = useNavigate();

  return (
    <main className="h-screen overflow-hidden bg-bg">
      <header className="flex min-h-24 items-center justify-between bg-hero px-8 shadow-lg">
        <button
          type="button"
          onClick={() => navigate("/app")}
          className="text-2xl font-bold text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
        >
          CodiGO!
        </button>

        <h1 className="text-3xl font-bold text-white">
          Configurações
        </h1>

        <button
          type="button"
          onClick={() => navigate("/app")}
          className="ui-button-primary flex items-center gap-2 bg-white text-primary hover:bg-white/90"
        >
          <span className="i-lucide-arrow-left" aria-hidden="true" />
          Voltar
        </button>
      </header>

      <section className="flex h-[calc(100vh-96px)] items-center justify-center px-8">
        <div className="ui-card w-full max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-heading">
            Configurações
          </h2>

          <p className="mt-4 text-lg text-muted">
            Área de configurações do professor.
          </p>
        </div>
      </section>
    </main>
  );
}

export default TeacherConfig;