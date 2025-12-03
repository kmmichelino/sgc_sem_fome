import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Login from './pages/Login'
import Home from './pages/Home'
import Estoque from './pages/Estoque'
import EntradaProdutos from './pages/EntradaProdutos'
import SaidaProdutos from './pages/SaidaProdutos'
import DoacoesFinanceiras from './pages/DoacoesFinanceiras'
import CadastroPatrocinadores from './pages/CadastroPatrocinadores'
import Beneficiados from './pages/Beneficiados'
import Voluntarios from './pages/Voluntarios'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return (
      <Router>
        <Login onLogin={() => setIsLoggedIn(true)} />
      </Router>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation onLogout={() => setIsLoggedIn(false)} />
        <main className="ml-64 flex-1 pb-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/entrada-produtos" element={<EntradaProdutos />} />
            <Route path="/saida-produtos" element={<SaidaProdutos />} />
            <Route path="/doacoes-financeiras" element={<DoacoesFinanceiras />} />
            <Route path="/cadastro-patrocinadores" element={<CadastroPatrocinadores />} />
            <Route path="/beneficiados" element={<Beneficiados />} />
            <Route path="/voluntarios" element={<Voluntarios />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App