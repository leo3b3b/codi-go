import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import 'virtual:uno.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter precisa envolver tudo que usa rotas (Link, Routes,
    useNavigate, etc). Por isso ele fica aqui em cima, no topo do app. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
