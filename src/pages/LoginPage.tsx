import { useState, type FormEvent } from 'react'
import { signInTeacher } from '../api/teacherAuth'
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  // useState guarda o que a pessoa está digitando. Toda vez que o valor
  // muda, o React redesenha o componente com o valor novo.
  const navigate = useNavigate()
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
      navigate('/teacher/classes')
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
  <main className="login-page">
    <section className="login-visual">
      <img
        className="login-mascot"
        src="/images/logo.png"
        alt="Mascote do CodiGO!"
      />

      <div className="login-message">
        <h1>Pronto para se aventurar?</h1>
        <p>
          Entre na sua conta e acompanhe a jornada dos seus alunos!
        </p>
      </div>
    </section>

    <section className="login-form-area">
      <div className="login-card">
        <img
          className="login-logo"
          src="/images/logo.png"
          alt="CodiGO!"
        />

        <h2>Bem-vindo!</h2>
        <p className="login-subtitle">
          Entre para continuar sua aventura.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              required
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              required
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && (
            <p className="login-error">{errorMessage}</p>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </section>
  </main>
)

}