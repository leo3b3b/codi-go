import type { Preset } from 'unocss'

const presetCodiGo: Preset = {
    name: '@codi-go/ui',

    theme: {
        colors: {
            bg: 'var(--color-bg)',
            fg: 'var(--color-fg)',
            primary: 'var(--color-primary)',
            muted: 'var(--color-muted)',
        },
    },
}

export default presetCodiGo