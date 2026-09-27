import type { Preset } from "unocss";

const presetCodiGo: Preset = {
	name: "@codi-go/ui",

	theme: {
		colors: {
			bg: "var(--color-bg)",
			fg: "var(--color-fg)",
			heading: "var(--color-heading)",
			hero: "var(--color-hero)",
			muted: "var(--color-muted)",
			border: "var(--color-border)",
			surface: {
				DEFAULT: "var(--color-surface)",
				subtle: "var(--color-surface-subtle)",
			},
			primary: {
				DEFAULT: "var(--color-primary)",
				hover: "var(--color-primary-hover)",
				soft: "var(--color-primary-soft)",
			},
			danger: {
				DEFAULT: "var(--color-danger)",
				soft: "var(--color-danger-soft)",
			},
			on: {
				primary: "var(--color-on-primary)",
				danger: "var(--color-on-danger)",
			},
			grad: {
				base: "var(--color-grad-base)",
				via: "var(--color-grad-via)",
			},
		},
		boxShadow: {
			card: "0 20px 60px rgba(73, 57, 135, 0.14)",
			primary: "0 8px 18px rgba(86, 61, 186, 0.28)",
		},
	},
};

export default presetCodiGo;
