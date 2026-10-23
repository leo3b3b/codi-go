import { generateImageCode, supabase } from "@codi-go/supabase";
import { generateClassAccessCode } from "@/services";
import {type CsvRow, cleanImportName, normalizeImportName} from "./utils";

export async function importStudentsFromCsv({
	class_id,
	school_id,
	names,
}: {
	class_id: string;
	school_id: string;
	names: string[];
}) {
	const requestedNames = names.map(cleanImportName).filter(Boolean);

	const { data: existingStudents, error: existingError } = await supabase
		.from("students")
		.select("name")
		.eq("class_id", class_id);

	if (existingError) throw existingError;

	const seen = new Set(
		existingStudents.map((student) => normalizeImportName(student.name)),
	);

	const namesToCreate: string[] = [];
	let skipped = 0;

	for (const name of requestedNames) {
		const key = normalizeImportName(name);

		if (seen.has(key)) {
			skipped++;
			continue;
		}

		seen.add(key);
		namesToCreate.push(name);
	}

	if (namesToCreate.length) {
		const { error } = await supabase.from("students").insert(
			namesToCreate.map((name) => ({
				name,
				class_id,
				school_id,
				access_code: generateImageCode(),
			})),
		);

		if (error) throw error;
	}

	return {
		created: namesToCreate.length,
		skipped,
		ignored: names.length - requestedNames.length,
	};
}

export async function importClassesAndStudentsFromCsv({
	school_id,
	rows,
}: {
	school_id: string;
	rows: CsvRow[];
}) {
	const normalizedRows = rows.map((row) => ({
		className: cleanImportName(row.className),
		studentName: cleanImportName(row.studentName),
	}));

	const { data: existingClasses, error: classesError } = await supabase
		.from("classes")
		.select("id, name")
		.eq("school_id", school_id);

	if (classesError) throw classesError;

	const classNames = new Map<string, string>();

	for (const row of normalizedRows) {
		if (!row.className) continue;

		const key = normalizeImportName(row.className);
		if (!classNames.has(key)) classNames.set(key, row.className);
	}

	const classesByName = new Map(
		existingClasses.map((classData) => [
			normalizeImportName(classData.name),
			classData,
		]),
	);

	const missingClasses = [...classNames.entries()]
		.filter(([key]) => !classesByName.has(key))
		.map(([, name]) => name);

	let createdClasses: { id: string; name: string }[] = [];

	if (missingClasses.length) {
		const { data, error } = await supabase
			.from("classes")
			.insert(
				missingClasses.map((name) => ({
					name,
					school_id,
					access_code: generateClassAccessCode(),
				})),
			)
			.select("id, name");

		if (error) throw error;

		createdClasses = data ?? [];
	}

	for (const classData of createdClasses) {
		const key = normalizeImportName(classData.name);
		if (!classesByName.has(key)) classesByName.set(key, classData);
	}

	const { data: existingStudents, error: studentsError } = await supabase
		.from("students")
		.select("class_id, name")
		.eq("school_id", school_id);

	if (studentsError) throw studentsError;

	const seenStudents = new Set(
		existingStudents.map(
			(student) => `${student.class_id}:${normalizeImportName(student.name)}`,
		),
	);

	const studentsToCreate: {
		name: string;
		class_id: string;
		school_id: string;
		access_code: string;
	}[] = [];

	let skippedStudents = 0;
	let ignoredRows = 0;

	for (const row of normalizedRows) {
		if (!row.className) {
			if (row.studentName) ignoredRows++;
			continue;
		}

		// Uma linha com turma, mas sem aluno, ainda pode criar a turma.
		if (!row.studentName) continue;

		const classData = classesByName.get(normalizeImportName(row.className));

		if (!classData) {
			ignoredRows++;
			continue;
		}

		const studentKey = `${classData.id}:${normalizeImportName(row.studentName)}`;

		if (seenStudents.has(studentKey)) {
			skippedStudents++;
			continue;
		}

		seenStudents.add(studentKey);

		studentsToCreate.push({
			name: row.studentName,
			class_id: classData.id,
			school_id,
			access_code: generateImageCode(),
		});
	}

	if (studentsToCreate.length) {
		const { error } = await supabase.from("students").insert(studentsToCreate);

		if (error) throw error;
	}

	return {
		createdClasses: createdClasses.length,
		createdStudents: studentsToCreate.length,
		skippedStudents,
		ignoredRows,
	};
}
