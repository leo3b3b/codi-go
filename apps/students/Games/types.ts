export type Feedback = "idle" | "correct" | "incorrect";

export const objectImages = {
	// Animals
	cat: { src: "/animals/cat.png", label: "Gato" },
	dog: { src: "/animals/dog.png", label: "Cachorro" },
	sheep: { src: "/animals/sheep.png", label: "Ovelha" },
	pig: { src: "/animals/pig.png", label: "Porco" },
	cow: { src: "/animals/cow.png", label: "Vaca" },
	duck: { src: "/animals/duck.png", label: "Pato" },

	// Fruits
	cherry: { src: "/fruits/red_cherries.png", label: "Cereja" },
	pineapple: { src: "/fruits/pineapple.png", label: "Abacaxi" },
	banana: { src: "/fruits/yellow_banana.png", label: "Banana" },
	apple: { src: "/fruits/red_apple_with_a_leaf.png", label: "Maçã" },
	orange: { src: "/fruits/orange_with_a_leaf.png", label: "Laranja" },
	watermelon: { src: "/fruits/watermelon_slice.png", label: "Melancia" },
	mango: { src: "/fruits/mango_with_a_leaf.png", label: "Manga" },

	// Art
	drum_kit: { src: "/art/drum_kit.png", label: "Bateria" },
	electric_guitar: { src: "/art/red_electric_guitar.png", label: "Guitarra" },
	piano: { src: "/art/dark_grand_piano.png", label: "Piano" },
	tambourine: { src: "/art/tambourine_with_jingles.png", label: "Pandeiro" },
	trombone: { src: "/art/yellow_trombone.png", label: "Trombone" },
	marker: { src: "/art/purple_marker.png", label: "Caneta" },
	paint: { src: "/art/red_paint.png", label: "Tinta" },
	crayons: { src: "/art/box_of_crayons.png", label: "Caixa de Giz" },
} as const;

export type ObjectType = keyof typeof objectImages;
