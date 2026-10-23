import { Icon, UI } from "@codi-go/ui";
import { useState } from "react";
import { type CsvRow, readCsvFile } from "./utils";

export type CsvImportField = {
	key: string;
	label: string;
};

type CsvImportWizardProps = {
	title: string;
	description: string;
	fields: CsvImportField[];
	onImport: (rows: CsvRow[]) => Promise<void>;
	failureMessage?: string;
};

export function CsvImportWizard({
	title,
	description,
	fields,
	onImport,
	failureMessage = "Não foi possível concluir a importação. Confira os dados e tente novamente.",
}: CsvImportWizardProps) {
	const [activeStep, setActiveStep] = useState(0);
	const [file, setFile] = useState<File | null>(null);
	const [headers, setHeaders] = useState<string[]>([]);
	const [rows, setRows] = useState<CsvRow[]>([]);
	const [mapping, setMapping] = useState<Record<string, string>>({});
	const [isImporting, setIsImporting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	async function handleFileChange(nextFile: File | null) {
		setFile(nextFile);
		setHeaders([]);
		setRows([]);
		setMapping({});
		setError(null);
		setSuccess(null);

		if (!nextFile) {
			setActiveStep(0);
			return;
		}

		try {
			const parsed = await readCsvFile(nextFile);

			if (!parsed.rows.length) {
				setError("O arquivo não possui linhas com dados para importar.");
				setActiveStep(0);
				return;
			}

			setHeaders(parsed.headers);
			setRows(parsed.rows);
			setMapping(
				Object.fromEntries(
					fields.map((field, index) => [
						field.key,
						parsed.headers[index] ?? "",
					]),
				),
			);
			setActiveStep(1);
		} catch {
			setError(
				"Não foi possível interpretar o CSV. Confira o arquivo e tente novamente.",
			);
			setActiveStep(0);
		}
	}

	const selectedHeaders = fields
		.map((field) => mapping[field.key])
		.filter(Boolean);

	const mappingIsValid =
		selectedHeaders.length === fields.length &&
		new Set(selectedHeaders).size === fields.length;

	const previewRows = rows
		.slice(0, 5)
		.map((row) =>
			Object.fromEntries(
				fields.map((field) => [field.key, row[mapping[field.key]] ?? ""]),
			),
		);

	async function handleImport() {
		if (!mappingIsValid || isImporting) return;

		setIsImporting(true);
		setError(null);

		try {
			const mappedRows = rows.map((row) =>
				Object.fromEntries(
					fields.map((field) => [field.key, row[mapping[field.key]] ?? ""]),
				),
			);

			await onImport(mappedRows);
			setSuccess("Os dados foram importados com sucesso.");
			setActiveStep(2);
		} catch {
			setError(failureMessage);
		} finally {
			setIsImporting(false);
		}
	}

	function resetWizard() {
		setActiveStep(0);
		setFile(null);
		setHeaders([]);
		setRows([]);
		setMapping({});
		setError(null);
		setSuccess(null);
	}

	return (
		<UI.Paper p="lg" withBorder>
			<UI.Stack gap="md">
				<UI.Group gap="sm" align="center">
					<UI.ThemeIcon variant="light" size="lg">
						<Icon.FileSpreadsheet size={20} />
					</UI.ThemeIcon>

					<div>
						<UI.Title order={2}>{title}</UI.Title>
						<UI.Text size="sm" c="dimmed">
							{description}
						</UI.Text>
					</div>
				</UI.Group>

				{error && (
					<UI.Alert color="red" title="Importação">
						{error}
					</UI.Alert>
				)}

				<UI.Stepper active={activeStep} allowNextStepsSelect={false}>
					<UI.Stepper.Step label="Arquivo" description="Selecione o CSV">
						<UI.Stack gap="md">
							<UI.Text size="sm">
								A primeira linha do arquivo deve conter os nomes das colunas.
								Arquivos exportados de planilhas brasileiras também são aceitos.
							</UI.Text>

							<UI.FileInput
								label="Arquivo CSV"
								placeholder="Selecione o arquivo"
								value={file}
								onChange={(nextFile) => void handleFileChange(nextFile)}
								accept=".csv,text/csv"
								leftSection={<Icon.Upload size={18} />}
								clearable
							/>
						</UI.Stack>
					</UI.Stepper.Step>

					<UI.Stepper.Step label="Mapeamento" description="Escolha as colunas">
						<UI.Stack gap="md">
							<UI.Text size="sm" c="dimmed">
								Arquivo: {file?.name} · {rows.length} linhas
							</UI.Text>

							{fields.map((field) => (
								<UI.Select
									key={field.key}
									label={field.label}
									placeholder="Selecione uma coluna"
									data={headers.map((header) => ({
										label: header,
										value: header,
									}))}
									value={mapping[field.key] ?? null}
									onChange={(value) =>
										setMapping((current) => ({
											...current,
											[field.key]: value ?? "",
										}))
									}
									required
								/>
							))}

							{!mappingIsValid && (
								<UI.Alert color="yellow">
									Selecione uma coluna diferente para cada campo.
								</UI.Alert>
							)}

							<UI.Text fw={600}>Prévia dos dados mapeados</UI.Text>

							<UI.Table striped highlightOnHover withTableBorder>
								<UI.Table.Thead>
									<UI.Table.Tr>
										{fields.map((field) => (
											<UI.Table.Th key={field.key}>{field.label}</UI.Table.Th>
										))}
									</UI.Table.Tr>
								</UI.Table.Thead>

								<UI.Table.Tbody>
									{previewRows.map((row, index) => (
										<UI.Table.Tr key={index}>
											{fields.map((field) => (
												<UI.Table.Td key={field.key}>
													{row[field.key] || "—"}
												</UI.Table.Td>
											))}
										</UI.Table.Tr>
									))}
								</UI.Table.Tbody>
							</UI.Table>

							{rows.length > 5 && (
								<UI.Text size="xs" c="dimmed">
									Exibindo as primeiras 5 de {rows.length} linhas.
								</UI.Text>
							)}

							<UI.Group justify="space-between" mt="sm">
								<UI.Button
									variant="default"
									onClick={() => setActiveStep(0)}
									disabled={isImporting}
								>
									Voltar
								</UI.Button>

								<UI.Button
									onClick={() => void handleImport()}
									loading={isImporting}
									disabled={!mappingIsValid || !rows.length}
								>
									Importar dados
								</UI.Button>
							</UI.Group>
						</UI.Stack>
					</UI.Stepper.Step>

					<UI.Stepper.Completed>
						<UI.Stack align="center" gap="md" py="md">
							<Icon.CircleCheck
								size={40}
								color="var(--mantine-color-green-6)"
							/>

							<UI.Title order={3}>Importação concluída</UI.Title>

							<UI.Text ta="center">{success}</UI.Text>

							<UI.Button onClick={resetWizard} variant="default">
								Importar outro arquivo
							</UI.Button>
						</UI.Stack>
					</UI.Stepper.Completed>
				</UI.Stepper>
			</UI.Stack>
		</UI.Paper>
	);
}
