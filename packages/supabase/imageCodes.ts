export const imageCodes = {
	bunny: "/image_codes/bunny.png",
	capybara: "/image_codes/capybara.png",
	cat: "/image_codes/cat.png",
	dog: "/image_codes/dog.png",
	jellyfish: "/image_codes/jellyfish.png",
	lion: "/image_codes/lion.png",
	monkey: "/image_codes/monkey.png",
	otter: "/image_codes/otter.png",
	raccoon: "/image_codes/raccoon.png",
	squirrel: "/image_codes/squirrel.png",
	turtle: "/image_codes/turtle.png",
	whale: "/image_codes/whale.png",
};

export type ImageCode = keyof typeof imageCodes;

export function generateImageCode(): ImageCode {
	const codes = Object.keys(imageCodes) as ImageCode[];
	const randomValues = new Uint32Array(1);

	crypto.getRandomValues(randomValues);

	return codes[randomValues[0] % codes.length];
}
