import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  // presetWind3 é o conjunto "padrão" de classes utilitárias do UnoCSS
  // (flex, p-4, text-white, rounded-lg...), no estilo do Tailwind CSS.
  // Sem nenhum preset aqui, o UnoCSS fica configurado mas sem nenhuma
  // classe disponível pra usar.
  presets: [presetWind3()],
})