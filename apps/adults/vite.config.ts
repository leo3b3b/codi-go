import { reactRouter } from "@react-router/dev/vite";
import UnoCSS from "unocss/vite";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [UnoCSS(), reactRouter()],

	resolve: {
		alias: {
			"@": fileURLToPath(new URL(".", import.meta.url)),
		},
	},

	server: {
		port: 5173,
	},

	preview: {
		port: 4173,
	},
});
