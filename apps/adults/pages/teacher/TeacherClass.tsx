import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { supabase } from "@codi-go/supabase";
import logo from "@codi-go/ui/images/logo.png";

type School = {
    id: string;
    name: string;
};

type ClassRoom = {
    id: string;
    name: string;
    school_id: string;
};

type Student = {
    id: string;
    name: string;
    level: number | null;
};

type OrderOption = "az" | "za";
type LevelOption = "high" | "low";

const FILTERS_KEY = "codi-go:teacher-class-filters";

function TeacherClass() {
    const navigate = useNavigate();
    const { classId } = useParams();

    const [school, setSchool] = useState<School | null>(null);
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [selectedClass, setSelectedClass] =
        useState<ClassRoom | null>(null);
    const [students, setStudents] = useState<Student[]>([]);

    const [order, setOrder] = useState<OrderOption>("az");
    const [levelOrder, setLevelOrder] =
        useState<LevelOption>("high");
    const [search, setSearch] = useState("");

    const [orderOpen, setOrderOpen] = useState(false);
    const [levelOpen, setLevelOpen] = useState(false);
    const [classOpen, setClassOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function loadClass() {
            if (!classId) {
                setError("Turma não encontrada.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            const { data: classData, error: classError } =
                await supabase
                    .from("classes")
                    .select("id, name, school_id")
                    .eq("id", classId)
                    .single();

            if (classError || !classData) {
                setError(
                    "Não foi possível encontrar essa turma.",
                );
                setLoading(false);
                return;
            }

            setSelectedClass(classData);

            const { data: schoolData, error: schoolError } =
                await supabase
                    .from("school")
                    .select("id, trade_name, legal_name")
                    .eq("id", classData.school_id)
                    .single();

            if (!schoolError && schoolData) {
                setSchool({
                    id: schoolData.id,
                    name:
                        schoolData.trade_name ||
                        schoolData.legal_name,
                });
            }

            const { data: classList, error: classListError } =
                await supabase
                    .from("classes")
                    .select("id, name, school_id")
                    .eq("school_id", classData.school_id)
                    .order("name");

            if (!classListError) {
                setClasses(classList ?? []);
            }

            const {
                data: studentsData,
                error: studentsError,
            } = await supabase
                .from("students")
                .select("id, name")
                .eq("class_id", classId)
                .order("name");

            if (studentsError) {
                setError(
                    "Não foi possível carregar os alunos.",
                );
                setLoading(false);
                return;
            }

            const studentIds = (studentsData ?? []).map(
                (student) => student.id,
            );

            const levels = new Map<string, number>();

            if (studentIds.length > 0) {
                const { data: progressData } = await supabase
                    .from("progress")
                    .select("student_id, level_id")
                    .in("student_id", studentIds);

                for (const progress of progressData ?? []) {
                    const currentLevel =
                        levels.get(progress.student_id) ?? 0;

                    if (progress.level_id > currentLevel) {
                        levels.set(
                            progress.student_id,
                            progress.level_id,
                        );
                    }
                }
            }

            setStudents(
                (studentsData ?? []).map((student) => ({
                    id: student.id,
                    name: student.name,
                    level: levels.has(student.id)
                        ? levels.get(student.id)!
                        : null,
                })),
            );

            setLoading(false);
        }

        loadClass();
    }, [classId]);

    useEffect(() => {
        const savedFilters =
            localStorage.getItem(FILTERS_KEY);

        if (!savedFilters) {
            return;
        }

        try {
            const filters = JSON.parse(savedFilters);

            if (
                filters.order === "az" ||
                filters.order === "za"
            ) {
                setOrder(filters.order);
            }

            if (
                filters.levelOrder === "high" ||
                filters.levelOrder === "low"
            ) {
                setLevelOrder(filters.levelOrder);
            }

            if (typeof filters.search === "string") {
                setSearch(filters.search);
            }
        } catch {
            localStorage.removeItem(FILTERS_KEY);
        }
    }, []);

    const filteredStudents = useMemo(() => {
        const normalizedSearch = search
            .trim()
            .toLowerCase();

        const result = students.filter((student) =>
            student.name
                .toLowerCase()
                .includes(normalizedSearch),
        );

        result.sort((a, b) => {
            if (levelOrder === "high") {
                const levelA = a.level ?? -1;
                const levelB = b.level ?? -1;

                if (levelA !== levelB) {
                    return levelB - levelA;
                }
            }

            if (levelOrder === "low") {
                const levelA =
                    a.level ?? Number.MAX_SAFE_INTEGER;
                const levelB =
                    b.level ?? Number.MAX_SAFE_INTEGER;

                if (levelA !== levelB) {
                    return levelA - levelB;
                }
            }

            const comparison = a.name.localeCompare(
                b.name,
                "pt-BR",
            );

            return order === "az"
                ? comparison
                : -comparison;
        });

        return result;
    }, [students, search, order, levelOrder]);

    function saveFilters() {
        localStorage.setItem(
            FILTERS_KEY,
            JSON.stringify({
                order,
                levelOrder,
                search,
            }),
        );

        setSaved(true);

        window.setTimeout(() => {
            setSaved(false);
        }, 1800);
    }

    function selectClass(nextClass: ClassRoom) {
        setClassOpen(false);
        navigate(`/app/turma/${nextClass.id}`);
    }

    function goToHome() {
        navigate("/app");
    }

    return (
        <main className="h-screen overflow-hidden bg-gradient-to-br from-[#c9a8ed] via-[#f1dfd4] to-[#c9a8ed]">
            {/* Cabeçalho */}
            <header className="flex h-20 items-center justify-between bg-gradient-to-r from-[#f4ddd8] via-[#dfc9dc] to-[#bd91f0] px-8 shadow-lg">
                <button
                    type="button"
                    onClick={goToHome}
                    className="flex items-center"
                    aria-label="Ir para a página inicial"
                >
                    <img
                        src={logo}
                        alt="CodiGO!"
                        className="w-36 object-contain"
                    />
                </button>

                <nav className="flex items-center gap-8 text-lg font-bold">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/app/configuracoes")
                        }
                        className="rounded-xl px-3 py-2 text-black transition hover:bg-white/20"
                    >
                        Configurações
                    </button>

                    <button
                        type="button"
                        className="rounded-xl bg-white px-4 py-2 text-black shadow-sm"
                    >
                        Turmas
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/app/medias")}
                        className="rounded-xl px-3 py-2 text-black transition hover:bg-white/20"
                    >
                        Médias
                    </button>
                </nav>

                <div className="min-w-36 text-right text-xl font-bold text-white">
                    {school?.name ?? "Escola"}
                </div>
            </header>

            {/* Filtros */}
            <section className="mx-auto flex max-w-7xl items-center gap-3 px-8 py-5">
                {/* Voltar */}
                <button
                    type="button"
                    onClick={goToHome}
                    className="rounded-xl bg-gradient-to-r from-[#f5e7ad] to-[#e6bdf2] px-4 py-2.5 text-base text-[#3d3547] shadow-md transition hover:scale-[1.01]"
                >
                    ← Voltar
                </button>

                {/* Salvar filtros */}
                <button
                    type="button"
                    onClick={saveFilters}
                    className="rounded-xl bg-gradient-to-r from-[#fff1bd] to-[#fff4ca] px-4 py-2.5 text-base font-bold text-[#3d3547] shadow-md transition hover:scale-[1.01]"
                >
                    ☷{" "}
                    {saved
                        ? "Filtros salvos!"
                        : "Salvar filtros"}
                </button>

                {/* Turma */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setClassOpen(!classOpen)
                        }
                        className="flex min-w-36 items-center justify-between gap-4 rounded-xl bg-white px-4 py-2.5 text-base text-[#3d3547] shadow-md"
                    >
                        <span>
                            {selectedClass?.name ?? "Turma"}
                        </span>

                        <span className="text-base">
                            {classOpen ? "⌃" : "⌄"}
                        </span>
                    </button>

                    {classOpen && (
                        <div className="absolute left-0 top-full z-30 mt-2 min-w-36 overflow-hidden rounded-xl border border-[#e4ddea] bg-white p-1.5 shadow-xl">
                            {classes.length === 0 ? (
                                <div className="px-3 py-2.5 text-sm text-[#716886]">
                                    Nenhuma turma
                                </div>
                            ) : (
                                classes.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            selectClass(item)
                                        }
                                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm text-[#3d3547] transition ${
                                            item.id ===
                                            selectedClass?.id
                                                ? "bg-[#eedcff] font-bold"
                                                : "hover:bg-[#f1f1f1]"
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Ordem alfabética */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setOrderOpen(!orderOpen)
                        }
                        className="flex min-w-32 items-center justify-between gap-4 rounded-xl bg-white px-4 py-2.5 text-base text-[#55515d] shadow-md"
                    >
                        <span>
                            {order === "az"
                                ? "A → Z"
                                : "Z → A"}
                        </span>

                        <span className="text-base">
                            {orderOpen ? "⌃" : "⌄"}
                        </span>
                    </button>

                    {orderOpen && (
                        <div className="absolute left-0 top-full z-30 mt-2 min-w-32 overflow-hidden rounded-xl border border-[#e4ddea] bg-white p-1.5 shadow-xl">
                            <button
                                type="button"
                                onClick={() => {
                                    setOrder("az");
                                    setOrderOpen(false);
                                }}
                                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#3d3547] transition hover:bg-[#f1f1f1]"
                            >
                                A → Z
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setOrder("za");
                                    setOrderOpen(false);
                                }}
                                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#3d3547] transition hover:bg-[#f1f1f1]"
                            >
                                Z → A
                            </button>
                        </div>
                    )}
                </div>

                {/* Level */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setLevelOpen(!levelOpen)
                        }
                        className="flex min-w-36 items-center justify-between gap-4 rounded-xl bg-white px-4 py-2.5 text-base text-[#55515d] shadow-md"
                    >
                        <span>
                            {levelOrder === "high"
                                ? "Maior level"
                                : "Menor level"}
                        </span>

                        <span className="text-base">
                            {levelOpen ? "⌃" : "⌄"}
                        </span>
                    </button>

                    {levelOpen && (
                        <div className="absolute left-0 top-full z-30 mt-2 min-w-36 overflow-hidden rounded-xl border border-[#e4ddea] bg-white p-1.5 shadow-xl">
                            <button
                                type="button"
                                onClick={() => {
                                    setLevelOrder("high");
                                    setLevelOpen(false);
                                }}
                                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#3d3547] transition hover:bg-[#f1f1f1]"
                            >
                                Maior level
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setLevelOrder("low");
                                    setLevelOpen(false);
                                }}
                                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-[#3d3547] transition hover:bg-[#f1f1f1]"
                            >
                                Menor level
                            </button>
                        </div>
                    )}
                </div>

                {/* Pesquisa */}
                <div className="ml-auto flex h-11 items-center rounded-xl bg-white px-4 shadow-md">
                    <span className="mr-2 text-xl text-[#73788e]">
                        ⌕
                    </span>

                    <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Pesquisar"
                        className="w-40 bg-transparent text-base text-[#3d3547] outline-none placeholder:text-[#9b98a1]"
                    />
                </div>
            </section>

            {/* Lista de alunos */}
            <section className="mx-auto h-[calc(100vh-178px)] max-w-7xl overflow-hidden rounded-[2rem] bg-white/80 px-8 py-7 shadow-xl">
                {loading ? (
                    <div className="flex h-full items-center justify-center text-xl text-[#716886]">
                        Carregando alunos...
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-xl text-[#c53b4d]">
                        {error}
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-xl text-[#716886]">
                        Nenhuma criança encontrada.
                    </div>
                ) : (
                    <div className="grid h-full grid-cols-2 content-start gap-x-8 gap-y-8 overflow-y-auto px-2 pb-4 sm:grid-cols-4 lg:grid-cols-6">
                        {filteredStudents.map((student) => (
                            <button
                                key={student.id}
                                type="button"
                                className="group flex flex-col items-center"
                            >
                                <div className="relative">
                                    {/* Card da criança */}
                                    <div className="flex h-28 w-28 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#f8d5b3] to-[#f5e0c9] text-6xl shadow-lg transition group-hover:scale-[1.02]">
                                        🐰
                                    </div>

                                    {/* Level */}
                                    <span className="absolute right-1.5 top-1.5 rounded-lg bg-black px-2 py-1 text-sm font-bold leading-tight text-white shadow-md">
                                        {student.level === null
                                            ? "lvl.—"
                                            : `lvl.${student.level}`}
                                    </span>
                                </div>

                                <span className="mt-2 max-w-28 truncate text-base font-bold text-black">
                                    {student.name}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default TeacherClass;