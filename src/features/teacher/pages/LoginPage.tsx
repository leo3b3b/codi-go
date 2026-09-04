import { useState, type FormEvent } from 'react'
import { signInTeacher } from '../api/teacherAuth'

export function LoginPage() {
  // useState guarda o que a pessoa está digitando. Toda vez que o valor
  // muda, o React redesenha o componente com o valor novo.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // TODO: quando a tela de pontuação existir, importar useNavigate de
  // 'react-router-dom' aqui e trocar o alert() abaixo por um
  // navigate('/teacher/progress').

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Sem isso, o navegador recarregaria a página inteira ao enviar o
    // formulário (comportamento padrão do HTML), perdendo o estado do React.
    event.preventDefault()

    setErrorMessage(null)
    setLoading(true)

    try {
      const result = await signInTeacher(email, password)
      // Por enquanto só mostramos no console pra confirmar que funcionou.
      // Quando tivermos a próxima tela pronta, trocamos isso por um
      // navigate() de verdade.
      console.log('Login bem-sucedido:', result)
      alert(`Login funcionou! Papéis: ${result.roles.join(', ')}`)
    } catch (err) {
      if (err instanceof Error && err.message === 'NO_SCHOOL_LINK') {
        setErrorMessage('Este login não está vinculado a nenhuma escola.')
      } else {
        setErrorMessage('Email ou senha incorretos.')
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Login do professor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <br />
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
