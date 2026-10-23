import Papa from "papaparse";

export type CsvRow = Record<string, string>;

export type CsvFileData = {
	headers: string[];
	rows: CsvRow[];
};

export function readCsvFile(file: File): Promise<CsvFileData> {
	return new Promise((resolve, reject) => {
		Papa.parse<Record<string, string>>(file, {
			header: true,
			skipEmptyLines: "greedy",
			transformHeader: (header) => header.trim(),
			complete: ({ data, meta, errors }) => {
				const headers = meta.fields ?? [];

				if (!headers.length || headers.some((header) => !header)) {
					reject(
						new Error(
							"O CSV precisa ter uma primeira linha com os nomes das colunas.",
						),
					);
					return;
				}

				if (errors.some(({ type }) => type === "Quotes")) {
					reject(new Error("Não foi possível interpretar as aspas do CSV."));
					return;
				}

				resolve({
					headers,
					rows: data.map((row) =>
						Object.fromEntries(
							headers.map((header) => [header, String(row[header] ?? "")]),
						),
					),
				});
			},
			error: () => reject(new Error("Não foi possível ler o arquivo CSV.")),
		});
	});
}

export function cleanImportName(value: string): string {
	return value.trim().replace(/\s+/g, " ");
}

export function normalizeImportName(value: string): string {
	return cleanImportName(value).toLocaleLowerCase("pt-BR");
}
