import {
	defineConfig,
	presetIcons,
	presetWind4,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";
import presetCodiGo from "@codi-go/ui/preset";

export default defineConfig({
	presets: [
		presetWind4({
			preflights: {
				reset: true,
			},
		}),
		presetIcons({
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle",
			},
		}),
		presetCodiGo,
	],
	transformers: [transformerDirectives(), transformerVariantGroup()],
});
