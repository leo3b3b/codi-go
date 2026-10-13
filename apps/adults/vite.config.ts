import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [reactRouter()],
	publicDir: fileURLToPath(new URL("../../public", import.meta.url)),

	resolve: {
		alias: {
			"@": fileURLToPath(new URL(".", import.meta.url)),
			"+": fileURLToPath(
				new URL("./.react-router/types/pages/+types", import.meta.url),
			),
		},
	},

	server: {
		port: 5173,
	},

	preview: {
		port: 4173,
	},
});
