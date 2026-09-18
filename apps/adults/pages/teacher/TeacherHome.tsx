import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@codi-go/supabase";
import logo from "@codi-go/ui/images/logo.png";
import type { ClassRoom, School } from "@codi-go/supabase/types";


function TeacherHome() {
    const navigate = useNavigate();

    const [schools, setSchools] = useState<School[]>([]);
    const [classes, setClasses] = useState<ClassRoom[]>([]);

    const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

    const [schoolMenuOpen, setSchoolMenuOpen] = useState(true);
    const [classMenuOpen, setClassMenuOpen] = useState(true);

    const [loadingSchools, setLoadingSchools] = useState(true);
    const [loadingClasses, setLoadingClasses] = useState(false);

    const [error, setError] = useState("");

    /*
     * CARREGAR ESCOLAS
     *
     * Busca as escolas às quais o professor logado está associado.
     */
    useEffect(() => {
        async function loadSchools() {
            setLoadingSchools(true);
            setError("");

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                navigate("/login", { replace: true });
                return;
            }

            const { data: schoolLinks, error: schoolLinksError } =
                await supabase
                    .from("schools_profiles")
                    .select("school_id")
                    .eq("profile_id", user.id);

            if (schoolLinksError) {
                setError("Não foi possível carregar suas escolas.");
                setLoadingSchools(false);
                return;
            }

            const schoolIds = (schoolLinks ?? []).map(
                (item) => item.school_id,
            );

            if (schoolIds.length === 0) {
                setSchools([]);
                setLoadingSchools(false);
                return;
            }

            const { data: schoolData, error: schoolError } = await supabase
                .from("school")
                .select("id, trade_name, legal_name")
                .in("id", schoolIds)
                .eq("is_active", true);

            if (schoolError) {
                setError("Não foi possível carregar suas escolas.");
                setLoadingSchools(false);
                return;
            }

            const loadedSchools = (schoolData ?? []).map((school) => ({
                id: school.id,
                name: school.trade_name || school.legal_name,
            }));

            setSchools(loadedSchools);

            /*
             * Se o professor já havia escolhido uma escola anteriormente,
             * tentamos manter essa escolha.
             *
             * Caso contrário, usamos a primeira escola disponível.
             */
            const savedSchoolId = localStorage.getItem(
                "codi-go:selected-school",
            );

            const savedSchool = loadedSchools.find(
                (school) => school.id === savedSchoolId,
            );

            setSelectedSchool(savedSchool ?? loadedSchools[0] ?? null);

            setLoadingSchools(false);
        }

        loadSchools();
    }, [navigate]);

    /*
     * CARREGAR TURMAS
     *
     * Sempre que a escola selecionada mudar, buscamos
     * somente as turmas dessa escola às quais o professor está associado.
     */
    useEffect(() => {
        async function loadClasses() {
            if (!selectedSchool) {
                setClasses([]);
                return;
            }

            setLoadingClasses(true);
            setError("");

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                navigate("/login", { replace: true });
                return;
            }

            const { data: classLinks, error: classLinksError } =
                await supabase
                    .from("classes_profiles")
                    .select("class_id")
                    .eq("profile_id", user.id);

            if (classLinksError) {
                setError("Não foi possível carregar suas turmas.");
                setLoadingClasses(false);
                return;
            }

            const classIds = (classLinks ?? []).map(
                (item) => item.class_id,
            );

            if (classIds.length === 0) {
                setClasses([]);
                setLoadingClasses(false);
                return;
            }

            const { data: classData, error: classError } = await supabase
                .from("classes")
                .select("id, name, school_id")
                .eq("school_id", selectedSchool.id)
                .in("id", classIds)
                .order("name");

            if (classError) {
                setError("Não foi possível carregar suas turmas.");
                setLoadingClasses(false);
                return;
            }

            setClasses(classData ?? []);

            setLoadingClasses(false);
        }

        loadClasses();
    }, [selectedSchool, navigate]);

    /*
     * ESCOLHER ESCOLA
     *
     * A escola permanece selecionada e o menu continua aberto.
     */
    function selectSchool(school: School) {
        setSelectedSchool(school);

        localStorage.setItem("codi-go:selected-school", school.id);
    }

    /*
     * ABRIR TURMA
     *
     * A turma não é apenas "selecionada".
     * O clique leva diretamente para a Tela 5 daquela turma.
     */
    function openClass(classRoom: ClassRoom) {
        navigate(`/app/turma/${classRoom.id}`);
    }

    if (loadingSchools) {
        return (
            <main className="flex h-screen items-center justify-center bg-[#e2c7e5]">
                <p className="text-2xl font-bold text-[#372a58]">
                    Carregando...
                </p>
            </main>
        );
    }

    return (
        <main className="h-screen overflow-hidden bg-gradient-to-br from-[#c6a0ea] via-[#f0ddd4] to-[#c8a0eb]">
            {/* =========================================================
                CABEÇALHO
            ========================================================== */}
            <header className="flex h-24 items-center justify-between bg-gradient-to-r from-[#f5e1dc] via-[#e3cce0] to-[#bb8ee9] px-10 shadow-xl">
                {/* LOGO */}
                <button
                    type="button"
                    onClick={() => navigate("/app")}
                    className="transition hover:scale-[1.02]"
                >
                    <img
                        src={logo}
                        alt="CodiGO!"
                        className="w-44 object-contain"
                    />
                </button>

                {/* MENU SUPERIOR */}
                <nav className="flex items-center gap-14 text-xl font-bold">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/app/configuracoes")
                        }
                        className="rounded-xl px-4 py-2 text-black transition hover:bg-white/30"
                    >
                        Configurações
                    </button>

                    <button
                        type="button"
                        className="rounded-xl bg-white px-5 py-3 text-black shadow-sm"
                    >
                        Turmas
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/app/medias")}
                        className="rounded-xl px-4 py-2 text-black transition hover:bg-white/30"
                    >
                        Médias
                    </button>
                </nav>

                {/* ESCOLA ATUAL */}
                <div className="min-w-52 text-right text-2xl font-bold text-white">
                    {selectedSchool?.name ?? "Nenhuma escola"}
                </div>
            </header>

            {/* =========================================================
                CONTEÚDO PRINCIPAL
            ========================================================== */}
            <section className="mx-auto grid h-[calc(100vh-96px)] max-w-[1450px] grid-cols-[380px_1fr] gap-14 px-10 py-12">
                {/* =====================================================
                    COLUNA ESQUERDA
                ====================================================== */}
                <div className="flex flex-col gap-9">
                    {/* -------------------------------------------------
                        ESCOLHA SUA ESCOLA
                    -------------------------------------------------- */}
                    <div className="rounded-[2rem] bg-white p-7 shadow-2xl">
                        <button
                            type="button"
                            onClick={() =>
                                setSchoolMenuOpen(!schoolMenuOpen)
                            }
                            className="flex w-full items-center justify-center gap-4 text-2xl text-black"
                        >
                            Escolha sua escola

                            <span className="text-2xl">
                                {schoolMenuOpen ? "⌃" : "⌄"}
                            </span>
                        </button>

                        {schoolMenuOpen && (
                            <div className="mt-7 flex flex-col gap-4">
                                {schools.length === 0 ? (
                                    <p className="py-4 text-center text-[#716886]">
                                        Nenhuma escola encontrada.
                                    </p>
                                ) : (
                                    schools.map((school) => {
                                        const isSelected =
                                            school.id ===
                                            selectedSchool?.id;

                                        return (
                                            <button
                                                key={school.id}
                                                type="button"
                                                onClick={() =>
                                                    selectSchool(school)
                                                }
                                                className={`rounded-2xl px-5 py-4 text-xl font-medium transition ${
                                                    isSelected
                                                        ? "bg-gradient-to-r from-[#df9cf4] via-[#e5c4e8] to-[#fff0bd] text-[#3267d9]"
                                                        : "bg-[#d8d8d8] text-[#3267d9] hover:bg-[#cfcfcf]"
                                                }`}
                                            >
                                                {school.name}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    {/* -------------------------------------------------
                        ESCOLHA SUA TURMA
                    -------------------------------------------------- */}
                    <div className="rounded-[2rem] bg-white p-7 shadow-2xl">
                        <button
                            type="button"
                            onClick={() =>
                                setClassMenuOpen(!classMenuOpen)
                            }
                            className="flex w-full items-center justify-center gap-4 text-2xl text-black"
                        >
                            Escolha sua turma

                            <span className="text-2xl">
                                {classMenuOpen ? "⌃" : "⌄"}
                            </span>
                        </button>

                        {classMenuOpen && (
                            <div className="mt-7 flex flex-col gap-4">
                                {loadingClasses ? (
                                    <p className="py-4 text-center text-[#716886]">
                                        Carregando turmas...
                                    </p>
                                ) : classes.length === 0 ? (
                                    <p className="py-4 text-center text-[#716886]">
                                        Nenhuma turma encontrada.
                                    </p>
                                ) : (
                                    classes.map((classRoom) => (
                                        <button
                                            key={classRoom.id}
                                            type="button"
                                            onClick={() =>
                                                openClass(classRoom)
                                            }
                                            className="rounded-2xl border-2 border-[#8c62c9] bg-[#eedcff] px-5 py-4 text-xl font-bold text-black shadow-sm transition hover:bg-[#e5d0f7] hover:shadow-md"
                                        >
                                            {classRoom.name}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* =====================================================
                    PAINEL DIREITO — ESTATÍSTICA GERAL
                ====================================================== */}
                <div className="flex min-h-0 flex-col rounded-[2rem] bg-white/85 p-10 shadow-2xl">
                    <div className="mb-6 self-start rounded-full bg-white px-6 py-3 text-2xl shadow-lg">
                        Pontos fortes e fracos de cada turma
                    </div>

                    <div className="flex min-h-0 flex-1 items-center justify-center rounded-3xl bg-white p-8">
                        <div className="w-full">
                            <p className="mb-8 text-center text-lg text-[#716886]">
                                Estatísticas gerais das turmas de{" "}
                                <strong>
                                    {selectedSchool?.name ??
                                        "escola selecionada"}
                                </strong>
                            </p>

                            {classes.length === 0 ? (
                                <div className="py-16 text-center">
                                    <h2 className="text-3xl font-bold text-[#372a58]">
                                        Nenhuma turma encontrada
                                    </h2>

                                    <p className="mt-3 text-lg text-[#716886]">
                                        As estatísticas aparecerão aqui quando
                                        houver turmas cadastradas.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {classes.map((classRoom) => (
                                        <div
                                            key={classRoom.id}
                                            className="flex items-center gap-5"
                                        >
                                            <div className="w-32 text-right text-lg font-bold text-[#372a58]">
                                                {classRoom.name}
                                            </div>

                                            <div className="h-10 flex-1 overflow-hidden rounded-xl bg-[#eee9f4]">
                                                <div
                                                    className="h-full rounded-xl bg-[#8f68e8]"
                                                    style={{
                                                        width: "0%",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                MENSAGEM DE ERRO
            ========================================================== */}
            {error && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-xl bg-[#fff0f2] px-6 py-4 text-[#8e2331] shadow-xl">
                    {error}
                </div>
            )}
        </main>
    );
}

export default TeacherHome;