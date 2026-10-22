import { Button, type MantineTheme, parseThemeColor } from "@mantine/core";

function getDisabledColor(
	theme: MantineTheme,
	color: string,
): string | undefined {
	const parsed = parseThemeColor({
		color,
		theme,
	});
	if (!parsed.isThemeColor) return undefined;

	const shade = parsed.shade ?? 6;
	const disabledShade = Math.max(shade - 4, 0);

	return theme.colors[parsed.color][disabledShade];
}

const button = Button.extend({
	defaultProps: {
		variant: "filled",
		size: "md",
		radius: "lg",
		mih: 40,
	},

	classNames: {
		root: "custom-button",
	},

	styles: (theme, props) => {
		const variant = props.variant ?? "filled";
		const color = props.color ?? theme.primaryColor;

		const disabledColor =
			variant === "filled"
				? getDisabledColor(theme, color)
				: "var(--mantine-color-disabled)";

		return {
			root: {
				"--custom-button-disabled-bg":
					disabledColor ?? "var(--mantine-color-disabled)",
			} as React.CSSProperties,
		};
	},
});

export default button;
