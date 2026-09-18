import { useState } from "react";
import logo from "@codi-go/ui/images/logo.png";

function TeacherHome() {
    const schools = ["Escola Teste 1", "Escola Teste 2"];
    const classes = ["Turma A1", "Turma A2", "Turma A3"];

    const [selectedSchool, setSelectedSchool] = useState("Escola Teste 1");
    const [schoolsOpen, setSchoolsOpen] = useState(true);
    const [classesOpen, setClassesOpen] = useState(true);

    return (
        <main className="h-screen overflow-hidden bg-gradient-to-br from-[#c9a8ed] via-[#f1dfd4] to-[#c9a8ed]">
            {/* Cabeçalho */}
            <header className="flex min-h-24 items-center justify-between bg-gradient-to-r from-[#f4ddd8] via-[#dfc9dc] to-[#bd91f0] px-8 shadow-xl">
                {/* Logo */}
                <div className="flex items-center">
                    <img
                        src={logo}
                        alt="CodiGO!"
                        className="w-44 object-contain"
                    />
                </div>

                {/* Menu */}
                <nav className="flex items-center gap-14 text-xl font-bold">
                    <button
                        type="button"
                        className="px-3 py-2 text-black transition hover:opacity-70"
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
                        className="px-3 py-2 text-black transition hover:opacity-70"
                    >
                        Médias
                    </button>
                </nav>

                {/* Escola atual */}
                <div className="text-2xl font-bold text-white">
                    {selectedSchool}
                </div>
            </header>

            {/* Conteúdo */}
            <section className="mx-auto flex max-w-7xl gap-16 px-8 py-12">
                {/* Coluna esquerda */}
                <div className="flex w-[380px] flex-col gap-9">

                    {/* Escolha sua escola */}
                    <section className="rounded-3xl bg-white p-7 shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setSchoolsOpen(!schoolsOpen)}
                            className="mb-7 flex w-full items-center justify-center gap-4"
                        >
                            <h2 className="text-2xl font-normal text-black">
                                Escolha sua escola
                            </h2>

                            <span className="text-2xl text-black">
                                {schoolsOpen ? "⌃" : "⌄"}
                            </span>
                        </button>

                        {schoolsOpen && (
                            <div className="flex flex-col gap-4">
                                {schools.map((school) => {
                                    const isSelected =
                                        school === selectedSchool;

                                    return (
                                        <button
                                            key={school}
                                            type="button"
                                            onClick={() =>
                                                setSelectedSchool(school)
                                            }
                                            className={`rounded-2xl px-5 py-4 text-xl font-medium transition ${
                                                isSelected
                                                    ? "bg-gradient-to-r from-[#dfa2f7] to-[#fff2c8] text-[#326ee8]"
                                                    : "bg-[#d8d8d8] text-[#326ee8]"
                                            }`}
                                        >
                                            {school}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Escolha sua turma */}
                    <section className="rounded-3xl bg-white p-7 shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setClassesOpen(!classesOpen)}
                            className="mb-7 flex w-full items-center justify-center gap-4"
                        >
                            <h2 className="text-2xl font-normal text-black">
                                Escolha sua turma
                            </h2>

                            <span className="text-2xl text-black">
                                {classesOpen ? "⌃" : "⌄"}
                            </span>
                        </button>

                        {classesOpen && (
                            <div className="flex flex-col gap-4">
                                {classes.map((className) => (
                                    <button
                                        key={className}
                                        type="button"
                                        className="rounded-2xl border-2 border-[#9166c4] bg-[#eedcff] px-5 py-4 text-xl font-bold text-black transition hover:bg-[#e5ccf7]"
                                    >
                                        {className}
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Área direita */}
                <section className="flex min-w-0 flex-1 items-center justify-center">
                    <div className="w-full max-w-3xl rounded-3xl bg-white p-10 shadow-2xl">
                        <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                            <h2 className="mb-4 text-3xl font-bold text-[#372a58]">
                                Selecione uma turma
                            </h2>

                            <p className="max-w-xl text-lg text-[#716886]">
                                Escolha uma turma ao lado para visualizar as
                                informações disponíveis.
                            </p>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}

export default TeacherHome;