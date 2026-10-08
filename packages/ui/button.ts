import {
    Button,
    parseThemeColor,
    type MantineTheme,
} from '@mantine/core';

function getDisabledColor(
    theme: MantineTheme,
    color: string,
): string | undefined {
    const parsed = parseThemeColor({
        color,
        theme,
    });

    if (!parsed.isThemeColor) {
        return undefined;
    }

    const shade = parsed.shade ?? 6;
    const disabledShade = Math.max(shade - 4, 0);

    return theme.colors[parsed.color][disabledShade];
}

const button = Button.extend({
    defaultProps: {
        variant: 'filled',
        size: 'md',
        radius: 'lg',
    },

    classNames: {
        root: 'custom-button',
    },

    styles: (theme, props) => {
        const color = props.color || theme.primaryColor;
        const disabledColor = getDisabledColor(theme, color);

        return {
            root: {
                ...(disabledColor
                    ? ({
                        '--custom-button-disabled-bg': disabledColor,
                    } as React.CSSProperties)
                    : {}),
            },
        };
    },
});

export default button;