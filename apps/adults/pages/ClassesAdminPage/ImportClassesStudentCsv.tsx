import { notifications } from "@codi-go/ui";
import { useRevalidator } from "react-router";
import {
	CsvImportWizard,
	type CsvRow,
	importClassesAndStudentsFromCsv,
} from "@/csv";

export function ImportClassesStudentsCsv({ school_id }: { school_id: string }) {
	const { revalidate } = useRevalidator();

async function handleImport(rows: CsvRow[]) {
	const result = await importClassesAndStudentsFromCsv({
		school_id,
		rows: rows.map((row) => ({
			className: row.className ?? "",
			studentName: row.studentName ?? "",
		})),
	});

	await revalidate();

	notifications.show({
		title: "Importação concluída",
		message: [
			`${result.createdClasses} turmas criadas.`,
			`${result.createdStudents} alunos cadastrados.`,
			`${result.skippedStudents} alunos ignorados por já existirem ou se repetirem.`,
			`${result.ignoredRows} linhas com aluno sem turma ignoradas.`,
		].join(" "),
		color: "green",
	});
}

	return (
		<CsvImportWizard
			title="Importar turmas e alunos por CSV"
			description="Mapeie a coluna das turmas e a coluna dos alunos. Cada linha relaciona um aluno à sua turma."
			fields={[
				{
					key: "className",
					label: "Coluna com os nomes das turmas",
				},
				{
					key: "studentName",
					label: "Coluna com os nomes dos alunos",
				},
			]}
			onImport={handleImport}
			failureMessage="Não foi possível concluir a importação. Como as turmas são processadas antes dos alunos, algumas turmas podem já ter sido criadas. Confira os dados e tente novamente."
		/>
	);
}
