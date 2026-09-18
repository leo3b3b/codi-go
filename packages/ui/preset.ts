import type { Preset } from 'unocss'

const presetCodiGo: Preset = {
    name: '@codi-go/ui',

    theme: {
        colors: {
            bg: 'var(--color-bg)',
            surface: 'var(--color-surface)',
            'surface-subtle': 'var(--color-surface-subtle)',
            fg: 'var(--color-fg)',
            heading: 'var(--color-heading)',
            primary: 'var(--color-primary)',
            'primary-hover': 'var(--color-primary-hover)',
            'primary-soft': 'var(--color-primary-soft)',
            'on-primary': 'var(--color-on-primary)',
            hero: 'var(--color-hero)',
            muted: 'var(--color-muted)',
            border: 'var(--color-border)',
            danger: 'var(--color-danger)',
            'danger-soft': 'var(--color-danger-soft)',
            'on-danger': 'var(--color-on-danger)',
        },
        boxShadow: {
            card: '0 20px 60px rgba(73, 57, 135, 0.14)',
            primary: '0 8px 18px rgba(86, 61, 186, 0.28)',
        },
    },
}

export default presetCodiGo
