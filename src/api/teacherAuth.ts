import { supabase } from '../lib/supabaseClient'

export async function signInTeacher(email: string, password: string) {
  // Passo 1: autenticar de verdade, usando o sistema de login do
  // Supabase. Isso confere email/senha contra a tabela interna
  // "auth.users" e, se estiver certo, devolve o usuário autenticado.
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  const userId = data.user.id

  // Passo 2: agora que sabemos QUEM é (o auth.users.id), precisamos
  // descobrir O QUE ele pode fazer. Isso está em "schools_profiles",
  // lembra? Criamos ela como tabela associativa justamente porque uma
  // pessoa pode ter mais de um papel (teacher E admin, por exemplo).
  //
  // Por isso NÃO usamos .single() aqui: se usássemos, a consulta
  // quebraria com erro assim que uma pessoa tivesse 2 linhas (2 papéis).
  const { data: links, error: linksError } = await supabase
    .from('schools_profiles')
    .select('school_id, role')
    .eq('profile_id', userId)

  if (linksError) {
    throw linksError
  }

  if (!links || links.length === 0) {
    // Login funcionou, mas essa pessoa não está vinculada a nenhuma
    // escola ainda — isso é um erro de dado, não de senha.
    throw new Error('NO_SCHOOL_LINK')
  }

  return {
    user: data.user,
    schoolId: links[0].school_id,
    roles: links.map((link) => link.role), // ex: ['teacher'] ou ['teacher', 'admin']
  }
}
