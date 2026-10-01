export const imageCodes = {
	bunny: { src: "/image_codes/bunny.png", label: "Coelho" },
	capybara: { src: "/image_codes/capybara.png", label: "Capivara" },
	cat: { src: "/image_codes/cat.png", label: "Gato" },
	dog: { src: "/image_codes/dog.png", label: "Cachorro" },
	jellyfish: { src: "/image_codes/jellyfish.png", label: "Água-viva" },
	lion: { src: "/image_codes/lion.png", label: "Leão" },
	monkey: { src: "/image_codes/monkey.png", label: "Macaco" },
	otter: { src: "/image_codes/otter.png", label: "Lontra" },
	raccoon: { src: "/image_codes/raccoon.png", label: "Guaxinim" },
	squirrel: { src: "/image_codes/squirrel.png", label: "Esquilo" },
	turtle: { src: "/image_codes/turtle.png", label: "Tartaruga" },
	whale: { src: "/image_codes/whale.png", label: "Baleia" },
} as const satisfies Record<
	string,
	{
		src: string;
		label: string;
	}
>;

export type ImageCode = keyof typeof imageCodes;

export function generateImageCode(): ImageCode {
	const codes = Object.keys(imageCodes) as ImageCode[];
	const randomValues = new Uint32Array(1);

	crypto.getRandomValues(randomValues);

	return codes[randomValues[0] % codes.length];
}
