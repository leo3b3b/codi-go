import { createTheme } from "@mantine/core";
import button from "./button.ts";

export const theme = createTheme({
	primaryColor: "violet",
	primaryShade: {
		light: 6,
		dark: 8,
	},

	colors: {
		gray: [
			"oklch(98.5% 0 0)",
			"oklch(97% 0 0)",
			"oklch(92.2% 0 0)",
			"oklch(87% 0 0)",
			"oklch(70.8% 0 0)",
			"oklch(55.6% 0 0)",
			"oklch(43.9% 0 0)",
			"oklch(37.1% 0 0)",
			"oklch(26.9% 0 0)",
			"oklch(20.5% 0 0)",
		],
	},

	components: {
		Container: {
			defaultProps: {
				size: "lg",
			},
		},

		Stack: {
			defaultProps: {
				gap: "md",
			},
		},

		Paper: {
			defaultProps: {
				radius: "lg",
				withBorder: true,
				bg: "var(--app-page-bg)",
				p: "lg",
			},
		},

		TextInput: {
			defaultProps: {
				size: "md",
				radius: "lg",
			},
		},

		PasswordInput: {
			defaultProps: {
				size: "md",
				radius: "lg",
			},
		},

		Button: button,

		Alert: {
			defaultProps: {
				variant: "outline",
				color: "red",
				radius: "lg",
			},
		},
	},
});
