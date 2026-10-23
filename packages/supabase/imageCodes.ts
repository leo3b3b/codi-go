export const imageCodes = {
	bunny: { src: "/animals/bunny.png", label: "Coelho" },
	capybara: { src: "/animals/capybara.png", label: "Capivara" },
	cat: { src: "/animals/cat.png", label: "Gato" },
	dog: { src: "/animals/dog.png", label: "Cachorro" },
	jellyfish: { src: "/animals/octopus.png", label: "Polvo" }, //! Legacy
	lion: { src: "/animals/lion.png", label: "Leão" },
	monkey: { src: "/animals/monkey.png", label: "Macaco" },
	otter: { src: "/animals/otter.png", label: "Lontra" },
	raccoon: { src: "/animals/sheep.png", label: "Ovelha" }, //! Legacy
	squirrel: { src: "/animals/squirrel.png", label: "Esquilo" },
	turtle: { src: "/animals/turtle.png", label: "Tartaruga" },
	whale: { src: "/animals/whale.png", label: "Baleia" },
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
