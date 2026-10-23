import { notifications } from "@codi-go/ui";
import { useRevalidator } from "react-router";
import { CsvImportWizard, type CsvRow, importStudentsFromCsv } from "@/csv";

export function ImportStudentsCsv({
	class_id,
	school_id,
}: {
	class_id: string;
	school_id: string;
}) {
	const { revalidate } = useRevalidator();

	async function handleImport(rows: CsvRow[]) {
		const result = await importStudentsFromCsv({
			class_id,
			school_id,
			names: rows.map((row) => row.name ?? ""),
		});

		await revalidate();

		notifications.show({
			title: "Importação concluída",
			message: [
				`${result.created} alunos cadastrados.`,
				`${result.skipped} ignorados por já existirem ou se repetirem.`,
				`${result.ignored} linhas vazias ignoradas.`,
			].join(" "),
			color: "green",
		});
	}

	return (
		<CsvImportWizard
			title="Importar alunos por CSV"
			description="Selecione uma coluna com os nomes dos alunos."
			fields={[
				{
					key: "name",
					label: "Coluna com os nomes dos alunos",
				},
			]}
			onImport={handleImport}
		/>
	);
}
