import { type ImageCode, imageCodes } from "@codi-go/supabase";
import { notifications } from "@codi-go/ui";

export function getImageCode(value: string) {
	if (!Object.hasOwn(imageCodes, value)) return null;
	return imageCodes[value as ImageCode];
}

export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);

		notifications.show({
			message: "Copiado para a área de transferência",
			color: "teal",
			autoClose: 2000,
			withCloseButton: false,
		});

		return true;
	} catch {
		notifications.show({
			message: "Não foi possível copiar",
			color: "red",
			autoClose: 2000,
			withCloseButton: false,
		});

		return false;
	}
}
