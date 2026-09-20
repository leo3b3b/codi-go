import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";

const repoRoot = import.meta.dirname;
const appRoot = process.cwd();

export default defineConfig({
	root: appRoot,
	envDir: repoRoot,

	plugins: [
		UnoCSS({
			configFile: path.resolve(repoRoot, "uno.config.ts"),
		}),
		react(),
	],

	resolve: {
		alias: {
			"@": appRoot,
		},
	},

	server: {
		port: path.basename(appRoot) === "adults" ? 5173 : 5174,
	},

	preview: {
		port: path.basename(appRoot) === "adults" ? 4173 : 4174,
	},
});
