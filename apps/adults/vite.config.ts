import { reactRouter } from "@react-router/dev/vite";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [reactRouter()],
	publicDir: fileURLToPath(new URL("../../public", import.meta.url)),

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
