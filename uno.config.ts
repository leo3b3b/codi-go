import { defineConfig, presetIcons, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
    presets: [
        presetWind4({
            preflights: {
                reset: true
            }
        }),
        presetIcons({
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle'
            }
        }),
    ],
    theme: {
        colors: {
            bg: 'var(--color-bg)',
            fg: 'var(--color-fg)',
            primary: 'var(--color-primary)',
            muted: 'var(--color-muted)',
        },
    },
    transformers: [
        transformerDirectives(),
        transformerVariantGroup()
    ]
})