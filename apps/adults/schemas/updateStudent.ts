import { type ImageCode, imageCodes } from "@codi-go/supabase";
import * as v from "valibot";

const imageCodeValues = Object.keys(imageCodes) as [ImageCode, ...ImageCode[]];

const studentNameRegex = /^\p{L}+(?: +\p{L}+)*$/u;

export const updateStudentSchema = v.object({
	name: v.pipe(
		v.string("O nome do aluno deve ser um texto."),
		v.trim(),
		v.nonEmpty("O nome do aluno é obrigatório."),
		v.regex(studentNameRegex, "O nome deve conter apenas letras e espaços."),
	),
	access_code: v.picklist(
		imageCodeValues,
		"O código de acesso deve ser uma imagem válida.",
	),
});

export type UpdateStudentOutput = v.InferOutput<typeof updateStudentSchema>;
