import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [UnoCSS(), react()],

	resolve: {
		alias: {
			"@": fileURLToPath(new URL(".", import.meta.url)),
		},
	},

	server: {
		port: 5174,
	},

	preview: {
		port: 4174,
	},
});
