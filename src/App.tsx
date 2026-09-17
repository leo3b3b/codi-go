import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { ClassesPage } from './pages/ClassesPage'

function App() {
  return (
    <Routes>
      {/* Redireciona "/" pro login, por enquanto — quando o Leo e o Vini
      trouxerem as rotas deles, essa raiz provavelmente vira uma tela de
      escolha (sou professor / sou aluno / sou instituição). */}
      <Route path="/" element={<Navigate to="/teacher/login" />} />
      <Route path="/teacher/login" element={<LoginPage />} />
      <Route
        path="/teacher/classes"
        element={<ClassesPage />}
      />
    </Routes>
  )
}

export default App
