import { createClient } from '@supabase/supabase-js'

// import.meta.env é como o Vite expõe as variáveis de ambiente pro código
// que roda no navegador (é diferente do Node, que usa process.env).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Essa checagem existe pra dar um erro CLARO e CEDO, assim que o app
// inicia, caso alguém esqueça de criar o .env.local. Sem isso, o erro só
// apareceria depois, de um jeito confuso, na hora de tentar logar.
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Variáveis do Supabase não configuradas. Copie .env.local.example para .env.local e preencha os valores (veja o README).',
  )
}

// createClient devolve um objeto "supabase" com tudo que a gente precisa:
// supabase.auth (login/cadastro) e supabase.from('tabela') (consultas).
// Criamos ele UMA vez aqui e importamos esse mesmo objeto em todo o app,
// em vez de criar um cliente novo em cada arquivo que precisar dele.
export const supabase = createClient(supabaseUrl, supabasePublishableKey)
