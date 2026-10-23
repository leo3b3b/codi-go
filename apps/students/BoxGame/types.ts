export type Feedback = "idle" | "correct" | "incorrect";

export type BoxLevel = {
	id: number;
	name: string;
	boxObjects: ObjectType[];
	correctObject: ObjectType;
	alternatives: ObjectType[];
	explanation: string;
};

export const objectImages = {
	// Animals
	cat: { src: "/animals/cat.png", label: "Gato" },
	dog: { src: "/animals/dog.png", label: "Cachorro" },
	sheep: { src: "/animals/sheep.png", label: "Ovelha" },
	pig: { src: "/animals/pig.png", label: "Porco" },
	cow: { src: "/animals/cow.png", label: "Vaca" },
	duck: { src: "/animals/duck.png", label: "Pato" },

	// Fruits
	cherry: { src: "/fruits/cherry.png", label: "Cereja" },
	pineapple: { src: "/fruits/pineapple.png", label: "Abacaxi" },
	banana: { src: "/fruits/banana.png", label: "Banana" },
	apple: { src: "/fruits/apple.png", label: "Maçã" },
	orange: { src: "/fruits/orange.png", label: "Laranja" },
	watermelon: { src: "/fruits/watermelon.png", label: "Melancia" },
	mango: { src: "/fruits/mango.png", label: "Manga" },
} as const;

export type ObjectType = keyof typeof objectImages;
