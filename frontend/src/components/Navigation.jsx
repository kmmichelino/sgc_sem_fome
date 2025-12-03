import { Link } from 'react-router-dom'

function Navigation({ onLogout }) {
  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          🏠 SGC - ONG SEM FOME
        </Link>
        <div className="nav-menu">
          <Link to="/beneficiados" className="nav-link">
            👥 Beneficiados
          </Link>
          <Link to="/entrada-produtos" className="nav-link">
            📥 Entrada de Produtos
          </Link>
          <Link to="/estoque" className="nav-link">
            📦 Estoque
          </Link>
          <Link to="/doacoes-financeiras" className="nav-link">
            💰 Financeiro
          </Link>
          <Link to="/cadastro-patrocinadores" className="nav-link">
            🤝 Patrocinadores
          </Link>
          <Link to="/saida-produtos" className="nav-link">
            📤 Saída de Produtos
          </Link>
          <Link to="/voluntarios" className="nav-link">
            🙋 Voluntários
          </Link>
        </div>
        <div className="user-menu" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
          <span className="user-info"><span style={{color: '#adb5bd'}}>👤</span> dev</span>
          <button onClick={onLogout} className="logout-btn" title="Sair" style={{marginTop: '4px'}}>
            🚪 Sair
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navigation